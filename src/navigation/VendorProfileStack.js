import * as React from 'react'
import { useState } from 'react'
import { View } from 'react-native'
import { NavigationContainer, useFocusEffect } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AddAddress from '../screens/AddAddress'
import AddressList from '../screens/AddressList'
import EditVendorDetails from '../screens/EditVendorDetails'
import VendorProfile from '../screens/VendorProfile'
import VendorServices from '../screens/VendorServices'
import VendorViewBids from '../screens/VendorViewBids'
const Stack = createStackNavigator()

const VendorProfileStack = ({ navigation, route }) => {
  const [user, setUser] = useState(route.params.user)
  const [actualUser, setActualUser] = useState(route.params.actualUser)
  const { getUserDetails } = route.params
  const [remountKey, setRemountKey] = useState(0)

  console.log('MY', navigation)

  useFocusEffect(
    React.useCallback(() => {
      console.log(route.params.actualUser)
      setActualUser(route.params.actualUser)
      setRemountKey(Math.random(0.5))
      return () => null
    }, [route]),
  )

  React.useEffect(() => {
    console.log(route.params.actualUser)
    setActualUser(route.params.actualUser)
    setRemountKey(Math.random(0.5))
  }, [route.params])

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="VendorProfile">
          <Stack.Screen
            name="VendorProfile"
            component={VendorProfile}
            key={remountKey.toString()}
            options={{ headerShown: false }}
            initialParams={{
              ...route.params,
              user: user,
              actualUser: actualUser,
              getUserDetails: getUserDetails,
              navDrawer: navigation,
              setActualUser: route.params.setActualUser,
            }}
          />
          <Stack.Screen
            name="AddAddress"
            component={AddAddress}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VendorServices"
            component={VendorServices}
            options={{ headerShown: false }}
            initialParams={{ actualUser: actualUser }}
          />
          <Stack.Screen
            name="AddressList"
            component={AddressList}
            options={{ headerShown: false }}
            initialParams={{ actualUser: actualUser, navigator: navigation }}
          />
          <Stack.Screen
            name="EditVendorDetails"
            component={EditVendorDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VendorViewBids"
            component={VendorViewBids}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  )
}

export default VendorProfileStack
