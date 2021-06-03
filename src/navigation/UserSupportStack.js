import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SupportFAQ from '../screens/SupportFAQ';
import FAQ from '../screens/FAQ';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import TermsAndConditions from '../screens/TermsAndConditions';

const Stack = createStackNavigator();

const UserSupportStack = ({ navigation, route }) => {
    console.log('Starting Support Stack')
    const [cachedData, setCachedData] = useState(route.params.cachedData);
    React.useEffect(() => {
    }, []);
  
    //return(<BidCreation1 />)
    return (
      <View style={{ flex: 1 }}>
        <NavigationContainer independent={true}>
          <Stack.Navigator initialRouteName="SupportFAQ">
            <Stack.Screen name="SupportFAQ" component={SupportFAQ} options={{ headerShown: false }} initialParams={{
              ...route.params,
              cachedData: cachedData,
              draweNav: navigation
            }} />
            <Stack.Screen name="FAQ" component={FAQ} options={{ headerShown: false }} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
            <Stack.Screen name="Terms" component={TermsAndConditions} options={{ headerShown: false }} />
  
          </Stack.Navigator>
  
        </NavigationContainer>
      </View>)
  
  };

  export default UserSupportStack;