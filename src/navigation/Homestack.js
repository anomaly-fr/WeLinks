import * as React from 'react'
import { useState } from 'react'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import City from '../screens/City'
import About from '../screens/About'
import AddAddress from '../screens/AddAddress'
import Homescreen from '../screens/Homescreen'
import AddressSearch from '../screens/AddressSearch'
import Cart from '../screens/Cart'
import SubscribeScreen from '../screens/SubscribeScreen'
import AddressList from '../screens/AddressList'
import ProductVendors from '../screens/ProductVendors'
import ScrapVendors from '../screens/ScrapVendors'
import ScrapVendor from '../screens/ScrapVendor'
import BidCreation1 from '../screens/BidCreation1'
import BidCreation2 from '../screens/BidCreation2'
import Bids from '../screens/Bids'
import TitleBidDetails from '../screens/TitleBidDetails'
import CancellationScreen from '../screens/CancellationScreen'
import ScrapCart from '../screens/ScrapCart'
import ChooseAddress from '../screens/ChooseAddress'
import AwardBid from '../screens/AwardBid'
import CorporateMarkPickupScreen from '../screens/CorporateMarkPickupScreen'
import Payment from '../screens/Payment'
import ProductVendor from '../screens/ProductVendor'
import { useAuth } from '../services/auth-service'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

const Homestack = ({ route, navigation }) => {
  const authContext = useAuth()
  const user = useAuth().user
  const actualUser = useAuth().user
  const [updateState, setUpdateState] = useState(route.params.actualUser)
  const [initRoute, setInitRoute] = useState(
    route.params.initRoute != undefined ? route.params.initRoute : 'Homescreen',
  )

  React.useEffect(() => {
    setUpdateState(route.params.actualUser)
  }, [route])

  if (updateState != false) {
    return (
      <View style={{ flex: 1 }}>
        <NavigationContainer independent={true}>
          <Stack.Navigator initialRouteName={initRoute}>
            <Stack.Screen
              name="Homescreen"
              component={Homescreen}
              options={{
                headerShown: false,
              }}
              initialParams={{
                user: route.params.user,
                actualUser: updateState,
                drawer: navigation,
                getUserDetails: () => {
                  authContext.sync()
                },
                setActualUser: route.params.setActualUser,
                goToMySubs: () => {
                  navigation.navigate('MySubscriptions', {
                    user: actualUser,
                    goBackToHome: () => {
                      navigation.navigate('HomeStack')
                    },
                  })
                },
              }}
            />
            <Stack.Screen name="AddressSearch" component={AddressSearch} />
            <Stack.Screen
              name="AddAddress"
              component={AddAddress}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="About"
              component={About}
              initialParams={{ user: user }}
            />
            <Stack.Screen
              name="City"
              component={City}
              initialParams={{ user: user }}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProductVendors"
              component={ProductVendors}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProductVendor"
              component={ProductVendor}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddressList"
              component={AddressList}
              options={{ headerShown: false }}
              initialParams={{ navigator: navigation }}
            />
            <Stack.Screen
              name="SubscribeScreen"
              component={SubscribeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Cart"
              component={Cart}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Payment"
              component={Payment}
              options={{ headerShown: false }}
              initialParams={{ user: user, navigator: navigation }}
            />
            <Stack.Screen
              name="FirstAbout"
              component={About}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FirstCity"
              component={City}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FirstAddress"
              component={AddressSearch}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ScrapVendors"
              component={ScrapVendors}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ScrapVendor"
              component={ScrapVendor}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Bids"
              component={Bids}
              options={{ headerShown: false }}
              initialParams={{ actualUser: user, department: 'corporateScrap' }}
            />
            <Stack.Screen
              name="BidCreation1"
              component={BidCreation1}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChooseAddress"
              component={ChooseAddress}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BidCreation2"
              component={BidCreation2}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TitleBidDetails"
              component={TitleBidDetails}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AwardBid"
              component={AwardBid}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CancellationScreen"
              component={CancellationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CorporateMarkPickupScreen"
              component={CorporateMarkPickupScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ScrapCart"
              component={ScrapCart}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    )
  }
}

export default Homestack
