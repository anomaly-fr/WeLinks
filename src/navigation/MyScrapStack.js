import * as React from 'react'
import { useState } from 'react'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import MyScrapSales from '../screens/MyScrapSales'
import MyScrapSaleOrder from '../screens/MyScrapSaleOrder'
import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'

const MyScrapStack = ({ navigation, route }) => {
  const [user, setUser] = useState(route.params.user)
  const { getUserDetails } = route.params
  const [remountKey, setRemountKey] = useState(0)
  const Stack = createStackNavigator()

  useEffect(() => {
    console.log(route.params)
  })

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Profile">
          <Stack.Screen
            name="MyScrapSales"
            component={MyScrapSales}
            key={remountKey.toString()}
            options={{ headerShown: false }}
            initialParams={{
              ...route.params,
              navDrawer: navigation,
              user: user,
            }}
          />
          <Stack.Screen
            name="MyScrapSaleOrder"
            component={MyScrapSaleOrder}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  )
}

export default MyScrapStack
