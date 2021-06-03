import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  View,
  StyleSheet,
  BackHandler,
  FlatList,
} from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Axios, * as axios from 'axios'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'
import HomeAddress from '../components/AddressRow'
import AppBar from '../components/ui_components/AppBar'
import { Colors, dimen, Styles } from '../Constants'
import qs from 'qs'
import LottieView from 'lottie-react-native'
import { Config } from '../Constants'
import * as Location from 'expo-location'
import { ActivityIndicator } from 'react-native-paper'
import { MAPS_API_KEY, PLACES_API_KEY } from '@env'

const height = dimen.height

// List of addresses added by user

export default class AddressList extends React.Component {
  constructor(props) {
    super(props)
    this.location = {
      region: {},
    }
    this.state = {
      arraydata: [],
      somekey: 0,
      myAddresses: props.route.params.myAddresses === true ? true : false,
      apiLoaded: false,
      profileEdit: props.route.params.profileEdit === true ? true : false,
      vendorEdit: props.route.params.vendorEdit === true ? true : false,
      locationLoading: false,
      title: 'Addresses',
    }
    this.data = []

    this.words = {}
  }

  UNSAFE_componentWillReceiveProps(props) {}

  componentDidMount() {
    this.retrieveAddresses()
    const unsub = this.props.navigation.addListener('focus', () => {
      this.retrieveAddresses()
    })
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
    console.log('mount')
  }

  onComeBack = (item) => {
    if (item) this.retrieveAddresses()
  }

  onBackPress = () => {
    this.state.vendorEdit
      ? this.props.navigation.goBack()
      : this.state.myAddresses
      ? !this.state.profileEdit
        ? this.props.route.params.goBackToHome()
        : this.props.navigation.goBack()
      : this.props.navigation.goBack()
    return true
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
  }

  retrieveAddresses = () => {
    const { user_id } = this.props.route.params.actualUser
    var vendor_id
    if (this.state.vendorEdit) {
      vendor_id = this.props.route.params.actualVendor.vendor_id
    } else vendor_id = 0
    const data = this.state.vendorEdit
      ? qs.stringify({ vendor_id })
      : qs.stringify({ user_id })
    Axios.get(Config.api_url + 'php?action=getUserAddresses&' + data).then(
      (response) => {
        console.log('Addresses: ', response.data)
        this.data = response.data.addresses
        this.data = this.data.reverse()
        this.setState({ apiLoaded: true })
        this.setState({ somekey: Math.random(0.5) })
        this.setState({ title: 'My Addresses' })
      },
      (error) => {
        console.log('error', error)
      },
    )
  }

  popItem = (index) => {
    console.log(index, 'deleting')
    this.data.splice(index, 1)
    this.setState({ somekey: Math.random(0.5) })
  }

  setSelectedAddress = async (item) => {
    const jsonString = await JSON.stringify({ firstLogin: false })
    await AsyncStorage.setItem('firstLogin', jsonString)
    const jsonAddress = await JSON.stringify(item)
    await AsyncStorage.setItem('selectedAddress', jsonAddress)
    this.props.navigation.navigate('Homescreen')
  }

  renderSavedAddress = ({ item, index }) => {
    const { next, actualUser, tag } = this.props.route.params

    return (
      <HomeAddress
        routeparams={{ ...this.props.route.params }}
        item={{ ...item, type: 'pin' }}
        style={styles.horiz}
        deletae={this.state.myAddresses}
        route={{
          params: {
            next: next,
            actualUser: actualUser,
            tag: tag
          },
        }}
        popItem={this.popItem}
        index={index}
      />
    )
  }

  goToCurrentLocation = async () => {
    if (!this.state.locationLoading) {
      if (this.state.vendorEdit) {
        const { navigation } = this.props
        const { actualUser, tag } = this.props.route.params
        const { vendor_id } = this.props.route.params.actualVendor

        let { status } = await Location.requestPermissionsAsync();
        if (status === Location.PermissionStatus.GRANTED) {
          this.setState({ locationLoading: true })
          var location = await Location.getCurrentPositionAsync();
          this.setState({ locationLoading: false })
          navigation.navigate('AddAddress', {
            onComeBack: this.onComeBack,
            initialCamera: {
              center: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
              pitch: 0,
              heading: 0,
              zoom: 14,
              type: 1,
            },
            refresh: this.retrieveAddresses,
            actualUser: actualUser,
            placeName: ".",
            vendor_id: vendor_id,
            vendorEdit: true,
            tag: tag,
          })
        } else {
          alert(
            'Please grant the location permissions in order to add an address',
          )
        }
      } else {
        const { navigation } = this.props
        const { actualUser, tag } = this.props.route.params
        let { status } = await Location.requestPermissionsAsync()
        if (status === Location.PermissionStatus.GRANTED) {
          this.setState({ locationLoading: true })
          var location = await Location.getCurrentPositionAsync()
          this.setState({ locationLoading: false })
          navigation.navigate('AddAddress', {
            onComeBack: this.onComeBack,
            initialCamera: {
              center: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
              pitch: 0,
              heading: 0,
              zoom: 14,
              type: 1,
            },
            refresh: this.retrieveAddresses,
            actualUser: actualUser,
            placeName: '.',
            tag: tag,
          })
        } else {
          alert('Please grant location permissions in order to add an address')
        }
      }
    }
  }

  renderSeperator = () => {
    return (
      <View
        style={{
          padding: 0,
          backgroundColor: 'gray',
          width: '80%',
          height: 0,
          alignSelf: 'center',
          borderColor: Colors.seperatorGray,
          borderWidth: 0.3,
          borderRadius: 5,
        }}
      />
    )
  }

  addressSelected = async (data, details) => {
    const actualUser = this.props.route.params.actualUser
    const { tag } = this.props.route.params
    if (this.state.vendorEdit) {
      const { vendor_id } = this.props.route.params.actualVendor
      axios
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            place_id: details.place_id,
            key: `${MAPS_API_KEY}`,
          },
        })
        .then((response) => {
          let loc = response.data.results[0].geometry.location
          this.props.navigation.navigate('AddAddress', {
            onComeBack: this.onComeBack,
            initialCamera: {
              center: {
                latitude: loc.lat,
                longitude: loc.lng,
              },
              pitch: 0,
              heading: 0,
              zoom: 14,
              type: 1,
            },
            refresh: this.retrieveAddresses,
            actualUser: actualUser,
            placeName: data.description,
            vendor_id: vendor_id,
            vendorEdit: true,
            tag: tag,
          })
        })
    } else {
      console.log(data)
      console.log(details)
      console.log(details.place_id)
      axios
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            place_id: details.place_id,
            key: `${MAPS_API_KEY}`,
          },
        })
        .then((response) => {
          var locy = response.data.results[0].geometry.location
          console.log(locy)
          this.props.navigation.navigate('AddAddress', {
            onComeBack: this.onComeBack,
            initialCamera: {
              center: {
                latitude: locy.lat,
                longitude: locy.lng,
              },
              pitch: 0,
              heading: 0,
              zoom: 14,
              type: 1,
            },
            refresh: this.retrieveAddresses,
            actualUser: actualUser,
            placeName: data.description,
            tag: tag,
          })
        })
    }
  }

  evalnavi = () => {
    if (!this.state.myAddresses || this.state.profileEdit) return true
    return false
  }

  render() {
    if (this.data[0] == undefined)
      return (
        <View style={styles.container}>
          <AppBar
            title={'My Addresses'}
            back={this.props.route.params.profile}
            funct={() => {
              if (this.props.route.params.profile) this.props.navigation.pop()
              else this.props.navigation.toggleDrawer()
            }}
          />
          <View style={Styles.parentContainer}>
            <GooglePlacesAutocomplete
              style={{ elevation: 10, zIndex: 10, backgroundColor: 'white' }}
              query={{
                key: `${PLACES_API_KEY}`,
                language: 'en', // language of the results
                components: 'country:in',
                location: '12.972442,77.580643',
                radius: 100000,
              }}
              placeholder={'Type here to add a new address'}
              onPress={this.addressSelected}
              onFail={(error) => console.error(error)}
              styles={placesstyle}
              currentLocation={false}
              currentLocationLabel="Select Current Location"
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
            >
              {!this.state.apiLoaded ? (
                <LottieView
                  enableMergePathsAndroidForKitKatAndAbove
                  style={{ flex: 1, padding: 50, margin: 50 }}
                  source={require('../../assets/animations/logistics.json')}
                  resizeMode={'contain'}
                  autoPlay={true}
                  loop={true}
                />
              ) : (
                <View>
                  <TouchableOpacity onPress={this.goToCurrentLocation}>
                    <View style={styles.currentLocationContainer}>
                      {!this.state.locationLoading ? (
                        <Ionicons
                          name="ios-add"
                          size={24}
                          color={Colors.black}
                        />
                      ) : (
                        <ActivityIndicator
                          size={18}
                          color={Colors.primary}
                          style={{ padding: 3, margin: 6, height: 0 }}
                        />
                      )}
                      <Text style={styles.currentLocationText}>
                        Add Current Location
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={{ ...Styles.subbold }}>
                    No addresses to show, please add an address.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )

    return (
      <View style={styles.container}>
        <AppBar
          title={'My Addresses'}
          back={
            this.props.route.params.profile ||
            this.props.route.params.vendorEdit
          }
          funct={() => {
            if (
              this.props.route.params.profile ||
              this.props.route.params.vendorEdit
            )
              this.props.navigation.pop()
            else this.props.navigation.toggleDrawer()
          }}
        />

        <View style={Styles.parentContainer}>
          <GooglePlacesAutocomplete
            style={{ elevation: 10, zIndex: 10, backgroundColor: 'white' }}
            query={{
              key: `${PLACES_API_KEY}`,
              language: 'en', // language of the results
              components: 'country:in',
              location: '12.972442,77.580643',
              radius: 100000,
            }}
            placeholder={'Type here to add a new address'}
            onPress={this.addressSelected}
            onFail={(error) => console.error(error)}
            styles={placesstyle}
            currentLocation={false}
            currentLocationLabel="Select Current Location"
          />

          <View style={styles.savedaddresspanel}>
            <TouchableOpacity onPress={this.goToCurrentLocation}>
              <View style={styles.currentLocationContainer}>
                {!this.state.locationLoading ? (
                  <Ionicons name="ios-add" size={24} color={Colors.black} />
                ) : (
                  <ActivityIndicator
                    color={Colors.primary}
                    size={18}
                    style={{ padding: 3, margin: 6, height: 0 }}
                  />
                )}
                <Text style={styles.currentLocationText}>
                  Add current location
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.address}>SAVED ADDRESSES</Text>

            <FlatList
              data={this.data}
              renderItem={this.renderSavedAddress}
              extraData={this.state.somekey}
              ItemSeparatorComponent={this.renderSeperator}
              keyExtractor={(item, index) =>
                Math.random().toString(36).substr(2, 10)
              }
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  savedaddresspanel: {
    position: 'absolute',
    top: height / 10,
    zIndex: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#ecf0f1',
    padding: 0,
    zIndex: 200,
    backgroundColor: 'white',
  },
  address: {
    alignSelf: 'center',
    fontSize: 13,
    padding: 10,
    fontWeight: 'bold',
    color: 'black',
    width: '80%',
    maxHeight: 100,
  },
  horiz: {
    width: dimen.width - 50,
    height: dimen.height / 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    margin: 10,
  },
  home: {
    position: 'absolute',
    width: dimen.width - 50,
    height: dimen.height / 6 - 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: height / 7,
  },
  office: {
    position: 'absolute',
    top: height / 10 + height / 6,
    width: dimen.width - 50,
    height: dimen.height / 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentLocationContainer: {
    flexDirection: 'row',
    marginHorizontal: 25,
    marginBottom: 10,
    marginTop: 5,
    padding: 5,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.seperatorGray,
    borderRadius: 15,
  },
  currentLocationText: {
    ...Styles.subbold,
    marginHorizontal: 5,
  },
})

const placesstyle = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    top: '2%',
    width: '90%',
    zIndex: 100,
    borderWidth: 0,
    borderColor: 'gray',
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderLeftColor: 'gray',
    borderRightColor: 'gray',
    borderRadius: 0,
  },
  listView: {
    backgroundColor: 'white',
    padding: '1%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    width: '100%',
    backgroundColor: 'white',

    alignItems: 'center',

    //borderRadius: 10,
  },
  textInput: {
    fontWeight: 'bold',
    fontSize: 15,
    padding: '1%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  predefinedPlacesDescription: {
    color: 'black',
  },
  description: {
    color: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 11.5,
  },
  seperator: {
    width: '100%',
    color: 'gray',
    height: 0.5,
  },
  poweredContainer: {
    marginTop: 30,
    marginBottom: 5,
    marginRight: 5,
    alignItems: 'center',
  },
})
