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
import { Colors, TextSpinnerBoxStyles, dimen, Styles } from '../Constants'
import { useFocusEffect } from '@react-navigation/native'
import AppBar from '../components/ui_components/AppBar'
import Axios from 'axios'
import LottieView from 'lottie-react-native'
import { Config } from '../Constants'
import ymdToApp from '../Utility/dateConvertor'

var data = []

export default function MySubscriptions({ navigation, route }) {
  const [extraData, setExtraData] = useState(0)
  const { user } = route.params
  const [apiLoaded, setApiLoaded] = useState(false)
  const { actualUser } = route.params
  const inStack = route.params.inStack === undefined ? false : true
  const { navigator } = route.params
  console.log('UID' + actualUser.user_id)

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log("Can't go back from here")
        inStack ? navigation.goBack() : route.params.goBackToHome()

        // navigation.goBack();
        //   navigation.reset();

        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }),
  )

  const prepareResponse = (dataa) => {
    setApiLoaded(true)
    //  console.log(dataa);
    data = []
    dataa.forEach((item) => {
      //     console.log("dataaa " + item.product_name);

      //        console.log(item.subscription_days);
      if (item.order_status != 'Canceled')
        data.push({
          name: item.product_name,
          imageUrl: item.product_image,
          startDate: item.subscription_start_date,
          endDate: item.subscription_end_date,
          bought: item.quantity,
          rate: item.order_amount,
          num: item.no_of_deliveries,
          daynotprop: item.subscription_days,
          tag: item.product_type,
          quantity: item.quantity,
          status:
            item.subscription_status === 'Pending' ? 'Ongoing' : 'Completed',
        })
    })
    setExtraData(Math.random(0.3))
  }

  const retrieveData = () => {
    Axios.get(
      Config.api_url + 'php?action=getSubscriptions&user_id=' + user.user_id,
    ).then(
      (response) => {
        //  console.log(user.user_id);
        //  console.log("resp" +response.data.);
        //data=response.data;
        prepareResponse(response.data)
        setExtraData(Math.random(0.5))
        setApiLoaded(true)
      },
      (error) => {
        console.log(error)
        setApiLoaded(true)
      },
    )
    setApiLoaded(false)
  }

  useEffect(() => {
    retrieveData()
    const unsub = navigation.addListener('focus', () => {
      retrieveData()
    })
  }, [])

  const renderCard = (item) => {
    //const {name,quantity,rate,num,days,startDate,endDate,bought,imageUrl}=cardDetails;
    //  console.log('myorder',item);

    return (
      <MySubscriptionOrder
        {...item}
        tag={item.tag}
        quantity={item.quantity}
        days={[
          { m: item.daynotprop.includes('monday') },
          { t: item.daynotprop.includes('tuesday') },
          { w: item.daynotprop.includes('wednesday') },
          { th: item.daynotprop.includes('thursday') },
          { f: item.daynotprop.includes('friday') },
          { s: item.daynotprop.includes('saturday') },
          { su: item.daynotprop.includes('sunday') },
        ]}
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
          title={'My Subscriptions'}
          back={inStack}
          funct={() => {
            inStack ? navigation.goBack() : navigation.toggleDrawer()
          }}
        />
      </View>

      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          style={{ marginBottom: '5%', backgroundColor: 'white', flex: 1 }}
          extraData={extraData}
          data={data}
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
            No subscriptions to show{' '}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

const MySubscriptionOrder = ({
  tag,
  name,
  quantity,
  rate,
  num,
  days,
  startDate,
  endDate,
  bought,
  imageUrl,
  rate_,
  status,
}) => {
  // console.log('Tag :' + tag);

  console.log('Sta ' + startDate)
  console.log('End ' + endDate)

  const [alignment, setAlign] = useState(0)
  var dayString = ''

  //console.log(days[i])
  days[0].m
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))
  days[1].t
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))
  days[2].w
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))
  days[3].th
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))
  days[4].f
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))
  days[5].s
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))
  days[6].su
    ? (dayString = dayString.concat('Y'))
    : (dayString = dayString.concat('N'))

  return (
    <View
      style={{
        flexDirection: 'column',
        width: dimen.width * 0.95,
        borderColor: Colors.seperatorGray,
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'center',
        marginVertical: dimen.sHm / 4,
        elevation: 0,
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.greyText1}>
          {ymdToApp(startDate) + ' to ' + ymdToApp(endDate)}
        </Text>
        <Text style={{ color: 'red', margin: '2%', fontWeight: 'bold' }}>
          {status}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          margin: 5,
          backgroundColor: 'transparent',
          flex: 1,
          width: '100%',
        }}
      >
        <Image
          onLayout={({ nativeEvent }) => {
            setAlign(nativeEvent.layout.width)
          }}
          style={{
            height: dimen.width * 0.2,
            width: dimen.width * 0.2,
            flex: 0,
            alignSelf: 'center',
            marginHorizontal: '3%',
          }}
          resizeMethod={'auto'}
          resizeMode="contain"
          source={
            imageUrl.trim() != ''
              ? { uri: imageUrl }
              : require('../../assets/notmaleavatar.png')
          }
        />

        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <Text
            style={{
              ...Styles.heading,
              alignSelf: 'center',
              width: '100%',
              fontSize: 14,
            }}
          >
            {name}
          </Text>

          <View style={{ flexDirection: 'row', marginVertical: '2%' }}>
            <Text style={{ ...styles.quantity }}>{quantity + ' · '}</Text>
            <Text
              style={
                dayString[0] == 'Y'
                  ? styles.yes
                  : { ...styles.yes, color: 'gray' }
              }
            >
              {' '}
              M{' '}
            </Text>
            <Text
              style={
                dayString[1] == 'Y'
                  ? styles.yes
                  : { ...styles.yes, color: 'gray' }
              }
            >
              T{' '}
            </Text>
            <Text
              style={
                dayString[2] == 'Y'
                  ? styles.yes
                  : { ...styles.yes, color: 'gray' }
              }
            >
              W{' '}
            </Text>
            <Text
              style={
                dayString[3] == 'Y'
                  ? styles.yes
                  : { ...styles.yes, color: 'gray' }
              }
            >
              T{' '}
            </Text>
            <Text
              style={
                dayString[4] == 'Y'
                  ? styles.yes
                  : { ...styles.yes, color: 'gray' }
              }
            >
              F{' '}
            </Text>
            <Text
              style={
                dayString[5] == 'Y'
                  ? styles.yes
                  : { ...styles.yes, color: 'gray' }
              }
            >
              S{' '}
            </Text>
            <Text
              style={
                dayString[6] == 'Y'
                  ? styles.yes
                  : { ...styles.yes, color: 'gray' }
              }
            >
              S{' '}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', paddingBottom: '5%' }}>
            <Text style={{ ...styles.rate }}>Order Total : ₹{rate}</Text>

            <Text
              style={{
                ...styles.rate,
                color: 'black',
                marginStart: alignment / 8,
                fontSize: 12,
                alignSelf: 'center',
                marginTop: tag == 'Paper' ? 0 : '3%',
              }}
            >
              {num + ' deliveries'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
    //   marginStart: '35%',
    marginTop: '3%',
    fontWeight: 'bold',

    fontSize: 14,

    padding: 1,
  },
  rate: {
    fontWeight: 'bold',
    fontSize: 12,
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
    alignSelf: 'center',
    flex: 1,
  },
  image1: {
    width: 60,
    height: 60,
    position: 'absolute',
    padding: 10,
    zIndex: 10000,
    //  marginVertical: '10%'
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
    fontSize: 13,
  },
})
