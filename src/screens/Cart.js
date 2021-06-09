import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  BackHandler,
  Alert,
  TouchableOpacity,
} from 'react-native'
import SubscriptionOrder from '../components/SubscriptionOrder'
import SubmitButton from '../components/SubmitButton'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import moment, { weekdays } from 'moment'
import { Styles, Colors, dimen, notification_identifiers } from '../Constants'
import AppBar from '../components/ui_components/AppBar'
import Axios from 'axios'
import qs from 'qs'
import { ScrollView } from 'react-native-gesture-handler'
import { Config } from '../Constants'
import sendNotif from '../Utility/sendNotificationTo'

import { useAuth } from '../services/auth-service'

const Cart = ({ route, navigation, Tag }) => {
  let selectedDays = [],
    i
  const [orderMade, setOrderMade] = useState(false)
  const [showWebview, setShowWebview] = useState(true)
  const [done, setDone] = useState(false)
  const authContext = useAuth()
  const words = {
    title: 'Order Summary',
    disclaimer:
      'Total number of deliveries may be adjusted as per market rates.',
    couponText: 'Got a coupon code? Apply',
    cartAmount: 'Cart Amount',
    deliveryFee: 'Delivery fee',
    amountToPay: 'Amount to pay',
  }

  const { pname } = route.params
  const { price } = route.params
  const { weekendPrice } = route.params
  const { pquan } = route.params
  const { order, actualUser } = route.params
  const { tag } = route.params
  // console.log("days " +JSON.stringify(order));

  var numberOfDeliveries, numberOfPaperWeekdays, numberOfPaperWeekends
  var dayString = ''

  order.days[0].m
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))
  order.days[1].t
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))
  order.days[2].w
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))
  order.days[3].th
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))
  order.days[4].f
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))
  order.days[5].s
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))
  order.days[6].su
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))

  const calculatePaperDeliveries = (startDate, endDate) => {
    // console.log('cd:'+ startDate)

    var start =
      startDate.charAt(0) +
      startDate.charAt(1) +
      ' ' +
      startDate.charAt(3) +
      startDate.charAt(4) +
      startDate.charAt(5) +
      ' ' +
      startDate.charAt(startDate.length - 4) +
      startDate.charAt(startDate.length - 3) +
      startDate.charAt(startDate.length - 2) +
      startDate.charAt(startDate.length - 1) +
      ' 00:00:00 GMT'
    var end =
      endDate.charAt(0) +
      endDate.charAt(1) +
      ' ' +
      endDate.charAt(3) +
      endDate.charAt(4) +
      endDate.charAt(5) +
      ' ' +
      endDate.charAt(endDate.length - 4) +
      endDate.charAt(endDate.length - 3) +
      endDate.charAt(endDate.length - 2) +
      endDate.charAt(endDate.length - 1) +
      ' 00:00:00 GMT'

    dayString = dayString + dayString[0]
    const dayString1 = dayString[6] + dayString.substring(0, 6)

    // console.log(dayString1)

    const daysOfTheWeek = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ]

    for (i in dayString1)
      if (dayString1[i] == 'Y') selectedDays.push(daysOfTheWeek[i])

    //    console.log(selectedDays)

    let weekdaysCount = 0
    let weekendsCount = 0
    for (i = 0; i < 7; i++) {
      var dateObj1 = new Date(Date.parse(start))
      var dateObj2 = new Date(Date.parse(end))

      if (dayString1[i] == 'Y') {
        var dayIndex = i

        while (dateObj1.getTime() <= dateObj2.getTime()) {
          if (dateObj1.getDay() == dayIndex && dayIndex != 0 && dayIndex != 6) {
            weekdaysCount++
          } else if (
            dateObj1.getDay() == dayIndex &&
            (dayIndex == 0 || dayIndex == 6)
          ) {
            weekendsCount++
          }

          dateObj1.setDate(dateObj1.getDate() + 1)
        }
      }
    }

    numberOfPaperWeekdays = weekdaysCount
    numberOfPaperWeekends = weekendsCount
    console.log('Weekends ' + weekendsCount + ' Weekdays ' + weekdaysCount)
    return weekdaysCount + weekendsCount
  }

  const calculateDeliveries = (startDate, endDate) => {
    // console.log('cd:'+ startDate)

    var start =
      startDate.charAt(0) +
      startDate.charAt(1) +
      ' ' +
      startDate.charAt(3) +
      startDate.charAt(4) +
      startDate.charAt(5) +
      ' ' +
      startDate.charAt(startDate.length - 4) +
      startDate.charAt(startDate.length - 3) +
      startDate.charAt(startDate.length - 2) +
      startDate.charAt(startDate.length - 1) +
      ' 00:00:00 GMT'
    var end =
      endDate.charAt(0) +
      endDate.charAt(1) +
      ' ' +
      endDate.charAt(3) +
      endDate.charAt(4) +
      endDate.charAt(5) +
      ' ' +
      endDate.charAt(endDate.length - 4) +
      endDate.charAt(endDate.length - 3) +
      endDate.charAt(endDate.length - 2) +
      endDate.charAt(endDate.length - 1) +
      ' 00:00:00 GMT'

    dayString = dayString + dayString[0]
    const dayString1 = dayString[6] + dayString.substring(0, 6)

    console.log(dayString1)

    const daysOfTheWeek = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ]

    for (i in dayString1)
      if (dayString1[i] == 'Y') selectedDays.push(daysOfTheWeek[i])

    console.log(selectedDays)

    var count = 0
    for (i = 0; i < 7; i++) {
      var dateObj1 = new Date(Date.parse(start))
      var dateObj2 = new Date(Date.parse(end))

      if (dayString1[i] == 'Y') {
        var dayIndex = i

        while (dateObj1.getTime() <= dateObj2.getTime()) {
          if (dateObj1.getDay() == dayIndex) {
            count++
          }

          dateObj1.setDate(dateObj1.getDate() + 1)
        }
      }
    }

    numberOfDeliveries = count
    return count
  }

  // This is the number of days from start to end date; unused
  const numberOfDays = (end, start) => {
    // console.log('sstart:'+start);
    // console.log('eend:'+end);
    var res

    const month = (date) => {
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      for (i = 0; i < 12; i++) {
        if (date.includes(monthNames[i])) {
          res = i < 10 ? '0' + i : i
        }
      }
      return res
    }

    start =
      start.charAt(start.length - 4) +
      start.charAt(start.length - 3) +
      start.charAt(start.length - 2) +
      start.charAt(start.length - 1) +
      '-' +
      month(start) +
      '-' +
      start.charAt(0) +
      start.charAt(1)
    end =
      end.charAt(end.length - 4) +
      end.charAt(end.length - 3) +
      end.charAt(end.length - 2) +
      end.charAt(end.length - 1) +
      '-' +
      month(end) +
      '-' +
      end.charAt(0) +
      end.charAt(1)

    start = moment(start, 'YYYY-MM-DD')
    end = moment(end, 'YYYY-MM-DD')
    ans = start.diff(end, 'days') + 1

    return ans
  }
  var cartTotal
  const calculateCartAmount = () => {
    if (tag == 'Milk') {
      cartTotal = price * numberOfDeliveries * order.perDayQuan.number
    } else if (tag == 'Newspaper') {
      cartTotal =
        price * numberOfPaperWeekdays * order.perDayQuan.number +
        weekendPrice * numberOfPaperWeekends * order.perDayQuan.number
    }

    return cartTotal
  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        //  console.log('Go to sub');
        Alert.alert(
          'Are you sure you want to go back?',
          'Your progress will be lost.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('SubscribeScreen')
              },
            },
          ],
          { cancelable: false },
        )

        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }),
  )

  return (
    <View
      style={{
        width: '100%',
        height: dimen.height,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
      }}
    >
      <View>
        <AppBar
          title={'Order Confirmation'}
          back={true}
          funct={() => {
            navigation.pop()
          }}
        />
      </View>

      {/*ScrollView parent */}
      <View
        style={{
          height: dimen.height - dimen.height / 8,
          position: 'absolute',
          top: dimen.height / 14,
        }}
      >
        <ScrollView style={{ flex: 1, padding: 5 }}>
          <View
            style={{
              flex: 1,
              alignSelf: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <Text
              style={{ ...Styles.title, marginBottom: '0%', marginTop: '2%' }}
            >
              {words.title}
            </Text>

            <View style={{ alignItems: 'center', width: dimen.width }}>
              <SubscriptionOrder
                name={pname}
                quantity={pquan}
                price={price}
                bought={order.perDayQuan.number}
                startDate={order.s.start}
                endDate={order.e.end}
                days={order.days}
                tag={tag}
                weekend_price={weekendPrice}
                num={
                  tag == 'Milk'
                    ? calculateDeliveries(order.s.start, order.e.end)
                    : calculatePaperDeliveries(order.s.start, order.e.end)
                }
                imageUrl={route.params.imageUrl}
              />
            </View>
            <View>
              <View style={style.gray}>
                <Text style={style.text}>{words.disclaimer}</Text>
              </View>

              <View
                style={{
                  ...style.gray,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}
              >
                <MaterialCommunityIcons
                  name="sale"
                  size={30}
                  color="#6CC35A"
                  style={style.couponIcon}
                />

                <Text style={style.coupon}>{words.couponText}</Text>
              </View>
            </View>
            <View
              style={{
                padding: 10,
                backgroundColor: 'white',
                marginTop: dimen.width / 60,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text style={style.billText}>{words.cartAmount}</Text>
                <Text style={style.billCost}>₹{calculateCartAmount()}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={style.billText}>{words.deliveryFee}</Text>
                <Text style={style.billCost}>₹50</Text>
              </View>
              <View style={{ ...Styles.grayfullline, marginVertical: '3%' }} />
              <View style={{ flexDirection: 'row' }}>
                <Text style={style.billText}>{words.amountToPay}</Text>
                <Text style={style.billCost}>₹{cartTotal + 50}</Text>
              </View>
            </View>
            <View
              style={{
                flex: 0,
                marginHorizontal: 10,
                marginVertical: dimen.sHm,
                justifyContent: 'space-around',
                flexDirection: 'row',
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: done
                    ? Colors.buttonEnabledGreen
                    : Colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: 10 / 3,
                  width: dimen.width / 2.5,
                  borderRadius: 5,
                }}
                onPress={() => {
                  console.log('TT')
                  setDone(true)

                  const startDate = route.params.usableStartDate
                  const endDate = route.params.usableEndDate
                  console.log('Here ' + JSON.stringify(startDate))
                  console.log('Here ' + JSON.stringify(endDate))

                  console.log('vendortype', route.params.vendorType)

                  console.log('pop to top')
                  console.log(order.s)
                  console.log({
                    user_id: authContext.user.user_id,
                    vendor_id: route.params.vendorId,
                    quantity: pquan,
                    subscription_days: selectedDays,
                    subscription_end_date: startDate,
                    subscription_start_date: endDate,
                    no_of_deliveries:
                      tag == 'Newspaper'
                        ? numberOfPaperWeekdays + numberOfPaperWeekends
                        : numberOfDeliveries,
                    delivery_fee: 50,
                    product_type: route.params.tag,
                    order_gst: 0,
                    product_id: route.params.productId,
                    cartamount: calculateCartAmount(),
                    discount: 0,
                    order_total: calculateCartAmount(), //removed +50
                    address_id: route.params.address,
                    order_date: moment().format('YYYY-MM-DD'),
                  })
                  //return

                  Axios.post(
                    Config.api_url +
                      'php?action=addSubscription&' +
                      qs.stringify({
                        user_id: authContext.user.user_id,
                        vendor_id: route.params.vendorId,
                        quantity: pquan,
                        subscription_days: selectedDays,
                        subscription_end_date: startDate,
                        subscription_start_date: endDate,
                        no_of_deliveries:
                          tag == 'Newspaper'
                            ? numberOfPaperWeekdays + numberOfPaperWeekends
                            : numberOfDeliveries,
                        delivery_fee: 50,
                        product_type: route.params.tag,
                        order_gst: 0,
                        product_id: route.params.productId,
                        cartamount: calculateCartAmount(),
                        discount: 0,
                        order_total: calculateCartAmount(), //removed +50
                        address_id: route.params.address,
                        order_date: moment().format('YYYY-MM-DD'),
                      }),
                  ).then(
                    (response) => {
                      console.log('This ' + JSON.stringify(response.data))
                      console.log('Sending')

                      navigation.navigate('Payment', {
                        actualUser,
                        online_pay: true,
                        order: {
                          id: response.data.subscriptionID,
                          amount: cartTotal + 50,
                          online_pay: true,
                        },
                      })
                    },
                    (error) => {
                      console.log('Error ' + error)
                    },
                  )
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontStyle: done ? 'italic' : 'normal',
                  }}
                >
                  Pay Online
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setDone(true)
                  // route.params.goToMySubs();
                  // return;
                  if (
                    calculateCartAmount() + 50 <=
                    authContext.user.wallet_balance
                  ) {
                    const startDate = route.params.startDate
                    const endDate = route.params.endDate
                    console.log('vendortype', route.params.vendorType)

                    console.log('pop to top')
                    Axios.post(
                      Config.api_url +
                        'php?action=addSubscription&' +
                        qs.stringify({
                          user_id: authContext.user.user_id,
                          vendor_id: route.params.vendorId,
                          quantity: pquan,
                          subscription_days: selectedDays,
                          subscription_end_date: startDate,
                          subscription_start_date: endDate,
                          no_of_deliveries:
                            tag == 'Newspaper'
                              ? numberOfPaperWeekdays + numberOfPaperWeekends
                              : numberOfDeliveries,
                          delivery_fee: 50,
                          product_type: route.params.tag,
                          order_gst: 0,
                          product_id: route.params.productId,
                          cartamount: calculateCartAmount(),
                          discount: 0,
                          order_total: calculateCartAmount(), //removed +50
                          address_id: route.params.address,
                          order_date: moment().format('YYYY-MM-DD'),
                        }),
                    ).then(
                      (response) => {
                        console.log(response)
                        console.log('sd ' + JSON.stringify(response.data))
                        console.log('Sending')
                        // sendNotif('Hey', 'Your order has been successfully placed', 'user' + authContext.user, notification_identifiers.user_milk_subscriptions);
                        // sendNotif('Order Recieved', 'An order for ' + route.params.vendorType + ' has been received', 'vendor' + route.params.vendorId, tag == 'Milk' ? notification_identifiers.vendor_milk_subscriptions : notification_identifiers.vendor_newspaper_subscriptions);
                        // sendNotif('Hey','Your order has been successfully placed','user'+authContext.user)
                        // sendNotif('Hey','Your order has been successfully placed','user'+authContext.user)
                        // sendNotif('Hey','Your order has been successfully placed','user'+authContext.user)
                        // sendNotif('Hey','Your order has been successfully placed','user'+authContext.user)

                        // Alert.alert("Order placed.", tag == 'Milk' ?
                        //     "Your milk subscription order has been placed successfully. You can see the details in  My Subscriptions." : "Your newspaper subscription order has been placed successfully. You can see the details in  My Subscriptions.",
                        //     [

                        //         { text: "OK", onPress: () => { } }
                        //     ],
                        //     { cancelable: false }
                        // );

                        //       navigation.popToTop();
                        //  console.log()

                        // navigation.navigate('Payment',{
                        // actualUser,
                        // order: {
                        //     id: response.data.suscriptionID,
                        //     amount: cartTotal+50,
                        //     wallet: false
                        // })
                        Axios.post(
                          `https://api.dev.we-link.in/user_app.php?action=orderByWallet&user_id=${
                            authContext.user
                          }&order_id=${response.data.subscriptionID.toString()}&amount=${(
                            calculateCartAmount() + 50
                          ).toString()}`,
                        ).then((response) => {
                          try {
                            console.log(response.data)
                            if (response.data.status === 'success') {
                              alert(
                                'Order Confirmed! You can check the status of your order in My Subscriptions.',
                              )
                              navigation.popToTop()
                              sendNotif(
                                'Hey',
                                'Your order has been successfully placed',
                                'user' + authContext.user,
                                notification_identifiers.user_milk_subscriptions,
                              )
                              sendNotif(
                                'Hey',
                                'Your have a new order',
                                'vendor' + route.params.vendorId,
                                notification_identifiers.vendor_milk_subscriptions,
                              )
                            } else {
                              alert('Error occursd')
                              navigation.popToTop()
                            }
                          } catch (exception) {
                            alert('Error occursd')
                            navigation.popToTop()
                          }
                        })
                      },
                      (error) => {
                        console.log('Error ' + error)
                      },
                    )
                  }
                }}
                style={{
                  backgroundColor:
                    calculateCartAmount() + 50 <=
                    authContext.user.wallet_balance
                      ? Colors.primary
                      : 'gray',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: 10 / 3,
                  width: dimen.width / 2.5,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>
                  {'Pay Using We Link Wallet (Bal. ₹' +
                    authContext.user.wallet_balance +
                    ')'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* <View style={{backgroundColor:'yellow',height:'100%'}}>
            <Payment />
              </View> */}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  line: {
    borderWidth: 0.5,
    borderColor: 'gray',
    marginVertical: '2%',
  },
  container: {
    ...StyleSheet.absoluteFill,
    padding: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    marginHorizontal: '5%',
    fontWeight: 'bold',
    color: 'black',
  },
  gray: {
    padding: '1%',
    backgroundColor: Colors.seperatorGray,
    borderRadius: 10,
    marginHorizontal: '3%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    marginBottom: dimen.sHm,
  },
  gray1: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    borderWidth: 0.6,
    elevation: -5,
    marginHorizontal: '3%',
  },
  text: {
    padding: 10,
    color: 'gray',
    fontWeight: '900',
  },
  coupon: {
    fontWeight: '800',
    fontSize: 16,
    padding: '2%',

    fontWeight: 'bold',
  },
  billText: {
    fontSize: 16,
    marginTop: '2%',
    fontWeight: 'bold',
    margin: '2%',
  },
  billCost: {
    fontWeight: 'bold',
    fontSize: 16,
    margin: '2%',
    textAlign: 'right',

    ...StyleSheet.absoluteFill,
  },
  couponIcon: {
    padding: '4%',
    marginTop: '0.3%',
  },
})

export default Cart
