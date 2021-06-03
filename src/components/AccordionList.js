import React, {  } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {View, BackHandler} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {dimen} from '../Constants';
import Product from '../components/Product';

const ScrapFlatList = ({route,navigation,data}) => {
    const {name} = route.params;
    const {stars} = route.params;
    const {reviews,actualUser,address} = route.params;
    const {tag} = route.params;
    console.log(actualUser)

    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
      //     console.log('Go to milk');
           navigation.navigate('PaperVendors');
              return true;
            
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        },)
      );
      const vendorId=route.params.vendorId;

   // const order = navigation.getParams('order');
    return(<View style={{padding: 1, backgroundColor: 'white'}}>
    <FlatList
        data = {data}
        keyExtractor = {(item) => item.name}
        style={{maxHeight: dimen.height*0.5}}
        renderItem = {({item}) => { 
            console.log(item.product_image_url);
            const imageUrl= item.product_image_url;
            
            return(
                <Product place="list" name={item.name} quantity={item.quantity} price={item.weekday_price} price_={item.weekend_price} url={item.product_image_url} imageUrl={imageUrl}
                subscribe={() => {
                   
                    const prodName = item.name;
                    const prodQuan = item.quantity;
                    const prodRate = item.weekday_price;
                    const prodRate_ = item.weekend_price;
                    const productId = item.id
                    
               
                    navigation.navigate('SubscribeScreen',{
                        tag : 'Paper',
                        pname : prodName,
                        pquan : prodQuan,
                        prate: prodRate,
                        prate_: prodRate_ ,
                        imageUrl: imageUrl,
                        actualUser: actualUser,
                        vendorId: vendorId,
                        productId: item.id,
                        productId: productId,
                        vendorType: 'newspaper',
                        address: address
                    }) } 
                }/>

            )
        }}

    />
  

    </View>)
};
