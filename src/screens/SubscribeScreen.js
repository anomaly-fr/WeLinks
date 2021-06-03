import React, { Fragment, useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  BackHandler,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

import BottomSheet from 'reanimated-bottom-sheet'
import Animated from 'react-native-reanimated'
import SubmitButton from '../components/SubmitButton'
import moment from 'moment'
import Date, { okay } from './Date'
import WeekPicker from '../components/ui_components/WeekPicker'
import SubscriptionScreen from './SubscriptionScreen'
import { Colors, dimen, Styles } from '../Constants'
import AppBar from '../components/ui_components/AppBar'
import { useAuth } from '../services/auth-service'

bs = React.createRef()

thisDay = moment().utcOffset('+05:30').format('YYYY-MM-DD')
const tomorrow = moment().add(1, 'days').endOf('days').format('YYYY-MM-DD')

const figureDate = (dateref) => {
  const monthNames = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  for (let i = 1; i <= 12; i++) {
    var t = i < 10 ? '0' + i : i
    var starting
    if (dateref.includes(monthNames[i])) {
      starting =
        dateref.charAt(dateref.length - 4) +
        dateref.charAt(dateref.length - 3) +
        dateref.charAt(dateref.length - 2) +
        dateref.charAt(dateref.length - 1) +
        '-' +
        t +
        '-' +
        dateref.charAt(0) +
        dateref.charAt(1)

      console.log('Fig ' + starting)
      return starting
    }
  }
}

const SubscribeScreen = ({ navigation, route }) => {
  const { pname } = route.params
  const { pquan } = route.params
  const { actualUser, address } = route.params
  const { tag } = route.params
  const { price, weekendPrice, imageUrl, productId, vendorId } = route.params
  console.log('Tag Subscribe ' + tag)
  const [isPressed, setIsPressed] = useState(false)

  const [dateref, setDateRef] = useState('Not selected')
  const [dateref1, setDateRef1] = useState('Not selected')
  const [usableStartDate, setUsableStartDate] = useState(null)
  const [usableEndDate, setUsableEndDate] = useState(null)

  // This sets start
  const setDate = (date) => {
    setDateRef(date)
    setDateRef1('Not selected')

    console.log('date ' + date)
    bs.current.snapTo(2)
  }

  // This sets end
  const setDate1 = (date1) => {
    setDateRef1(date1)
    console.log('d1 ' + date1)
    bs.current.snapTo(2)
  }

  // Start date Calendar
  const renderContent1 = () => {
    //    console.log(starting)
    return (
      <View style={{ backgroundColor: 'white' }}>
        <Date
          setDate={setDate1}
          setUsableDate={setUsableStartDate}
          text="Set End Day"
          starting={figureDate(dateref)}
        />

        <TouchableOpacity
          style={style.button}
          onPress={() => {
            bs.current.snapTo(2)
          }}
        >
          <Text style={style.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    )
  }
  // End date Calendar
  const renderContent2 = () => {
    return (
      <View style={{ backgroundColor: 'white', paddingBottom: 100 }}>
        <Date
          text="Set Start Day"
          setUsableDate={setUsableEndDate}
          setDate={setDate}
          starting={tomorrow}
        />

        <TouchableOpacity
          style={style.button}
          onPress={() => {
            // if(dateref == 'Not selected'){
            //   isSet(false);
            //   console.log('isSet: ' + set);
            // }
            bs.current.snapTo(2)
          }}
        >
          <Text style={style.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderHeader = () => (
    <View style={style.header}>
      <View style={style.panelHeader}>
        <View style={style.panelHandle} />
      </View>
    </View>
  )

  var order = {}

  const subsResult = (sub) => {
    order = sub
    // console.log(order)

    // navigation.navigate('Cart')
    console.log('ss', actualUser)

    console.log('cart_logs',{
      pname,
      price,
      pquan,
      weekendPrice,
      order,
      actualUser,
      imageUrl,
      usableStartDate,
      usableEndDate,
      productId,
      vendorId,
      tag,
      vendorType: route.params.vendorType,
      address,
      ...route.params,
    } );

    navigation.navigate('Cart', {
      pname,
      price,
      pquan,
      weekendPrice,
      order,
      actualUser,
      imageUrl,
      usableStartDate,
      usableEndDate,
      productId,
      vendorId,
      tag,
      vendorType: route.params.vendorType,
      address,
      ...route.params,
    })
  }

  console.log('TAG' + tag)
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // console.log('Go to vendor');
        navigation.navigate('MilkVendors')
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }),
  )

  var fall = new Animated.Value(1)

  return (
    <View>
      <AppBar
        title={'Make a subscription'}
        back={true}
        funct={() => {
          navigation.pop()
        }}
      />

      <View style={{ ...Styles.parentContainer }}>
        <BottomSheet
          enabledContentTapInteraction={true}
          ref={bs}
          snapPoints={[dimen.height - dimen.appbarHeight * 3, 600, 0]}
          renderContent={!isPressed ? renderContent1 : renderContent2}
          renderHeader={renderHeader}
          initialSnap={2}
          callbackNode={fall}
          enabledGestureInteraction={false}
        />
        <Animated.View
          style={{
            margin: '0.5%',
            opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
          }}
        >
          <View>
            <SubscriptionScreen
              dateref={dateref}
              dateref1={dateref1}
              result={subsResult}
              onCalendarOpen={() => {
                bs.current.snapTo(0)
                setIsPressed(true)
              }}
              onCalendarOpen1={() => {
                bs.current.snapTo(0)
                setIsPressed(false)
              }}
              pname={pname}
              price={price}
              pquan={pquan}
              weekendPrice={weekendPrice}
              imageUrl={imageUrl}
              actualUser={actualUser}
              tag={tag}

              // goTo={()=> navigation.navigate('Cart',{
              //   pname: pname,
              //   price: price,
              //   pquan: pquan,         // Refers to 'Rs. 22 for 1 packet'
              //   weekendPrice: weekendPrice,
              //   // pnumber: order.number,
              //   // pdays: order.days,
              //   // startDate: order.start,
              //   // endDate: order.end

              // })}
              // onWeekOpen={() => {
              //   bs.current.snapTo(0)
              //   setIsPressed(true)
              // }}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  panel: {
    padding: 20,
    backgroundColor: 'white',
    paddingTop: 10,
    height: Dimensions.get('window').height,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 0.2,
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: '10%',
    aspectRatio: 5 / 0.5,
    borderRadius: 4,
    backgroundColor: 'gray',
    marginBottom: '3%',
  },

  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    color: 'white',
    fontWeight: '300',
    ...StyleSheet.absoluteFill,
  },
  button: {
    alignSelf: 'center',
    marginTop: '5%',

    backgroundColor: Colors.primary,
    width: '92%',
    aspectRatio: 10 / 1.4,
    borderRadius: 5,
  },
})

export default SubscribeScreen
