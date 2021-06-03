import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  BackHandler,
  View,
  StyleSheet,
  Image,
  Alert,
} from 'react-native'
import { dimen, Styles } from '../Constants'
import { Colors } from '../Constants'
import { Text } from 'react-native-paper'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AppBar from '../components/ui_components/AppBar'
import Axios from 'axios'
import DocumentPicker from 'react-native-document-picker'
import qs from 'qs'
import { Config } from '../Constants'
import { useAuth } from '../services/auth-service'

const VendorProfile = ({ navigation, route }) => {
  const [profileDetails, setProfileDetails] = useState(route.params.actualUser) //[{name: 'holder',email: 'holder',subscription_count: 0,wallet_balance: 0,img_url: 0}]);
  const [loading, setLoading] = useState(false)
  const { actualUser } = route.params
  const authContext = useAuth()
  const VendorProfileDetails = authContext.vendor
  const [vendorImage, setVendorImage] = useState(' ')
  const vendorProfileStackNav = route.params.navDrawer
  const fromDrawer = route.params.fromDrawer
  const open = route.params
  console.log('OP', open)

  const isLoading = (msg = '', state) => {
    setLoading(state)
  }

  console.log('wth', route.params)

  const changeImage = async () => {
    try {
      isLoading('Loading', true)

      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      })
      var formdata = new FormData()
      if (res.size / 1000 > 50) {
        alert('Selected picture must be below 50kb')
        isLoading(false)
      } else {
        isLoading('Updating Profile', true)

        formdata.append('vendor_img_url', {
          uri: res.uri,
          type: 'image/jpeg',
          name: res.name,
        })
        console.log(
          'attempting to upload picture ' +
            profileDetails.user_id +
            ' ' +
            VendorProfileDetails.vendor_id +
            ' ' +
            VendorProfileDetails.addresses[0].addr_id,
        )
        Axios.post(
          Config.api_url +
            'php?' +
            qs.stringify({
              action: 'updateVendor',
              user_id: profileDetails.user_id,
              vendor_id: VendorProfileDetails.vendor_id,
              address_id: VendorProfileDetails.addresses[0].addr_id,
              update_data: 'profile'
            }),
          formdata,
        ).then(
          (response) => {
            console.log(response.data, 'picutre uploaded')

            isLoading(false)

            Alert.alert(
              'Profile updated',
              'Your company profile picture has been updated successfully',
            )
            authContext.sync() //retrieveData();
            //route.params.drawerRefresh()
          },
          (error) => {
            console.log(error)
            isLoading(false)

            alert(
              'Error uploading your profile picture, please try again later',
            )
          },
        )
      }
    } catch (error) {
      console.log(error)
      isLoading(false)

      alert('Please pick a valid jpeg or png image')
    }
  }

  const editVendorFunction = (services, milk, paper, office, home) => {
    console.log(services)
    console.log(milk)
    console.log(paper)
    console.log(office)
    console.log(home)

    console.log({
      user_id: actualUser.user_id,
      vendor_type: services,
      milk_product_ids: milk,
      news_product_ids: paper,
      officescrap_cat_ids: office,
      homescrap_product_ids: home,
    })
    var dataUnFormatted = qs.stringify({
      user_id: actualUser.user_id,
      vendor_id: VendorProfileDetails.vendor_id,
      update_data: 'services',
      vendor_type: services,
      milk_product_ids: milk,
      news_product_ids: paper,
      officescrap_cat_ids: office,
      homescrap_product_ids: home,
      address_id: VendorProfileDetails.addresses[0].addr_id,
    })
    var replaer = new RegExp('%5B.%5D', 'g')
    var dataFormatted = dataUnFormatted.replace(replaer, '[]')
    console.log(dataFormatted)

    // console.log(dataUnFormatted);
    Axios.post(
      Config.api_url + 'php?action=updateVendor&' + dataFormatted,
    ).then(
      (response) => {
        console.log(response)
        console.log(response.data)
        
        authContext.sync() //retrieveData();
        // checkVendorStatus();
      },
      (error) => {
        console.log(error)
      },
    )
  }

  const retrieveData = () => {
    Axios.get(
      Config.api_url + 'php?action=getVendor&user_id=' + actualUser.user_id,
    ).then(
      (response) => {
        try {
          setVPD(response.data.vendor)
          console.log('id' + response.data.vendor)

          setVendorImage(response.data.vendor.vendor_img_url)
  
          console.log('image ' + response.data.vendor.vendor_img_url)

        } catch (error) {

          console.log('the error ' + error)
        }
      },
      (error) => {
        console.log('error')
      },
    )

    console.log('mounted')
    console.log(route.params.actualUser)
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      //authContext.sync();
    })
  }, [route.params.actualUser])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log('goooooo', route.params.fromDrawer)

        // if from chip
        // hope.pop()

        // if from drawer
        // route.params.goBackToHome()

        console.log(fromDrawer)

        //if (fromDrawer)  Legacy
        route.params.goBackToHome()
        //else vendorProfileStackNav.pop()

        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, []),
  )

  const renderAddresses = () => {
    let addressArray = []
    for (let i in addresses) {
      addressArray.push(
        <View>
          <Text
            style={{
              ...styles.blackText,
              fontWeight: '900',
              color: 'gray',
              marginTop: '1%',
            }}
          >
            {addresses[i].addr_details}
          </Text>
        </View>,
      )
    }

    return addressArray
  }

  return (
    <View style={{ ...StyleSheet.absoluteFill }}>
      <View style={{ elevation: 100, zIndex: 100 }}>
        <AppBar
          title="Vendor Profile"
          funct={() => {
            //vendorProfileStackNav.toggleDrawer()

            // open.toggleDrawer()
            //  this.props.route.params.navDrawer.toggleDrawer()
            //from drawer
            //  vendorProfileStackNav.toggleDrawer()
            //  console.log('colder', route.params)
            //route.params.toggleDrawer()
            //  open.toggleDrawer()
            route.params.navDrawer.toggleDrawer()
          }}
        />
      </View>
      <View style={Styles.parentContainer}>
        <ScrollView>
          <View style={{ flex: 0, marginBottom: dimen.sHm }}>
            <View style={styles.header}>
              <View style={styles.avatarBG}>
                {VendorProfileDetails != null ? (
                  <Image // Change to Image
                    style={styles.avatar}
                    source={
                      VendorProfileDetails.vendor_img_url != ''
                        ? { uri: VendorProfileDetails.vendor_img_url }
                        : require('../../assets/notmaleavatar.png')
                    }
                    //  source={require('../../assets/notmaleavatar.png')}
                  />
                ) : null}
                <View style={{ position: 'absolute', bottom: '5%' }}>
                  <TouchableOpacity onPress={() => changeImage()}>
                    <Icon name="pencil" size={20} elevation={1} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.name}>
                {VendorProfileDetails.company_name}
              </Text>

              <View style={styles.chips}></View>
            </View>

            {/* Basic Details */}

            <View
              style={{
                borderWidth: 0.3,
                borderRadius: 10,
                marginHorizontal: '1%',
                elevation: 0.3,
                borderColor: Colors.seperatorGray,
                flex: 0,
                marginVertical: dimen.sHm / 4,
                justifyContent: 'flex-start',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EditVendorDetails', {
                    actualUser: profileDetails,
                    VendorProfileDetails: VendorProfileDetails,
                    refresh: retrieveData,
                  })
                }}
              >
                <View style={{ flexDirection: 'row', margin: '5%', flex: 0 }}>
                  <View style={{ marginTop: '1%' }}>
                    <Icon name="account-outline" color="black" size={30} />
                  </View>

                  <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={styles.blackText}>Vendor details</Text>
                    <Text
                      style={{
                        ...styles.blackText,
                        fontWeight: '900',
                        color: 'gray',
                        marginTop: '1%',
                      }}
                    >
                      {VendorProfileDetails.company_name}
                    </Text>
                    <Text
                      style={{
                        ...styles.blackText,
                        fontWeight: '900',
                        color: 'gray',
                        marginTop: '1%',
                      }}
                    >
                      {VendorProfileDetails.email}
                    </Text>
                    {/* <Text style={{ ...style.blackText, fontWeight: '900', color: 'gray', marginTop: '1%' }}>{VendorProfileDetails.addresses[0].addr_details + " \nNear "+ VendorProfileDetails.addresses[0].addr_landmark}</Text> */}
                  </View>
                  <View style={{ flex: 0 }}>
                    <Icon
                      name="chevron-right"
                      color={Colors.primary}
                      size={24}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Addresses Served */}
            <View
              style={{
                borderWidth: 0.3,
                borderRadius: 10,
                marginHorizontal: '1%',
                elevation: 0.3,
                borderColor: Colors.seperatorGray,
                flex: 0,
                marginVertical: dimen.sHm / 4,
                justifyContent: 'flex-start',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AddressList', {
                    //   myAddresses: true,
                    actualUser: actualUser,
                    actualVendor: { vendor_id: VendorProfileDetails.vendor_id },
                    vendorEdit: true,
                    myAddresses: true,
                    profile: true,
                  })
                }}
              >
                <View style={{ flexDirection: 'row', margin: '5%', flex: 0 }}>
                  <View style={{ marginTop: '1%' }}>
                    <Icon name="map-marker-outline" color="black" size={30} />
                  </View>

                  <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text
                      style={{
                        ...styles.blackText,
                        marginBottom: dimen.height / 70,
                      }}
                    >
                      Addresses Served
                    </Text>
                    {/* 
                                    uncomment this to render addresses in place
                                    {renderAddresses()} 
                                    */}
                  </View>
                  <View style={{ flex: 0 }}>
                    <Icon
                      name="chevron-right"
                      color={Colors.primary}
                      size={24}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {/* Products */}
            <View
              style={{
                borderWidth: 0.3,
                borderRadius: 10,
                marginHorizontal: '1%',
                elevation: 0.3,
                borderColor: Colors.seperatorGray,
                flex: 0,
                marginVertical: dimen.sHm / 4,
                justifyContent: 'flex-start',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('VendorServices', {
                    back: true,
                    editVendorFunction: editVendorFunction,
                    vendorEdit: true,
                    actualVendor: VendorProfileDetails,
                  })
                }}
              >
                <View style={{ flexDirection: 'row', margin: '5%', flex: 0 }}>
                  <View style={{ marginTop: '1%' }}>
                    <Icon name="id-card" color="black" size={30} />
                  </View>

                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      backgroundColor: 'white',
                    }}
                  >
                    <Text
                      style={{
                        ...styles.blackText,
                        marginBottom: dimen.sHm / 5,
                      }}
                    >
                      My Services & Products
                    </Text>
                    {VendorProfileDetails.newspaper_service === 'yes' ? (
                      <Text
                        style={{ ...styles.grayText, fontSize: 12, margin: 0 }}
                      >
                        Newspaper Delivery
                      </Text>
                    ) : null}
                    {VendorProfileDetails.milk_service === 'yes' ? (
                      <Text
                        style={{ ...styles.grayText, fontSize: 12, margin: 0 }}
                      >
                        Milk Delivery
                      </Text>
                    ) : null}
                    {VendorProfileDetails.homescrap_service === 'yes' ? (
                      <Text
                        style={{ ...styles.grayText, fontSize: 12, margin: 0 }}
                      >
                        Home Scrap
                      </Text>
                    ) : null}
                    {VendorProfileDetails.officescrap_service === 'yes' ? (
                      <Text
                        style={{ ...styles.grayText, fontSize: 12, margin: 0 }}
                      >
                        Office Scrap
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ flex: 0 }}>
                    <Icon
                      name="chevron-right"
                      color={Colors.primary}
                      size={24}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: dimen.height / 30, width: dimen.width }} />
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: '1%',
  },
  header: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',

    height: dimen.height / 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
    borderRadius: 1000,
  },
  avatarBG: {
    height: dimen.width / 3.5,
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  chips: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: dimen.width,
    marginTop: '5%',
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: Colors.seperatorGray,
    color: 'white',
    padding: '2%',
    width: dimen.width / 3.2,
    textAlign: 'center',
    fontSize: 10,
    margin: '1%',
  },
  blackText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginStart: dimen.sHm * 2,
  },
  name: {
    color: 'white',
    fontSize: 15,
    marginVertical: '3%',
  },
  grayText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginStart: dimen.sHm * 2,
    color: 'gray',
  },
})

export default VendorProfile
