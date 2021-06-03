import * as React from 'react'
import { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AddAddress from '../screens/AddAddress'
import VendorRegistration from '../screens/VendorRegistration'
import VendorBids from '../screens/VendorBids'
import { Constants, Styles } from '../Constants'
import LottieView from 'lottie-react-native'
import VendorProfileStack from '../navigation/VendorProfileStack'
import VendorServices from '../screens/VendorServices'
import VendorDashboard from '../screens/VendorDashboard'
import VendorSubscriptions from '../screens/VendorSubscriptions'
import VendorSubscriptionDetails from '../screens/VendorSubscriptionDetails'
import VendorViewBids from '../screens/VendorViewBids'
import VendorBidDetails from '../screens/VendorBidDetails'
import ScrapPickedConfirmation from '../screens/ScrapPickedConfirmation'
import VendorScrapOrders from '../screens/VendorScrapOrders'
import { useAuth } from '../services/auth-service'
import VendorProfile from '../screens/VendorProfile'

const Stack = createStackNavigator()
const VendorHomeStack = ({ navigation, route }) => {
  const [user, setUser] = useState(route.params.user)
  const [actualUser, setActualUser] = useState(route.params.actualUser)
  const [vendorID, setVendorID] = useState(null)
  const { getUserDetails } = route.params
  const [remountKey, setRemountKey] = useState(0)
  const [verification, setVerification] = useState(Constants.veFirstTime)
  const [loading, setLoading] = useState(false)
  const [errorState, setError] = useState(false)
  const authContext = useAuth()
  const [initSubParams, setInitSubParams] = useState(
    route.params.initSubParams != undefined
      ? route.params.initSubParams
      : { nothing: ' ' },
  )
  const [initSubRoute, setInitSubRoute] = useState(
    route.params.initRoute != undefined
      ? route.params.initRoute
      : 'VendorDashboard',
  )

  const retreieveVendorData = () => {
    const vend = authContext.vendor
    console.log('vendorData', vend)
    if (vend.vendor_status === Constants.veFirstTime)
      setVerification(Constants.veFirstTime)
    else if (vend.vendor_status === Constants.veInProgress)
      setVerification(Constants.veInProgress)
    else {
      if (vend.vendor_id != undefined) {
        setVendorID(vend.vendor_id)
        setVerification(Constants.verified)
        console.log('THIS IS HAPPENINGGGGG')
      }
    }
  }

  React.useEffect(() => {
    setActualUser(authContext.user)
    retreieveVendorData()
  }, [authContext])

  if (loading)
    return (
      <View style={{ ...StyleSheet.absoluteFill, backgroundColor: 'white' }}>
        <LottieView
          enableMergePathsAndroidForKitKatAndAbove
          style={{ flex: 1, padding: 50, margin: 50 }}
          source={require('../../assets/animations/logistics.json')}
          resizeMode={'contain'}
          autoPlay={true}
          loop={true}
        />
      </View>
    )
  else if (errorState)
    return (
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
          Network connection failed, Try again later
        </Text>
      </View>
    )

  var theInitialParams = {
    actualUser: actualUser,
    user: user,
    navDrawer: navigation,
  }

  if (
    verification === Constants.veFirstTime ||
    verification === Constants.veInProgress
  )
    return (
      <View style={{ flex: 1 }}>
        <NavigationContainer independent={true}>
          <Stack.Navigator>
            <Stack.Screen
              name="VendorRegistration"
              component={VendorRegistration}
              key={remountKey.toString()}
              options={{ headerShown: false }}
              initialParams={{
                user: user,
                actualUser: actualUser,
                vendorRefresh: retreieveVendorData,
                getUserDetails: getUserDetails,
                navDrawer: navigation,
                setActualUser: route.params.setActualUser,
              }}
            />
            <Stack.Screen
              name="VendorServices"
              component={VendorServices}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VendorProfile"
              component={VendorProfile}
              options={{ headerShown: false }}
              initialParams={theInitialParams}
            />
            <Stack.Screen
              name="AddAddress"
              component={AddAddress}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VendorDashboard"
              component={VendorDashboard}
              options={{ headerShown: false }}
              initialParams={theInitialParams}
            />
            <Stack.Screen
              name="VendorViewBids"
              component={VendorViewBids}
              options={{ headerShown: false }}
              initialParams={{ vendorID: vendorID, actualUser: actualUser }}
            />
            <Stack.Screen
              name="VendorBidDetails"
              component={VendorBidDetails}
              options={{ headerShown: false }}
              initialParams={{ vendorID: vendorID }}
            />
            <Stack.Screen
              name="VendorScrapOrders"
              component={VendorScrapOrders}
              options={{ headerShown: false }}
              initialParams={{ vendorID: vendorID }}
            />
            <Stack.Screen
              name="ScrapPickedConfirmation"
              component={ScrapPickedConfirmation}
              options={{ headerShown: false }}
              initialParams={user}
            />
            <Stack.Screen
              name="VendorSubscriptions"
              component={VendorSubscriptions}
              options={{ headerShown: false }}
              initialParams={{ vendorID: vendorID, ...initSubParams }}
            />
            <Stack.Screen
              name="VendorSubscriptionDetails"
              component={VendorSubscriptionDetails}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    )

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName={initSubRoute}>
          <Stack.Screen
            name="VendorDashboard"
            component={VendorDashboard}
            options={{ headerShown: false }}
            initialParams={theInitialParams}
          />
          <Stack.Screen
            name="VendorViewBids"
            component={VendorViewBids}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VendorBidDetails"
            component={VendorBidDetails}
            options={{ headerShown: false }}
            initialParams={{ vendorID: vendorID, actualUser: actualUser }}
          />
          <Stack.Screen
            name="VendorScrapOrders"
            component={VendorScrapOrders}
            options={{ headerShown: false }}
            initialParams={{ vendorID: vendorID }}
          />
          <Stack.Screen
            name="ScrapPickedConfirmation"
            component={ScrapPickedConfirmation}
            options={{ headerShown: false }}
            initialParams={theInitialParams}
          />
          <Stack.Screen
            name="AddAddress"
            component={AddAddress}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VendorProfileStack"
            component={VendorProfileStack}
            options={{ headerShown: false }}
            initialParams={{ user: user, actualUser: actualUser }}
          />
          <Stack.Screen
            name="VendorSubscriptions"
            component={VendorSubscriptions}
            initialParams={{ vendorID: vendorID, ...initSubParams }}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VendorSubscriptionDetails"
            component={VendorSubscriptionDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VendorBids"
            component={VendorBids}
            options={{ headerShown: false }}
            initialParam={{ vendorID: vendorID }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  )
}

export default VendorHomeStack
