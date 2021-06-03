import Axios from 'axios';
import React,{useState,useEffect} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import AppBar from '../components/ui_components/AppBar';
import { Styles } from '../Constants';
import qs from 'qs';
import Spinner from 'react-native-loading-spinner-overlay';
import sendNotif from '../Utility/sendNotificationTo';
import { NavigationActions } from 'react-navigation';
import { useAuth } from '../services/auth-service';






const Payment = ({ route,navigation }) => {
    const actualUser = useAuth().user;
    const {order} = route.params;
    const {wallet} = route.params;
    const {online_pay} = route.params;
    const [spinnerVis,setSpinnerVis] = useState(false);

    const showSpinner = (tf) =>{
        setSpinnerVis(tf);
    }
    
    console.log(actualUser.user_id);
    console.log(wallet);
   const uri = wallet ? `https://we-link.in/dev.we-link.in/api/ccavPayment_api.php?amount=${order.amount}&merchant_param1=${actualUser.user_id}&merchant_param2=wallet&billing_name=${actualUser.name}&billing_country=India&billing_tel=${actualUser.phone}&billing_email=${actualUser.email}`
    : `https://we-link.in/dev.we-link.in/api/ccavPayment_api.php?order_id=${order.id}&amount=${order.amount}&billing_name=${actualUser.name}&billing_country=India&billing_tel=${actualUser.phone}&billing_email=${actualUser.email}`;
   // let inject;

   
    return(<View>
     <AppBar
     title={'Make Payment'}
      back
         funct={() => navigation.goBack()}
     />
     {/* {init()} */}
        <View style={Styles.parentContainer}>

    <Spinner
                    visible={spinnerVis}
                    textContent={'Loading'}
                    textStyle={{ color: '#FFF' }}
                     />

   <WebView
   onLoadStart={() => showSpinner(true)}
   style={{height:'100%',width:'100%'}}
   onLoadEnd={() => showSpinner(false)}
   onMessage ={(msg) => {
       console.log("msg! "+ JSON.stringify(msg.nativeEvent.data));
    //   navigation.popToTop()
    if(msg!= undefined){
        if(msg.nativeEvent.data === "Success"){
       sendNotif('Hey','Your order has been successfully placed','user'+actualUser.user_id);
       // navigate to My Subs
       if(online_pay){
        console.log("Order confirmed");
        alert('Order confirmed! You can check the status of your order in My Subscriptions.')
       }
      
      else{
          console.log("added to wallet")
        alert("Wallet Amount added!");
      } 
      navigation.popToTop();

    }else{
        alert("Your payment has not been completed");
      
         navigation.popToTop();
    }
    }
   


   }}
   
    source={{ uri }}
//   injectedJavaScript={inject}
     />
         </View>
      </View>)
};

export default Payment;