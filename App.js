import * as React from 'react'
import { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Introduction from './src/screens/Introduction'
import LoginScreen from './src/screens/Login'
import About from './src/screens/About'
import { Styles } from './src/Constants'
import LottieView from 'lottie-react-native'
import { notification_identifiers as nos } from './src/Constants'
import ScrapPickedConfirmation from './src/screens/ScrapPickedConfirmation'
import { Notifications } from 'react-native-notifications'
import { useAuth, AuthConstants } from './src/services/auth-service'
import { TouchableOpacity } from 'react-native-gesture-handler'
import NavigationDrawer from './src/navigation/NavigationDrawer'

//Enabling legacy geolocation for location services
navigator.geolocation = require('@react-native-community/geolocation')

// export default function App(){
//   return (<View style={{backgroundColor: 'blue', ...StyleSheet.absoluteFill}}></View>)
// }
export default function App() {
  const Stack = createStackNavigator()
  const debug = false //DEBUG

  const [firstlogin, setFirstLog] = useState(0)
  const [user, setUser] = useState(null)
  const authContext = useAuth()
  const use = authContext.user //useState(debug ? { phoneNumber: '+918548080255' } : auth().currentUser);
  const [userDetails, setUserDetails] = useState(null)
  const [networkState, setNetworkState] = useState(true)
  const [splash, setSplash] = useState(true)
  const [status, setStatus] = useState('no status')
  const [pendingAction, setPendingAction] = useState(0)
  const [pendingActionItem, setPendingActionItem] = useState(null)
  const [notificationStarup, setNotificationStatup] = useState(nos.misc)
  const [initRoute, setInitRoute] = useState('')
  const [initSubRoute, setInitSubRoute] = useState('')
  const [initSubParams, setInitSubParams] = useState('')
  const [initVendor, setInitVendor] = useState(false)

  const getUserDetails = async (networkTries, user, nextRoute = 0) => {
    authContext.sync()
  }

  const setStartup = (
    initRoute,
    initSubRoute,
    initSubParams = {},
    vendor = false,
  ) => {
    setInitRoute(initRoute)
    setInitSubRoute(initSubRoute)
    setInitSubParams(initSubParams)
    setInitVendor(vendor)
  }

  //Notification launching different screens
  const handleNotification = (notification) => {
    try {
      const id = notification.payload.identifier
      setNotificationStatup(id)

      var subParams = {}
      var ven = false,
        subRoute = '',
        route = ''
      switch (id) {
        case nos.vendor_milk_subscriptions:
          subParams = { tag: 'Milk' }
          setStartup('VendorHomeStack', 'VendorSubscriptions', subParams, true)
          break
        case nos.vendor_newspaper_subscriptions:
          subParams = { tag: 'Paper' }
          setStartup('VendorHomeStack', 'VendorSubscriptions', subParams, true)
          break
        case nos.vendor_scrap_orders:
          setStartup('VendorHomeStack', 'VendorScrapOrders', {}, true)
          break
        case nos.vendor_corporate_orders:
          setStartup('VendorHomeStack', 'VendorViewBids', {}, true)
          break
        case nos.user_newspaper_subscriptions:
        case nos.user_milk_subscriptions:
          setStartup('MySubscriptions', '')
          break
        case nos.user_corporate_orders:
          setStartup('HomeStack', 'Bids')

          break
        case nos.user_scrap_orders:
          setStartup('MyScrapSales', '')
          break
      }
    } catch (error) {
      console.log('berrror')
    }
  }

  React.useEffect(() => {
    Notifications.events().registerNotificationOpened((notification) => {
      setSplash(true)
      handleNotification(notification)
      setSplash(false)
    })

    Notifications.getInitialNotification().then((notification) => {
      handleNotification(notification)
    })
  }, [])

  if (use == AuthConstants.errored)
    return (
      <TouchableOpacity
        onPress={() => {
          authContext.checkFirstTime()
        }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}
        >
          <Text
            style={{
              ...Styles.heading,
              alignSelf: 'center',
              textAlign: 'center',
            }}
          >
            Network connection failed, Try again later (Touch to refresh)
          </Text>
        </View>
      </TouchableOpacity>
    )
  if (use == AuthConstants.phone_unverified)
    return (
      <View style={{ flex: 1 }}>
        <NavigationContainer independent={true}>
          <Stack.Navigator>
            <Stack.Screen
              name="Introduction"
              component={Introduction}
              options={{
                headerShown: false,
              }}
              initialParams={{ getUserDetailsa: getUserDetails }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              initialParams={{ getUserDetailsa: getUserDetails }}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    )
  if (use == AuthConstants.phone_verified)
    return (
      <View style={{ flex: 1 }}>
        <About user={user} getUserDetails={getUserDetails} />
      </View>
    )
  else if (use != AuthConstants.loading) {
    const apendingAction = use.pending_action.homescrap.length
    if (pendingAction > 0)
      var apendingActionItem = use.pending_action.homescrap[0]

    //App-locking

    if (
      apendingAction > 0 &&
      apendingActionItem != null &&
      true /*add scrap condition*/
    ) {
      console.log('I exist ' + apendingActionItem)
      return (
        <ScrapPickedConfirmation
          route={{
            params: {
              item: apendingActionItem,
              refreshCallback: () => {
                authContext.sync()
              },
              actualUser: userDetails,
              cardDetail: pendingActionItem,
              tag: 'User',
              user: user,
            },
          }}
        />
      )
    } else if (
      apendingAction > 0 &&
      apendingActionItem != null &&
      true /*corporate scrap condition*/
    ) {
      return null
    }

    return (
      <View style={{ flex: 1 }}>
        <NavigationDrawer
          notificationStartup={notificationStarup}
          initVendor={initVendor}
          initRoute={initRoute}
          initSubRoute={initSubRoute}
          initSubParams={initSubParams}
          user={user}
          actualUser={use}
          getUserDetails={getUserDetails}
          setUser={setUser}
        />
      </View>
    )
  }

  return (
    <View style={{ ...StyleSheet.absoluteFill, backgroundColor: 'white' }}>
      <LottieView
        enableMergePathsAndroidForKitKatAndAbove
        style={{ flex: 1, padding: 50, margin: 50 }}
        source={require('./assets/animations/logistics.json')}
        resizeMode={'contain'}
        autoPlay={true}
        loop={true}
      />
    </View>
  )
}
