import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  BackHandler,
} from 'react-native'
import { dimen } from '../Constants'
import { useFocusEffect } from '@react-navigation/native'
import AppBar from '../components/ui_components/AppBar'
import Axios from 'axios'
import LottieView from 'lottie-react-native'
import { Config } from '../Constants'
import VendorSubscriptionOrder from '../components/VendorSubscriptionOrder'

let data = []

export default function VendorSubscriptions({ navigation, route }) {
  const { vendorID, tag } = route.params

  const [extraData, setExtraData] = useState(0)
  const [apiLoaded, setApiLoaded] = useState(true)

  const words = {
    title: 'My Scrap Orders',
  }

  useFocusEffect(
    React.useCallback(() => {
      //Going back to vendor home on back
      const onBackPress = () => {
        navigation.navigate('VendorDashboard')
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }),
  )

  // Adding items to list only if orders are not cancelled and making necessary changes to the response
  const prepareResponse = (responseArray) => {
    // console.log(dataa);
    data = []
    let i
    try {
      responseArray.forEach((value) => {
        if (value.order_status != 'Canceled') data.push(value)
      })
      if (data == undefined) data = []
      setExtraData(Math.random(0.3))
    } catch (e) {}
  }

  const retrieveData = () => {
    if (tag == 'Milk') {
      Axios.get(
        Config.api_url +
          'php?action=getSubscriptionsForVendors&vendor_id=' +
          vendorID +
          '&product_type=milk',
      ).then(
        (response) => {
          //   console.log("Response" +response.data.order);
          console.log(typeof response.data)
          console.log('R E S ' + JSON.stringify(response.data[0]))
          data = response.data
          try {
            prepareResponse(response.data)
          } catch (error) {
            console.log('Fetch error ' + error)
            data = []
          } finally {
            setApiLoaded(true)
          }
          setExtraData(Math.random(0.5))
        },
        (error) => {
          console.log('Err ' + error)
          setApiLoaded(true)
        },
      )
      setApiLoaded(false)
    } else {
      Axios.get(
        Config.api_url +
          'php?action=getSubscriptionsForVendors&vendor_id=' +
          vendorID +
          '&product_type=newspaper',
      ).then(
        (response) => {
          //   console.log("Response" +response.data.order);
          console.log(typeof response.data)
          console.log('R E S ' + JSON.stringify(response.data[0]))
          data = response.data
          try {
            prepareResponse(response.data)
          } catch (error) {
            console.log('Fetch error ' + error)
            data = []
          } finally {
            setApiLoaded(true)
          }
          setExtraData(Math.random(0.5))
        },
        (error) => {
          console.log('Err ' + error)
          setApiLoaded(true)
        },
      )
      setApiLoaded(false)
    }
  }

  useEffect(() => {
    retrieveData()
  }, [])

  const renderCard = (item) => {
    return (
      <VendorSubscriptionOrder
        cardDetails={item}
        {...item}
        name={item.name}
        pickUpDate={item.pickUpDate}
        orderDate={item.orderDate}
        orderAmount={item.orderAmount}
        imageUrl={item.image}
        status={item.status}
        cart={item.cart}
        address={item.address}
        startDate={item.startDate}
        endDate={item.endDate}
      />
    )
  }

  return (
    <View
      style={{
        width: '100%',
        height: dimen.height,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
      }}
    >
      <View style={{ height: dimen.height / 13 }}>
        <AppBar
          title={
            tag == 'Milk' ? 'Milk Subscriptions' : 'Newspaper Subscriptions'
          }
          back
          funct={() => {
            navigation.navigate('VendorDashboard')
          }}
        />
      </View>

      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {/* <Text style={{...Styles.heading,alignSelf: 'center',paddingVertical: dimen.height/100}}>{words.title}</Text> */}

        <FlatList
          style={{ marginBottom: '5%', backgroundColor: 'white', flex: 1 }}
          extraData={extraData}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            console.log('Statts ' + item.quantity)
            let cardDetails = {
              name: item.user_name,
              orderAmount: item.order_total,
              orderDate: item.order_date,
              //status : item.order_status,
              image: item.user_image_url,
              productName: item.product_name,
              productImage: item.product_image,
              productType: item.product_type,
              address: item.address.addr_details,
              startDate: item.subscription_start_date,
              endDate: item.subscription_end_date,
              deliveries: item.no_of_deliveries,
              days: item.subscription_days,
              quantity: item.quantity,
              status:
                item.subscription_status === 'Pending'
                  ? 'Ongoing'
                  : 'Completed',
            }
            return (
              <TouchableOpacity disabled={true}>
                {renderCard(cardDetails)}
              </TouchableOpacity>
            )
          }}
        />
      </View>

      {!apiLoaded && data[0] === undefined ? (
        <View
          style={{
            ...StyleSheet.absoluteFill,
            backgroundColor: 'white',
            zIndex: 10,
          }}
        >
          <LottieView
            enableMergePathsAndroidForKitKatAndAbove
            style={{ flex: 1, padding: 50, margin: 50 }}
            source={require('../../assets/animations/logistics.json')}
            resizeMode={'contain'}
            autoPlay={true}
            loop={true}
          />
        </View>
      ) : data[0] === undefined || data[0] === null ? (
        <Text
          style={{
            alignSelf: 'center',
            flex: 1,
            fontWeight: 'bold',
            color: 'black',
          }}
        >
          No subscriptions to show{' '}
        </Text>
      ) : null}
    </View>
  )
}
