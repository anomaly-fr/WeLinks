import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Image,
} from 'react-native'
import { Picker } from '@react-native-community/picker'
import { Colors, TextSpinnerBoxStyles, dimen, Styles } from '../Constants'
import GenericSeperator from '../components/ui_components/GenericSeperator'
import {
  useFocusEffect,
  CommonActions,
  useNavigation,
  StackActions,
} from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import AppBar from '../components/ui_components/AppBar'
import SubmitButton from '../components/SubmitButton'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Axios from 'axios'
import SubscriptionOrder from '../components/SubscriptionOrder'
import LottieView from 'lottie-react-native'
import { setStatusBarHidden } from 'expo-status-bar'
import { Config } from '../Constants'
import { FontAwesome5 } from '@expo/vector-icons'
import { getDate } from '../Utility/dateConvertor'

let data = []

export default function MyScrapSales({ navigation, route }) {
  const [extraData, setExtraData] = useState(0)
  const { user } = route.params
  const [apiLoaded, setApiLoaded] = useState(false)

  const words = {
    title: 'My Scrap Sales',
  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        //console.log('Guess what? We can! go back from here');
        route.params.goBackToHome()

        // navigation.goBack();
        //   navigation.reset();

        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }),
  )

  // here
  const prepareResponse = async (dataa) => {
    // console.log(dataa);
    data = []
    let i
    try {
      await dataa.forEach((item) => {
        console.log('dataa ' + item.company_name)

        data.push({
          name: item.company_name,
          pickUpDate: item.pickup_date,
          orderDate: item.order_date,
          orderAmount: item.order_amount,
          orderStatus: item.order_status,
          cart: item.cart,
          image: item.vendor_img_url,
          cart: item.cart,
          all: item,
        })
      })

      setExtraData(Math.random(0.3))
      setApiLoaded(true)
    } catch (e) {
      setApiLoaded(true)
    }
  }

  const retrieveData = () => {
    setApiLoaded(false)

    Axios.get(
      Config.api_url + 'php?action=getHomeScrapOrders&user_id=' + user.user_id,
    ).then(
      (response) => {
        //      console.log("res" +response.data.order);
        //data=response.data;
        try {
          var thedata = response.data.order.reverse()
          prepareResponse(thedata)
        } catch (error) {
          setApiLoaded(false)
          data = []
        }
        //setExtraData(Math.random(0.5));
        setApiLoaded(true)
      },
      (error) => {
        console.log(error)
        setApiLoaded(true)
      },
    )
  }

  useEffect(() => {
    retrieveData()
    const unsub = navigation.addListener('focus', () => {
      retrieveData()
    })
    //     console.log('retrieving')
  }, [])

  const renderCard = (item) => {
    //const {name,quantity,rate,num,days,startDate,endDate,bought,imageUrl}=cardDetails;
    //console.log('myorder',item);

    return (
      <MySubscriptionOrder
        navigation={navigation}
        item={item}
        {...item}
        actualUser={user}
        name={item.name}
        pickUpDate={item.pickUpDate}
        orderDate={item.orderDate}
        orderAmount={item.orderAmount}
        imageUrl={item.image}
        status={item.orderStatus}
      />
    )
  }

  // route.params

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
          title={'My Scrap Sales'}
          back={false}
          funct={() => {
            // console.log(route.params)
            route.params.navDrawer.toggleDrawer()
          }}
        />
      </View>

      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {/* <Text style={{...Styles.heading,alignSelf: 'center',paddingVertical: dimen.height/100}}>{words.title}</Text> */}

        <FlatList
          style={{ marginBottom: '5%', backgroundColor: 'white', flex: 1 }}
          extraData={extraData}
          data={data.reverse()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            let cardDetails = {}
            return (
              <TouchableOpacity
                disabled={true}
                onPress={() => {
                  return null
                }}
              >
                {renderCard(item)}
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
            fontWeight: 'bold',
            color: 'black',
            alignSelf: 'center',
            flex: 1,
          }}
        >
          No sales to show{' '}
        </Text>
      ) : null}
    </View>
  )
}

const MySubscriptionOrder = ({
  name,
  pickUpDate,
  orderAmount,
  orderDate,
  imageUrl,
  status,
  cart,
  navigation,
  actualUser,
  item,
}) => {
  const renderCartItems = (cart) => {
    //console.log("order date"+ orderDate)
    let i,
      res = []
    res.push(<Text> </Text>)
    for (i in cart) {
      res.push(
        <Text style={{ fontWeight: 'bold', fontSize: 13 }}>{`${
          cart[i].homescrap_name
        }${i == cart.length - 1 ? '' : ', '}`}</Text>,
      )
    }
    res.push(<Text> </Text>)
    return res
  }

  const goToOrder = () => {
    navigation.navigate('MyScrapSaleOrder', {
      actualUser: actualUser,
      item: item,

      card: sendingCard,
    })
  }

  const [alignment, setAlign] = useState(0)

  const sendingCard = (
    <View
      style={{
        flexDirection: 'column',
        width: dimen.width * 0.9,
        borderColor: Colors.seperatorGray,
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'center',
        marginVertical: dimen.sHm / 4,
        padding: '1%',
        paddingEnd: '3%',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.greyText1}>{getDate(orderDate)}</Text>
        <Text
          style={{
            ...styles.quantity,
            marginStart: 10,
            color:
              status === 'CANCELLED'
                ? Colors.red
                : status === 'COMPLETED'
                ? Colors.primary
                : Colors.blue,
            fontSize: 12,
          }}
        >
          {status}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', margin: 5, flex: 1, width: '100%' }}>
        <Image
          onLayout={({ nativeEvent }) => {
            setAlign(nativeEvent.layout.width)
          }}
          style={{
            height: dimen.width * 0.23,
            width: dimen.width * 0.23,
            flex: 0,
            alignSelf: 'flex-start',
          }}
          resizeMethod={'auto'}
          resizeMode="contain"
          source={
            imageUrl.trim() != ''
              ? { uri: imageUrl }
              : require('../../assets/notmaleavatar.png')
          }
        />

        <View style={{ flex: 1, marginStart: 10 }}>
          <Text
            style={{
              ...Styles.heading,
              alignSelf: 'center',
              width: '100%',
              marginStart: 55,
              backgroundColor: 'transparent',
              marginBottom: '5%',
              fontSize: 14,
            }}
          >
            {name}
          </Text>
          <ScrollView
            persistentScrollbar
            indicatorStyle="white"
            horizontal
            style={{
              flex: 1,
              flexDirection: 'row',
              margin: '5%',
              padding: '3%',
              alignSelf: 'flex-start',
              marginStart: 30,
              backgroundColor: Colors.whiteBackground,
              margin: '1%',
              borderRadius: 5,
              borderColor: Colors.seperatorGray,
              borderWidth: 0.5,
            }}
          >
            {renderCartItems(cart)}
          </ScrollView>

          <Text
            style={{
              ...styles.quantity,
              marginStart: 30,
              alignSelf: 'flex-start',
              fontSize: 13,
            }}
          >{`Pick-up Date : ${getDate(pickUpDate.substring(0, 10))}`}</Text>

          <Text
            style={{
              ...styles.quantity,
              color: 'black',
              marginStart: 30,
              alignSelf: 'flex-start',
              fontSize: 13,
            }}
          >
            Approx. amount : ₹{orderAmount}
          </Text>

          {/* <Text style = {{...styles.rate,color: 'black',marginStart: alignment/8,fontSize: 12,alignSelf:'center',marginTop:'3%'}}>{num+" deliveries"}</Text> */}

          <View
            style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
          ></View>
        </View>
      </View>
    </View>
  )

  const card = (
    <View
      style={{
        flexDirection: 'column',
        width: dimen.width * 0.9,
        borderColor: Colors.seperatorGray,
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'center',
        marginVertical: dimen.sHm / 4,
        padding: '1%',
        paddingEnd: '3%',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.greyText1}>{getDate(orderDate)}</Text>
        <Text
          style={{
            ...styles.quantity,
            marginStart: 10,
            color:
              status === 'CANCELLED'
                ? Colors.red
                : status === 'COMPLETED'
                ? Colors.primary
                : Colors.blue,
            fontSize: 12,
          }}
        >
          {status}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', margin: 5, flex: 1, width: '100%' }}>
        <Image
          onLayout={({ nativeEvent }) => {
            setAlign(nativeEvent.layout.width)
          }}
          style={{
            height: dimen.width * 0.23,
            width: dimen.width * 0.23,
            flex: 0,
            alignSelf: 'flex-start',
          }}
          resizeMethod={'auto'}
          resizeMode="contain"
          source={
            imageUrl.trim() != ''
              ? { uri: imageUrl }
              : require('../../assets/notmaleavatar.png')
          }
        />

        <View style={{ flex: 1, marginStart: 10 }}>
          <Text
            style={{
              ...Styles.heading,
              alignSelf: 'center',
              width: '100%',
              marginStart: 55,
              backgroundColor: 'transparent',
              marginBottom: '5%',
              fontSize: 14,
            }}
          >
            {name}
          </Text>
          <ScrollView
            persistentScrollbar
            indicatorStyle="white"
            horizontal
            style={{
              flex: 1,
              flexDirection: 'row',
              margin: '5%',
              padding: '3%',
              alignSelf: 'flex-start',
              marginStart: 30,
              backgroundColor: Colors.whiteBackground,
              margin: '1%',
              borderRadius: 5,
              borderColor: Colors.seperatorGray,
              borderWidth: 0.5,
            }}
          >
            {renderCartItems(cart)}
          </ScrollView>

          <Text
            style={{
              ...styles.quantity,
              marginStart: 30,
              alignSelf: 'flex-start',
              fontSize: 13,
            }}
          >{`Pick-up Date : ${getDate(pickUpDate.substring(0, 10))}`}</Text>

          <Text
            style={{
              ...styles.quantity,
              color: 'black',
              marginStart: 30,
              alignSelf: 'flex-start',
              fontSize: 13,
            }}
          >
            Approx. amount : ₹{orderAmount}
          </Text>

          {/* <Text style = {{...styles.rate,color: 'black',marginStart: alignment/8,fontSize: 12,alignSelf:'center',marginTop:'3%'}}>{num+" deliveries"}</Text> */}

          <View
            style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
          ></View>
        </View>
      </View>
      <View style={styles.bottomArrowRow}>
        <AntDesign
          name="right"
          size={18}
          color={Colors.primary}
          style={{ alignSelf: 'flex-end' }}
        />
        <View style={{ height: 5 }} />
      </View>
    </View>
  )

  return <TouchableOpacity onPress={goToOrder}>{card}</TouchableOpacity>
}

const styles = StyleSheet.create({
  bottomRightArrow: {
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
    paddingRight: 10,
    paddingBottom: 30,
  },
  tabs: {
    width: dimen.width - dimen.width / 10,
    aspectRatio: 10 / 1.5,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    marginTop: '5%',
    alignSelf: 'center',
    margin: '3%',
  },
  tab: {
    width: (dimen.width - dimen.width / 10) / 2,
    aspectRatio: 10 / 1.5 / 2,
    borderRadius: 15,
    backgroundColor: '#43E0B4',
    flexDirection: 'row',
    //  marginTop: '6%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabWord: {
    fontWeight: 'bold',
    color: Colors.white,
  },
  card: {
    width: dimen.width - dimen.width / 10,
    height: dimen.height / 3.4,
    borderRadius: 15,
    borderColor: Colors.seperatorGray,
    borderWidth: 0.5,
    padding: '2%',
    marginTop: '5%',
    alignSelf: 'center',
    backgroundColor: 'white',
    elevation: 1,
    // marginBottom:'1%'
  },
  cardTitle: {
    fontWeight: 'bold',
    color: Colors.primary,
    padding: '1%',
    fontSize: 14,
  },
  duration: {
    paddingVertical: 5,
    paddingHorizontal: 3,
    margin: 3,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    flexDirection: 'row',
  },

  line: {
    borderWidth: 0.5,
    borderColor: Colors.seperatorGray,
    marginVertical: '2%',
  },
  name: {
    fontWeight: '400',
    fontSize: 18,
    padding: 5,
    marginTop: '2%',
    fontWeight: 'bold',
    color: 'black',
  },
  quantity: {
    marginStart: '35%',
    marginTop: '3%',
    fontWeight: 'bold',

    fontSize: 15,

    padding: 1,
  },
  rate: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: '3%',

    color: 'black',
  },
  greyText: {
    color: 'gray',
    fontSize: 15,
    fontWeight: 'bold',
    marginStart: '10%',
    paddingVertical: '3%',

    marginVertical: '4%',
  },
  greyText1: {
    marginStart: '3%',
    color: 'gray',
    fontSize: 12,
    fontWeight: 'bold',
    margin: '2%',
    marginTop: '4%',
  },
  image1: {
    width: 60,
    height: 60,
    position: 'absolute',
    padding: 10,
    zIndex: 10000,
  },
  image: {
    width: 80,
    height: 80,
    position: 'absolute',
    marginStart: '4%',
    marginTop: '10%',
  },
  icon: {
    marginVertical: '2.2%',

    position: 'absolute',
    right: '2%',
  },
  yes: {
    color: Colors.primary,
    marginTop: '3.5%',
    fontWeight: 'bold',
    fontSize: 15,
  },
})
