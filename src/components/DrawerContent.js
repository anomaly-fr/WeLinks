import React, { useState, useEffect } from 'react'
import {
  Share,
  Button,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native'
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer'
import { NavigationContainer, useNavigation } from '@react-navigation/native'

import {
  Text,
  Drawer,
  Switch,
  TouchableRipple,
  Divider,
  Avatar,
} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import SupportFAQ from '../screens/SupportFAQ'
import { Constants, Colors, dimen } from '../Constants'
import auth from '@react-native-firebase/auth'
import Axios from 'axios'
import qs from 'qs'
import { Config } from '../Constants'
import { useAuth } from '../services/auth-service'

const DrawerContent = (props) => {
  const [vendor, setVendor] = useState(props.initVendor)
  const { switchVendor } = props
  const { setUser } = props
  const authContext = useAuth()
  const actualUser = authContext.user
  const [actualUsersas, setActualUser] = useState(props.actualUser)
  var cachedData, initialSubs
  const [verification, setVerification] = useState('')
  const [loading, setLoading] = useState('')
  const [pendingAction, setPendingActions] = useState('')
  const [actualVendor, setActualVendor] = useState(null)

  useEffect(() => {
    switchVendor(vendor)
    cachedData = props.cachedData
    initialSubs = props.initialSubs
    setActualUser(props.actualUser)
    if (vendor) {
      retreieveVendorData()
    }
  }, [
    vendor,
    props.cachedData,
    props.initialSubs,
    props.actualUser,
    authContext,
  ])

  const switchToVendor = async () => {
    props.setDefault()
    setVendor(!vendor)
    props.navigation.toggleDrawer()
  }

  const goToHomeStack = () => {
    props.navigation.navigate('HomeStack', {
      actualUser: actualUser,
      getUserDetails: props.getUserDetails,
      setActualUser: setActualUser,
    })
  }

  const retreieveVendorData = () => {
    const vend = authContext.vendor
    if (vend == Constants.veFirstTime) setVerification(Constants.veFirstTime)
    else if (vend == Constants.veInProgress)
      setVerification(Constants.veInProgress)
    else {
      if (vend.vendor_id != undefined) {
        setActualVendor(vend)
        setVerification(Constants.verified)
      }
    }
    // Axios.get(Config.api_url+'php?action=getVendor&user_id='+ actualUser.user_id,)
    //         .then((response)=>{
    //            setLoading(false);
    //             console.log("HEREs"+response.data.vendor.vendor_id)
    //             setVerification(Constants.veFirstTime) // uncomment this
    //         try{

    //             var status= response.data.vendor.vendor_status;
    //             if(status=== 'active'){
    //               setVerification(Constants.verified);
    //               setActualVendor(response.data.vendor);
    //               //messss
    //               messaging().subscribeToTopic("vendor"+response.data.vendor.vendor_id);
    //               setPendingActions(response.data.vendor.pending_actions.homescrap.length);
    //               if(response.data.vendor[0].pending_actions.homescrap.length)
    //                 setPendingActionItem(response.data.vendor.pending_actions.homescrap[0]);

    //             }
    //             else if(status=== 'inactive')
    //                 setVerification(Constants.veFirstTime)
    //             else
    //                 setVerification(Constants.veInProgress);
    //             //setVerification(Constants.veFirstTime);

    //         }
    //         catch(error){
    //             setVerification(Constants.veFirstTime);
    //             setLoading(false);

    //         }
    //     });
  }

  const goToVendorStack = () => {
    props.navigation.navigate('VendorHomeStack', {
      actualUser: actualUser,
      getUserDetails: props.getUserDetails,
      setActualUser: setActualUser,
    })
  }

  if (vendor)
    //props.navigation.navigate('Home');
    return (
      <View style={{ height: Dimensions.get('window').height }}>
        <DrawerContentScrollView {...props} scrollEnabled={true}>
          <View
            style={{
              height: Dimensions.get('window').height - StatusBar.currentHeight,
            }}
          >
            <Drawer.Section style={{ margin: 0 }}>
              <View style={styles.header}>
                {/* <Text style={{margin: '10%',color: 'white',fontSize: 30, fontWeight: 'bold'}}>WeLinks</Text> */}
                <View style={{ marginTop: '5%', margin: '5%' }}>
                  <Image
                    source={
                      actualVendor != null
                        ? actualVendor.vendor_img_url.trim() != ''
                          ? { uri: actualVendor.vendor_img_url }
                          : require('../../assets/notmaleavatar.png')
                        : require('../../assets/notmaleavatar.png')
                    }
                    style={{ height: 50, width: 50, marginTop: 10 }}
                  />
                </View>

                <Text style={styles.username}>
                  {actualVendor != null
                    ? actualVendor.company_name
                    : actualUser.name}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    marginStart: '5%',
                    marginTop: '1%',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="phone" color="gray" size={13} />
                    <Text
                      style={{
                        ...styles.username,
                        fontWeight: '200',
                        color: 'gray',
                        marginStart: '1%',
                        fontSize: 14,
                        alignSelf: 'center',
                      }}
                    >
                      {actualUser.phone}
                    </Text>
                  </View>
                </View>
              </View>
            </Drawer.Section>

            {actualVendor != null ? (
              actualVendor.vendor_status === 'active' ? (
                <Drawer.Section style={{ margin: dimen.height / 60 }}>
                  <Drawer.Item
                    style={{}}
                    icon="desktop-mac-dashboard"
                    label="Vendor Zone"
                    onPress={() => {
                      props.navigation.navigate('VendorHomeStack', {
                        actualUser: actualUser,
                        getUserDetails: props.getUserDetails,
                        setActualUser: setActualUser,
                        goBackToHome: goToVendorStack,
                      })
                    }}
                  />

                  <Drawer.Item
                    style={{}}
                    icon="account-outline"
                    label="Vendor Profile"
                    onPress={() => {
                      props.navigation.navigate('VendorProfileStack', {
                        actualUser: actualUser,

                        getUserDetails: props.getUserDetails,
                        setActualUser: setActualUser,
                        goBackToHome: goToVendorStack,
                        drawerRefresh: retreieveVendorData,
                        fromDrawer: true,
                      })
                    }}
                  />

                  <Drawer.Item
                    icon={({ color, size }) => (
                      <Icon name="share-outline" color={color} size={size} />
                    )}
                    label="Share App"
                    onPress={() => {
                      try {
                        const result = Share.share({
                          title: Constants.shareMessage,
                          message: Constants.shareMessage,
                        })
                        if (result.action == Share.sharedAction) {
                        }
                      } catch (e) {
                        console.log('some error around here')
                      }
                    }}
                  />
                  <Drawer.Item
                    icon="card-text-outline"
                    label="Support and FAQs"
                    onPress={() => {
                      props.navigation.navigate('VendorSupportStack', {
                        cachedData: cachedData,
                        actualUser: actualUser,
                        goBackToHome: goToVendorStack,
                      })
                    }}
                  />
                </Drawer.Section>
              ) : null
            ) : null}

            <Drawer.Section style={{ margin: '5%' }}>
              <Drawer.Item
                icon={({ color, size }) => (
                  <Icon name="account-box-multiple" color={color} size={size} />
                )}
                label="Switch to Consumer"
                onPress={switchToVendor}
              />

              <Drawer.Item
                style={styles.bottom}
                icon="exit-to-app"
                label="Sign Out"
                onPress={() => {
                  authContext.logout()
                  //  auth().signOut().then((value)=>{
                  //    setUser(null);
                  //  },(reason)=>{
                  //    setUser(null);
                  //  }).catch((reason)=>{
                  //    setUser(null);
                  //  });
                }}
              />
            </Drawer.Section>
            <View style={styles.versionSeperator} />
            <Text style={styles.version}>Version 1.0.0</Text>
          </View>
        </DrawerContentScrollView>
      </View>
    )

  return (
    <View style={{ height: Dimensions.get('window').height }}>
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        <View
          style={{
            height: Dimensions.get('window').height - StatusBar.currentHeight,
          }}
        >
          <Drawer.Section>
            <View style={styles.header}>
              <View style={{ marginTop: '5%', margin: '5%' }}>
                <Image
                  source={
                    actualUser.img_url.trim() != ''
                      ? { uri: actualUser.img_url }
                      : require('../../assets/notmaleavatar.png')
                  }
                  style={{ height: 50, width: 50, marginTop: 10 }}
                />
              </View>

              <Text style={styles.username}>{actualUser.name}</Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginStart: '5%',
                  marginTop: '1%',
                }}
              >
                <View style={{ marginTop: '0.7%' }}>
                  <Icon name="phone" color="gray" size={13} />
                </View>
                <Text
                  style={{
                    ...styles.username,
                    fontWeight: '200',
                    color: 'gray',
                    marginStart: '1%',
                    fontSize: 14,
                    alignSelf: 'center',
                  }}
                >
                  {actualUser.phone}
                </Text>
              </View>
            </View>
          </Drawer.Section>

          <Drawer.Section>
            <Drawer.Item
              style={{}}
              icon="home-outline"
              label="Consumer Zone"
              onPress={() => {
                props.navigation.navigate('HomeStack', {
                  actualUser: actualUser,
                  getUserDetails: props.getUserDetails,
                  setActualUser: setActualUser,
                  goToMySubs: () => {
                    props.navigation.navigate('MySubscriptions', {
                      initialSubs: initialSubs,
                      user: actualUser,
                      getUserDetails: props.getUserDetails,
                      setActualUser: setActualUser,
                      actualUser: actualUser,
                      goBackToHome: goToHomeStack,
                    })
                  },
                })
              }}
            />

            <Drawer.Item
              style={{}}
              icon="account-outline"
              label="My Profile"
              onPress={() => {
                props.navigation.navigate('ProfileStack', {
                  user: actualUser,
                  getUserDetails: props.getUserDetails,
                  setActualUser: setActualUser,
                  goBackToHome: goToHomeStack,
                })
              }}
            />

            <Drawer.Item
              icon="map-marker-outline"
              label="Addresses"
              onPress={() => {
                props.navigation.navigate('MyAddresses', {
                  actualUser: actualUser,
                  myAddresses: true,
                  profile: false,
                  goBackToHome: goToHomeStack,
                })
              }}
            />

            <Drawer.Item
              icon="wallet-outline"
              label="We Link Wallet"
              onPress={() => {
                props.navigation.navigate('WalletStack', {
                  actualUser: actualUser,
                  goToHomeStack: goToHomeStack,
                })
              }}
            />

            <Drawer.Item
              icon="cart-outline"
              label="My Subscriptions"
              onPress={() => {
                props.navigation.navigate('MySubscriptions', {
                  initialSubs: initialSubs,
                  user: actualUser,
                  getUserDetails: props.getUserDetails,
                  setActualUser: setActualUser,
                  actualUser: actualUser,
                  goBackToHome: goToHomeStack,
                })
              }}
            />

            <Drawer.Item
              icon="delete-circle-outline"
              label="My Scrap Sales"
              onPress={() => {
                props.navigation.navigate('MyScrapSales', {
                  initialSubs: initialSubs,
                  user: actualUser,
                  goBackToHome: goToHomeStack,
                  //navDrawer: props.navigation,
                })
              }}
            />
            <Drawer.Item
              icon={({ color, size }) => (
                <Icon name="share-outline" color={color} size={size} />
              )}
              label="Share App"
              onPress={() => {
                try {
                  const result = Share.share({
                    title: Constants.shareMessage,
                    message: Constants.shareMessage,
                  })
                  if (result.action == Share.sharedAction) {
                  }
                } catch (e) {
                  console.log('some error around here')
                }
              }}
            />
            <Drawer.Item
              icon="card-text-outline"
              label="Support and FAQs"
              onPress={() => {
                props.navigation.navigate('SupportStack', {
                  cachedData: cachedData,
                  actualUser: actualUser,
                  goBackToHome: goToHomeStack,
                })
              }}
            />
          </Drawer.Section>
          <Drawer.Section>
            <Drawer.Item
              icon={({ color, size }) => (
                <Icon name="account-box-multiple" color={color} size={size} />
              )}
              label="Switch to Vendor"
              onPress={switchToVendor}
            />

            <Drawer.Item
              style={styles.bottom}
              icon="exit-to-app"
              label="Sign Out"
              onPress={() => {
                authContext.logout()
                //  alert('Signing out');
                //  auth().signOut().
                //   then((value)=>{
                //     setUser(null);
                //   },(reason)=>{
                //     setUser(null);
                //   }).catch((reason)=>{
                //     setUser(null);
                //   })
              }}
            />
          </Drawer.Section>
          <View style={styles.versionSeperator} />
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </DrawerContentScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: dimen.mVm,

    flexDirection: 'column',
  },
  username: {
    marginStart: '6%',
    fontSize: 17,
    fontWeight: 'bold',
  },
  version: {
    color: 'gray',
    fontWeight: '500',
    fontSize: 14,
    position: 'absolute',
    bottom: 0,
    marginLeft: '5%',
    marginBottom: '2%',
    margin: '3%',
  },
  versionSeperator: {
    position: 'absolute',
    bottom: 35,
    height: 0.08,
    width: '95%',
    backgroundColor: 'rgba(211,211,211,5)',
  },
})

export default DrawerContent
