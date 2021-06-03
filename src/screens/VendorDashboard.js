import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native'
import Axios from 'axios'
import { EvilIcons } from '@expo/vector-icons'
import { dimen, Colours, Styles, Config } from '../Constants'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../services/auth-service'
class VendorDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      actualUser: this.props.route.params.actualUser,
      vendorDetails: {
        company_name: '',
      },
      actualVendor: 'Loading',
      imageHeight: 0,
      validVendor: true,
      vendorID: this.props.route.params.vendorID,
    }
    this.images = {
      milk: require('./../../assets/milk-icon.png'),
      news: require('./../../assets/newspaper-icon.png'),
      scrap: require('./../../assets/home-scrap-icon.png'),
      corporate: require('./../../assets/corporate-scrap-icon.png'),
    }
  }

  retrieveVendorData = async () => {
    console.log(this.state.actualUser.user_id + 'userid')
    Axios.get(
      Config.api_url +
        'php?action=getVendorStatus&user_id=' +
        this.state.actualUser.user_id,
    ).then(
      (response) => {
        try {
          console.log('VID' + response.data.vendor[0].vendor_id)
          this.setState({ vendorID: response.data.vendor[0].vendor_id })

          Axios.get(
            Config.api_url +
              'php?action=getVendor&vendor_id=' +
              this.state.vendorID,
          ).then(
            (response) => {
              try {
                console.log('vendor' + JSON.stringify(response.data.vendor))
                this.setState({ vendorDetails: response.data.vendor })
                //    this.setState({actualVendor : this.state.vendorDetails.company_name})
                //  console.log('Vd' + this.state.actualVendor)
              } catch (error) {
                this.setState({ validVendor: false })

                console.log('the error' + error)
              }
            },
            (error) => {
              console.log('error')
            },
          )

          //    this.setState({actualVendor : this.state.vendorDetails.company_name})
          //  console.log('Vd' + this.state.actualVendor)
        } catch (error) {
          this.setState({ validVendor: false })

          console.log('theerror' + error)
        }
      },
      (error) => {
        console.log('error')
      },
    )
  }
  componentDidMount() {
    const { navigation } = this.props
    console.log('Userid' + this.state.actualUser.user_id)

    this.retrieveVendorData()
    //       this.setState({actualUser: this.props.actualUser});
    this.focusListener = navigation.addListener('focus', () => {
      //        this.setState({actualUser: this.props.actualUser});
      this.retrieveVendorData()
    })
  }

  render() {
    const { navigation, otherNavigation } = this.props

    console.log('GO ', this.props)
    //      console.log('actual'+ this.state.actualUser.name)

    return (
      <View style={styles.fullscreen}>
        <View style={styles.topbar}>
          <TouchableOpacity
            onPress={() => {
              // this.setState({pressedMenu: true});
              this.props.route.params.navDrawer.toggleDrawer()
            }}
          >
            <EvilIcons
              name="navicon"
              size={24}
              color="black"
              style={{ alignSelf: 'center', padding: 10 }}
            />
          </TouchableOpacity>
          <View style={styles.topBarAlignChips}>
            <ProfileSmallView
              classRef={this}
              navigation={this.props.route.params.navDrawer}
              userID={this.state.actualUser.user_id}
              navDrawer={this.props.route.navDrawer}
              goBackToHome={this.props.route.params.goBackToHome}
              //   goBackToHome={goBackToHome}
            />
          </View>
        </View>

        <Text style={{ ...Styles.heading, alignSelf: 'center', margin: '2%' }}>
          Vendor Dashboard
        </Text>
        <Text
          style={{
            ...Styles.heading,
            margin: '2%',
            alignSelf: 'center',
            fontSize: 14,
          }}
        >
          My Services
        </Text>
        {this.state.vendorDetails != {} &&
        this.state.vendorDetails != undefined &&
        this.state.vendorDetails != null ? (
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.view1}>
              {this.state.vendorDetails.milk_service == 'yes' ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('VendorSubscriptions', {
                      vendorID: this.state.vendorID,
                      tag: 'Milk',
                    })
                  }}
                  onLayout={(event) => {
                    this.setState({
                      imageHeight: event.nativeEvent.layout.height / 2,
                    })
                  }}
                  style={styles.menuitem}

                  //this.props.navigation.navigate('MilkVendors')}
                >
                  <Image
                    style={{
                      ...styles.menuimage,
                      height: this.state.imageHeight,
                    }}
                    source={this.images.milk}
                  />
                  <Text
                    style={{
                      ...styles.menutext,
                      marginTop: (this.state.imageHeight * 2) / 20,
                    }}
                  >
                    Milk Delivery
                  </Text>
                </TouchableOpacity>
              ) : null}
              {this.state.vendorDetails.newspaper_service == 'yes' ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('VendorSubscriptions', {
                      vendorID: this.state.vendorID,
                      tag: 'Paper',
                    })
                  }}
                  onLayout={(event) => {
                    this.setState({
                      imageHeight: event.nativeEvent.layout.height / 2,
                    })
                  }}
                  style={styles.menuitem}
                >
                  <Image
                    style={{
                      ...styles.menuimage,
                      height: this.state.imageHeight,
                    }}
                    source={this.images.news}
                  />
                  <Text
                    style={{
                      ...styles.menutext,
                      marginTop: (this.state.imageHeight * 2) / 20,
                    }}
                  >
                    Newspaper Delivery
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.view1}>
              {this.state.vendorDetails.homescrap_service == 'yes' ? (
                <TouchableOpacity
                  style={styles.menuitem}
                  onPress={() => {
                    navigation.navigate('VendorScrapOrders', {
                      vendorID: this.state.vendorID,
                    })
                  }}
                  onLayout={(event) => {
                    this.setState({
                      imageHeight: event.nativeEvent.layout.height / 2,
                    })
                  }}
                >
                  <Image
                    style={{
                      ...styles.menuimage,
                      height: this.state.imageHeight,
                    }}
                    source={this.images.scrap}
                  />
                  <Text
                    style={{
                      ...styles.menutext,
                      marginTop: (this.state.imageHeight * 2) / 20,
                    }}
                  >
                    Home Scrap Collection
                  </Text>
                </TouchableOpacity>
              ) : null}
              {this.state.vendorDetails.officescrap_service == 'yes' ? (
                <TouchableOpacity
                  style={styles.menuitem}
                  onPress={() => {
                    console.log('Vendor')
                    navigation.navigate('VendorViewBids', {
                      vendorID: this.state.vendorID,
                      actualUser: this.state.actualUser,
                    })
                  }}
                  onLayout={(event) => {
                    this.setState({
                      imageHeight: event.nativeEvent.layout.height / 2,
                    })
                  }}
                >
                  <Image
                    style={{
                      ...styles.menuimage,
                      height: this.state.imageHeight,
                    }}
                    source={this.images.corporate}
                  />
                  <Text
                    style={{
                      ...styles.menutext,
                      marginTop: (this.state.imageHeight * 2) / 22,
                    }}
                  >
                    Corporate Scrap Collection
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </ScrollView>
        ) : (
          <View
            onLayout={() => console.log('no data')}
            style={{ ...StyleSheet.absoluteFill }}
          >
            {/* <Text>No services</Text> */}
          </View>
        )}
      </View>
    )
  }
}

const ProfileSmallView = ({ navigation, userID, classRef, goBackToHome }) => {
  console.log('userid ? ' + userID)
  const authContext = useAuth()
  const [vendor, sw] = useState(authContext.vendor)
  const [image, setImage] = useState('')
  console.log('Sending ', classRef.props.route.params)

  useEffect(() => {
    sw(authContext.vendor)
    console.log('bizzzzzzzzzzzzzz', authContext.vendor.vendor_img_url)
    setImage(authContext.vendor.vendor_img_url)

    // navigation.addListener('focus', () => {
    //   BackHandler.addEventListener('hardwareBackPress', () => {
    //     //doNothing
    //     console.log('hardwareback')
    //     return true
    //   })
    // })
  }, [authContext])

  return (
    <TouchableOpacity
      style={styles.usernamecontainer1}
      onPress={() => {
        navigation.navigate('VendorProfileStack', {
          vendor: vendor,
          goBackToHome: () => {
            navigation.navigate('VendorHomeStack')
          },
          //     moreProps: classRef.props.route.params,
        })
      }}
    >
      <Image
        style={styles.userimage}
        source={{ uri: authContext.vendor.vendor_img_url }}
      />
      <Text adjustsFontSizeToFit style={styles.username}>
        {vendor.company_name}
      </Text>
    </TouchableOpacity>
  )
}

export default function (props) {
  const navigation = useNavigation()

  return (
    <VendorDashboard
      {...props}
      navigation={navigation}
      otherNavigation={props.navigation}
      route={props.route}
    />
  )
}

const styles = StyleSheet.create({
  deliveringcontainer: {
    height: '0%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    bottom: 0,
    zIndex: 100,
    elevation: 100,
  },
  deliveringTitle: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
    color: 'black',
  },
  address: {
    fontWeight: '700',
    marginLeft: 10,
    marginBottom: 3,
    marginRight: 3,
    fontSize: 15,
  },
  fullscreen: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: 'white',
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '7%',
    width: '100%',
    marginBottom: '5%',
    alignContent: 'center',
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.37,
    shadowRadius: 6.49,
    elevation: 3,
  },

  usernamecontainer: {
    alignSelf: 'center',
    width: dimen.width / 3,
    flexDirection: 'row',
    alignContent: 'center',
    borderRadius: 100,
    borderWidth: 0.525,
    borderColor: 'rgba(211,211,211,255)',
    padding: 10,
    justifyContent: 'center',
    marginLeft: dimen.width * 0.005,
    marginRight: dimen.width * 0.02,
  },

  usernamecontainer1: {
    flexDirection: 'row',
    borderRadius: 100,
    borderWidth: 0.525,
    borderColor: 'rgba(211,211,211,255)',
    padding: '3%',
    paddingVertical: '0.5%',
    alignItems: 'center',
    justifyContent: 'space-evenly',

    height: '70%',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,

    alignSelf: 'center',
    color: 'black',
    paddingVertical: '1%',
    paddingHorizontal: '2%',
  },
  topBarAlignChips: {
    flexDirection: 'row',
    width: dimen.width - 50,
    alignSelf: 'center',
    justifyContent: 'space-between',
    height: '100%',
    alignItems: 'center',
  },

  userdes: {
    fontSize: 11,
    alignSelf: 'center',
  },
  userimage: {
    height: dimen.height * 0.023,
    width: dimen.height * 0.023,
  },
  locim: {
    height: dimen.height * 0.018,
    width: dimen.height * 0.018,
  },
  city: {
    fontWeight: '600',
    fontSize: 13,
    color: 'black',
    fontWeight: 'bold',
  },
  banner: {
    width: dimen.width - 5,
    height: dimen.height / 3.5,
    alignSelf: 'center',
    borderRadius: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 30,
    alignSelf: 'flex-start',
    color: 'black',
  },
  desc: {
    fontSize: 14,
    color: 'gray',
    marginTop: 3,
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  horizontalview: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  view1: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
    marginTop: '6%',
  },
  menuitem: {
    height: dimen.width / 2.95,
    width: dimen.width / 3 - 25,
    margin: 10,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,

    backgroundColor: 'rgba(255,255,255,255)',
    padding: 8,
    borderRadius: 5,
  },
  menuimage: {
    height: '70%',
    width: '70%',
    alignSelf: 'center',
  },
  menutext: {
    fontWeight: 'bold',
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
    color: 'black',
  },
  imageBanner: {
    width: dimen.width - 100,
    height: '100%',
    marginRight: 15,
    alignSelf: 'flex-start',
  },
})
