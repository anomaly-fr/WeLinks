import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import About from '../screens/About';
import AddAddress from '../screens/AddAddress';
import AddressList from '../screens/AddressList';
import MyProfile from '../screens/MyProfile';
import MySubscriptions from '../screens/MySubscriptions';
import MyScrapSales from '../screens/MyScrapSales';
import WalletStack from './WalletStack';
const Stack = createStackNavigator();

const MyProfileStack = ({ navigation, route }) => {
    const [user, setUser] = useState(route.params.user);
    const [actualUser, setActualUser] = useState(route.params.actualUser);
    const { getUserDetails } = route.params;
    const [remountKey, setRemountKey] = useState(0);
  
    useFocusEffect(
      React.useCallback(() => {
        console.log(route.params.actualUser);
        setActualUser(route.params.actualUser);
        setRemountKey(Math.random(0.5));
        return () => null;
      }, [route])
    );
  
    React.useEffect(() => {
      console.log(route.params.actualUser);
      setActualUser(route.params.actualUser);
      setRemountKey(Math.random(0.5));
    }, [route.params]);
    console.log('Starting Profile Stack');
  
    return (
      <View style={{ flex: 1 }}>
        <NavigationContainer independent={true}>
          <Stack.Navigator initialRouteName="Profile">
            <Stack.Screen name="Profile" component={MyProfile} key={remountKey.toString()} options={{ headerShown: false }} initialParams={{ ...route.params, user: user, actualUser: actualUser, getUserDetails: getUserDetails, navDrawer: navigation, setActualUser: route.params.setActualUser }} />
            <Stack.Screen name="AddressList" component={AddressList} options={{ headerShown: false }} initialParams={{ navigator: navigation }} />
            <Stack.Screen name="AddAddress" component={AddAddress} options={{ headerShown: false }} />
            <Stack.Screen name="MySubscriptions" component={MySubscriptions} options={{ headerShown: false }} initialParams={{ navigator: navigation, actualUser: actualUser }} />
            <Stack.Screen name="MyScrapSales" component={MyScrapSales} options={{ headerShown: false }} initialParams={{ navigator: navigation }}/>
            <Stack.Screen name="About" component={About} options={{ headerShown: false }} initialParams={{ navigator: navigation }}/>
            <Stack.Screen name="Wallet" component={WalletStack} options={{ headerShown: false }}  initialParams={{ navigator: navigation }}/>
  
          </Stack.Navigator>
        </NavigationContainer>
      </View>)
  
  };

  export default MyProfileStack;