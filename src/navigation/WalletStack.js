import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Payment from '../screens/Payment';
import WalletScreen from '../screens/WalletScreen';
import AddMoney from '../screens/AddMoney';


const Stack = createStackNavigator();

const WalletStack = ({navigation, route})=>{
    const options = {headerShown: false};
    return (
      <View style={{ flex: 1 }}>
        <NavigationContainer independent={true}>
          <Stack.Navigator>
            <Stack.Screen name="Wallet" component={WalletScreen} options={options} initialParams={{...route.params,toggleDrawer: navigation.toggleDrawer}}/>
            <Stack.Screen name="AddMoney" component={AddMoney} options={options} initialParams={{...route.params,toggleDrawer: navigation.toggleDrawer}} />
            <Stack.Screen name='Payment' component={Payment}  options={options} initialParams={{...route.params,toggleDrawer: navigation.toggleDrawer}} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
      );
  }
  
  export default WalletStack;
  