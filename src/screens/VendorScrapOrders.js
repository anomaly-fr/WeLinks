import React,{useState,useEffect} from 'react';
import {View,Text,StyleSheet,FlatList,TouchableOpacity, BackHandler} from 'react-native';
import {Colors, dimen,Styles} from '../Constants';
import { useFocusEffect } from '@react-navigation/native';
import AppBar from '../components/ui_components/AppBar';
import Axios from 'axios';
import LottieView from 'lottie-react-native';
import {Config} from  '../Constants';
import VendorScrapOrder from '../components/VendorScrapOrder';

let data=[];


export default function VendorScrapOrders({navigation,route}){
    const [extraData,setExtraData]=useState(0);
    const {user}=route.params;
    const [apiLoaded,setApiLoaded]=useState(true);
    const {vendorID} = route.params;

    console.log("WHENDOR "+vendorID)
    

    const words = {

        title : 'My Scrap Orders'
    }

   

    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
         console.log('Guess what? We can! go back from here');
       //  route.params.goBackToHome();
       
           navigation.navigate('VendorDashboard')
         //   navigation.reset();
                  
              return true;
            
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
          
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        },)
      );



      // here
    const prepareResponse =(responseArray)=>{
       // console.log(dataa);
        data=[];
        let i;
        try{
       data = responseArray;
       if(data == undefined)
            data = [];
        setExtraData(Math.random(0.3));
    }
    catch(e){}

    }

    const retrieveData=()=>{
       
        
        Axios.get(Config.api_url+'php?action=getVendorOrders&vendor_id='+vendorID)
        .then((response)=>{
         //    console.log("Response" +response.data.order);

          //   console.log("R E S "+response.data.order.company_name)
            //data=response.data;
            try{
                prepareResponse(response.data.order);
            }
            catch(error){
                data=[];
            }
            finally{
                setApiLoaded(true);
            }   
            setExtraData(Math.random(0.5));
            
        },(error)=>{
            console.log(error);
            setApiLoaded(true);
        })
        setApiLoaded(false);
    }

    useEffect(()=>{
        retrieveData();
        //const unsub = navigation.addListener('focus',()=>{
            //retrieveData();
         // })
     //     console.log('retrieving')
       
    },[]);
    

    
    const renderCard = (item) => {

        
       
        return(<VendorScrapOrder cardDetails={item} {...item} name={item.name} pickUpDate={item.pickUpDate} orderDate={item.orderDate} orderAmount={item.orderAmount} imageUrl={item.image} status={item.status} cart={item.cart} address={item.address}/>
            )   
    }


   
   

    return(<View style={{width: '100%',height: dimen.height,backgroundColor: 'white',justifyContent: 'flex-start'}}>
    <View style={{height: dimen.height/13}}>
        <AppBar title='My Scrap Orders'back funct={() => {
            
            navigation.navigate('VendorDashboard');
            }} />
        </View>

        <View style={{flex: 1,backgroundColor: 'white'}}>
        {/* <Text style={{...Styles.heading,alignSelf: 'center',paddingVertical: dimen.height/100}}>{words.title}</Text> */}

       <FlatList 
            style={{marginBottom:'5%',backgroundColor: 'white',flex: 1}}
            extraData={extraData}
            data = {data.reverse()}
            keyExtractor= {(item,index)=>index.toString()}
            renderItem = {({item}) => {
                console.log("Statts "+item.order_status)
                let cardDetails = {
                    name : item.user_name,
                    orderAmount : item.order_amount,
                    pickUpDate : item.pickup_date,
                    orderDate : item.order_date,
                    status : item.order_status,
                    image : item.user_image_url,
                    cart : item.cart,
                    orderID : item.scrap_order_id,
                    address : item.addr_details,
                    userID : item.user_id


                    
                }
                return(<TouchableOpacity disabled={true} onPress={() => {
                    let ordered = 'ORDERED'
                    if(cardDetails.status === ordered)
                     navigation.navigate('ScrapPickedConfirmation',{
                         ...cardDetails,
                         tag : 'Vendor',
                         theCard: 'som'
                     })
                    }}>
                {renderCard(cardDetails)}
                </TouchableOpacity>)
                 
            }}
        />
    
        

      
       
        </View>

       
        {!apiLoaded && data[0] === undefined?
        (
         <View style={{...StyleSheet.absoluteFill,backgroundColor: 'white',zIndex: 10}}>
                <LottieView  
                enableMergePathsAndroidForKitKatAndAbove
              style={{flex:1,padding: 50,margin:50}}  source={require('../../assets/animations/logistics.json')} resizeMode={'contain'} autoPlay={true} loop={true}/>
              </View>)
              :
               data[0] === undefined || data[0] === null? <Text style={{...Styles.subbold,alignSelf: 'center',flex:1}}>No sales to show </Text> : null
               
            }
        
      

       
    </View>)
   
}



