import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddAddress from '../screens/AddAddress';
import AddressList from '../screens/AddressList';

const Stack = createStackNavigator();

const MyAddressStack = ({ navigation, route }) => {
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
    console.log('Starting address Stack');
    return (
      <View style={{ flex: 1 }}>
        <NavigationContainer independent={true}>
          <Stack.Navigator initialRouteName="Profile">
            <Stack.Screen name="AddressList" component={AddressList} key={remountKey.toString()} options={{ headerShown: false }} initialParams={{ ...route.params, user: user, actualUser: actualUser, getUserDetails: getUserDetails, navigator: navigation, myAddresses: true, profile: route.params.profile }} />
            <Stack.Screen name="AddAddress" component={AddAddress} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>)
  
  };

  export default MyAddressStack;