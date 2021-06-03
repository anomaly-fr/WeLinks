import * as React from 'react'
import { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import DrawerContent from '../components/DrawerContent'
import Axios from 'axios'
import MySubscriptions from '../screens/MySubscriptions'
import VendorSubscriptions from '../screens/VendorSubscriptions'
import VendorSubscriptionDetails from '../screens/VendorSubscriptionDetails'
import { Config } from '../Constants'
import VendorHomeStack from './VendorHomeStack'
import VendorProfileStack from './VendorProfileStack'
import UserSupportStack from './UserSupportStack'
import Homestack from './Homestack'
import WalletStack from './WalletStack'
import MyProfileStack from './MyProfileStack'
import MyAddressStack from './MyAddressesStack'
import MyScrapStack from './MyScrapStack'

//Carries reference to the drawer
var navv = undefined

const Drawer = createDrawerNavigator()

const NavigationDrawer = ({
  user,
  actualUser,
  getUserDetails,
  getVendorDetails,
  setUser,
  notificationStartup,
  initSubRoute,
  initSubParams,
  initRoute,
  initVendor,
}) => {
  const [vendor, setVendor] = useState(initVendor)
  const [updateState, setUpdateState] = useState(
    actualUser != null
      ? actualUser
      : { name: 'loading', user_id: -1, email: 'f' },
  )
  const [privacyData, setPrivacyData] = useState(null)
  const [termsData, setTermsData] = useState(null)
  const [contactUsData, setContactUsData] = useState(null)
  const [theActualUser, setTheActualUser] = useState(actualUser)
  const [initialRoute, setInitialRoute] = useState(
    initRoute != '' ? initRoute : 'HomeStack',
  )
  const [initialParams, setInitialParams] = useState({
    user: user,
    actualUser: theActualUser,
    initRoute: initSubRoute,
    initSubParams: initSubParams,
  })

  const updateChildScreens = async () => {
    const privacyUrl = Config.api_url + 'php?action=getPrivacyPolicy'
    const termsUrl = Config.api_url + 'php?action=getTerms'
    const contactUsUrl = Config.api_url + 'php?action=getContactUs&city_id='

    Axios.get(privacyUrl).then(({ data }) => setPrivacyData(data))
    Axios.get(termsUrl).then(({ data }) => setTermsData(data))
    if (user != null && actualUser.user_id != undefined) {
      Axios.get(contactUsUrl + actualUser.city_id).then(({ data }) =>
        setContactUsData(data),
      )
    }
  }

  const setDefaultValues = () => {
    setInitialRoute('')
    setInitialParams({ user: user, actualUser: theActualUser })
  }

  React.useEffect(() => {
    setUpdateState(actualUser != null ? actualUser : { name: 'loading' })
    updateChildScreens()
  }, [actualUser])

  const switchVendorApp = (flag) => setVendor(flag)

  if (vendor) {
    //Vendor App
    return (
      <NavigationContainer independent={true}>
        <Drawer.Navigator
          initialRouteName={initialRoute}
          drawerContent={(props) => {
            return (
              <DrawerContent
                {...props}
                getUserDetails={getUserDetails}
                setDefault={setDefaultValues}
                getVendorDetails={getVendorDetails}
                setUser={setUser}
                actualUser={updateState}
                switchVendor={switchVendorApp}
                initVendor={vendor}
                cachedData={{
                  termsData: termsData,
                  contactUsData: contactUsData,
                  privacyData: privacyData,
                }}
              />
            )
          }}
        >
          <Drawer.Screen
            name="VendorHomeStack"
            component={VendorHomeStack}
            initialParams={initialParams}
          />
          <Drawer.Screen
            name="VendorProfileStack"
            component={VendorProfileStack}
            initialParams={{
              user: user,
              actualUser: updateState,
            }}
          />
          <Drawer.Screen
            name="VendorSubscriptions"
            component={VendorSubscriptions}
            options={{ headerShown: false }}
          />
          <Drawer.Screen
            name="VendorSubscriptionDetails"
            component={VendorSubscriptionDetails}
            options={{ headerShown: false }}
          />
          <Drawer.Screen
            name="VendorSupportStack"
            component={UserSupportStack}
            initialParams={{
              user: user,
              actualUser: updateState,
              cachedData: {
                termsData: termsData,
                contactUsData: contactUsData,
                privacyData: privacyData,
              },
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    )
  }

  //User App
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName={initialRoute}
        drawerContent={(props) => {
          navv = props.navigation
          return (
            <DrawerContent
              {...props}
              getUserDetails={getUserDetails}
              setDefault={setDefaultValues}
              getVendorDetails={getVendorDetails}
              setUser={setUser}
              actualUser={updateState}
              switchVendor={switchVendorApp}
              initVendor={vendor}
              cachedData={{
                termsData: termsData,
                contactUsData: contactUsData,
                privacyData: privacyData,
              }}
            />
          )
        }}
      >
        <Drawer.Screen
          name="HomeStack"
          component={Homestack}
          initialParams={{
            user: user,
            actualUser: updateState,
            sm: 1,
            getUserDetails: getUserDetails,
            ...initialParams,
          }}
        />
        <Drawer.Screen name="WalletStack" component={WalletStack} />
        <Drawer.Screen
          name="ProfileStack"
          component={MyProfileStack}
          initialParams={{ actualUser: actualUser, user: user }}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="MyAddresses"
          component={MyAddressStack}
          initialParams={{ actualUser: updateState }}
        />
        <Drawer.Screen
          name="MySubscriptions"
          component={MySubscriptions}
          initialParams={{
            actualUser: actualUser,
            user: actualUser,
            goBackToHome: () => {
              navv.navigate('HomeStack')
            },
          }}
        />
        <Drawer.Screen
          name="MyScrapSales"
          component={MyScrapStack}
          initialParams={{
            user: actualUser,
            navv: navv,
            goBackToHome: () => {
              navv.navigate('HomeStack')
            },
          }}
        />
        <Drawer.Screen
          name="SupportStack"
          component={UserSupportStack}
          initialParams={{
            user: user,
            actualUser: updateState,
            cachedData: {
              termsData: termsData,
              contactUsData: contactUsData,
              privacyData: privacyData,
            },
          }}
        />
        <Drawer.Screen name="Wallet" component={WalletStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default NavigationDrawer
