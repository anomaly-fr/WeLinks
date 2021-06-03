import React, { useState, Fragment, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native'
import Animated, { add } from 'react-native-reanimated'
import {
  Colors,
  Config,
  Constants,
  dimen,
  Styles,
  monthNames as mn,
} from '../Constants'
import Textbox from '../components/ui_components/TextBox'
import Button from '../components/ui_components/Button'
import SubmitButton from '../components/SubmitButton'
import SpinnerBox from '../components/ui_components/Spinner'
import AppBar from '../components/ui_components/AppBar'
import BottomSheet from 'reanimated-bottom-sheet'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'
import Axios from 'axios'
import qs from 'qs'
import ymdToApp from '../Utility/dateConvertor'

const height = Dimensions.get('window').height

var a = [
  {
    label: '9 AM - 12 PM',
    value: '9-12',
  },
  { label: '12 PM - 3 PM', value: '12-3' },
  { label: '3PM - 6PM', value: '3-6' },
]
var b = [
  {
    label: 'Metal',
    value: '1',
  },
  { label: 'Plastic', value: 2 },
  { label: 'Wood', value: 3 },
]
var c = [
  {
    label: '100-200 Kg',
    value: '1',
  },
  { label: '200-400 Kg', value: 2 },
  { label: '> 400 Kg', value: 3 },
]

const ranKey = () => Math.random(0.3).toString()

let bs = React.createRef()

export default function BidCreation1({ navigation, route }) {
  const { actualUser } = route.params
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState(null)
  const [remountTime, setRemountTime] = useState(ranKey())
  const [remountScrap, setRemountScrap] = useState(ranKey)
  const [remountWeight, setRemountWeight] = useState(ranKey)

  const tomorrow = moment().add(1, 'day').endOf('day').format('YYYY-MM-DD')
  const [startDate, setStartDate] = useState('')
  const [selected, setSelected] = useState('')

  const [endDate, setEndDate] = useState('')
  const [startSet, isStartSet] = useState(false)
  const [endSet, isEndSet] = useState(false)
  const [pickSet, isPickSet] = useState(false)

  const [time, setDropdown] = useState(a[0].value)
  const [cat, setCat] = useState(b[0].value)
  const [weight, setWeight] = useState(c[0].value)
  const [dateType, setDateType] = useState(1)

  const [temp, setTemp] = useState(tomorrow)
  console.log('Tomorrow ' + tomorrow)
  const sortDate = (date) => {
    console.log('Wrong date ' + date)
    let d = date.split('-')

    let m = mn[Number(d[1] >= 10 ? d[1] - 1 : (d[1] - 1) % 10)]
    console.log(`${d[2]}-${m}-${d[0]}}`)
    return `${d[2]}-${m}-${d[0]}`
  }

  const strings = {
    bidTitle: 'Please enter your tender details',
  }
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  )
  const onDayPress = (day) => {
    if (dateType == 1) {
      setEndDate('')
      // console.log(day.year + "-" + (day.month + 1) + "-" + day.date);

      setStartDate(day)
      isStartSet(true)
    } else if (dateType == 2) {
      setSelected('')

      setEndDate(day)
      isEndSet(true)
    } else {
      setSelected(day)
      isPickSet(true)
    }
  }

  const loadSpinners = () => {
    Axios.get(
      Config.api_url +
        'php?' +
        qs.stringify({
          action: 'getAllCorporateScrapCategories',
          city_id: actualUser.city_id,
        }),
    ).then((r) => {
      var tem = []
      try {
        console.log('execute me')
        r.data.categories.forEach((i) => {
          tem.push({
            label: i.officescrap_category_name,
            value: i.officescrap_cat_id,
          })
        })
        b = tem
        setCat(b[0].value)
        setRemountScrap(Math.random(0.3).toString())
      } catch (error) {
        console.log(error)
      }
    })
    Axios.get(
      Config.api_url +
        'php?' +
        qs.stringify({
          action: 'getCorporateScrapQuantities',
        }),
    ).then((r) => {
      var tem = []
      try {
        console.log('execute me')
        r.data.quantities.forEach((i) => {
          tem.push({
            label: i.officescrap_quant_name,
            value: i.officescrap_quant_id,
          })
        })
        c = tem
        setWeight(c[0].value)
        setRemountWeight(Math.random(0.3).toString())
      } catch (error) {
        console.log(error)
      }
    })
  }

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      console.log('soimethioodf')
      try {
        setAddress(route.params.address)
      } catch (err) {}
    })
    loadSpinners()
    return unsub
  }, [navigation, route])

  const renderContent = () => {
    //    console.log(starting)
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: dimen.height - dimen.appbarHeight,
        }}
      >
        <Fragment>
          <Calendar
            disableAllTouchEventsForDisabledDays
            displayLoadingIndicator
            onDayPress={(day) => setTemp(day.dateString)}
            minDate={
              dateType == 1 ? tomorrow : dateType == 2 ? startDate : endDate
            }
            hideExtraDays
            style={{
              borderWidth: 0.3,
              borderColor: Colors.primary,
              height: Dimensions.get('window').height / 2,
              borderRadius: 7,
              margin: 5,
            }}
            theme={{
              todayTextColor: Colors.primary,
              arrowColor: Colors.primary,
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
            markedDates={{
              [temp]: {
                color: Colors.primary,
                selected: true,

                selectedColor: Colors.primary,
                selectedTextColor: 'white',
              },
            }}
          />
        </Fragment>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('Temp ' + temp)
            onDayPress(temp)

            bs.current.snapTo(2)
          }}
        >
          <Text style={styles.buttonText}>
            {'Set Date'} ({ymdToApp(temp)})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            bs.current.snapTo(2)
          }}
        >
          <Text style={styles.buttonText}>{'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  //  return(<MyComponent />)
  const [fall, setFall] = useState(new Animated.Value(1))

  return (
    <View>
      <BottomSheet
        enabledContentTapInteraction={true}
        ref={bs}
        snapPoints={[dimen.height - dimen.appbarHeight * 3, 600, 0]}
        renderContent={renderContent}
        renderHeader={renderHeader}
        initialSnap={2}
        callbackNode={fall}
        enabledGestureInteraction={false}
      />
      <AppBar
        title="Create Tender"
        subtitle={strings.bidTitle}
        back
        funct={() => navigation.pop()}
      />
      <View
        style={{
          ...Styles.parentContainer,
          color: Colors.whiteBackground,
          height: dimen.height - dimen.height / 15,
        }}
      >
        <Animated.View
          style={{
            margin: '0.5%',
            opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
          }}
        >
          <View>
            {/* <Text style={styles.heading}>{strings.bidTitle}</Text> */}
            <ScrollView style={{}}>
              <View style={{ flex: 1 }}>
                <Textbox
                  title={'TENDER TITLE'}
                  hint={'Title'}
                  changeText={setTitle}
                />

                <View style={styles.addressContainer}>
                  <Text style={Styles.heading}>Address</Text>

                  <TouchableOpacity
                    onPress={() => {
                      console.log({
                        pick: selected,
                        end: endDate,
                        start: startDate,
                      })
                      navigation.navigate('ChooseAddress', {
                        next: 'BidCreation1',
                        actualUser: actualUser,
                        address: address,
                        cat: cat,
                        weight: weight,
                        time: time,
                        pick: selected,
                        end: endDate,
                        start: startDate,
                        profileEdit: true,
                      })
                    }}
                  >
                    <View style={styles.addressButton}>
                      {address == null ? (
                        <Text>Select an address</Text>
                      ) : (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Image
                            source={require('../../assets/pin.png')}
                            style={styless.imageIcon}
                          />
                          <View
                            style={{
                              flexDirection: 'column',
                              width: '100%',
                              justifyContent: 'flex-start',
                              flex: 1,
                            }}
                          >
                            <Text style={styless.label}>
                              {address.addr_name}
                            </Text>
                            <Text style={styless.address}>
                              {address.addr_details +
                                '.\n' +
                                'Landmark: ' +
                                address.addr_landmark +
                                '.'}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                <Textbox
                  enable={false}
                  title={'TENDER START DATE'}
                  hint={'DDMMYYYY'}
                  value={
                    startDate == '' ? 'Select start date' : ymdToApp(startDate)
                  }
                />
                <View
                  style={{
                    alignSelf: 'flex-end',
                    paddingHorizontal: dimen.width * 0.04,
                  }}
                >
                  <Button
                    text="Choose"
                    onTouch={() => {
                      setDateType(1)
                      //  console.log('Open')
                      bs.current.snapTo(0)
                    }}
                  />
                </View>
                <Textbox
                  enable={false}
                  title={'TENDER END DATE'}
                  hint={'DDMMYYYY'}
                  value={endDate == '' ? 'Select end date' : ymdToApp(endDate)}
                />
                <View
                  style={{
                    alignSelf: 'flex-end',
                    paddingHorizontal: dimen.width * 0.04,
                  }}
                >
                  <Button
                    disable={startDate == '' ? true : false}
                    gray={startDate == '' ? true : false}
                    text="Choose"
                    onTouch={() => {
                      setDateType(2)
                      bs.current.snapTo(0)
                    }}
                  />
                </View>

                <Textbox
                  enable={false}
                  title={'PICKUP DATE'}
                  hint={'DDMMYYYY'}
                  value={
                    selected == '' ? 'Select pick-up date' : ymdToApp(selected)
                  }
                />
                <View
                  style={{
                    alignSelf: 'flex-end',
                    paddingHorizontal: dimen.width * 0.04,
                  }}
                >
                  <Button
                    disable={endDate == '' ? true : false}
                    gray={endDate == '' ? true : false}
                    text="Choose"
                    onTouch={() => {
                      setDateType(3)
                      bs.current.snapTo(0)
                    }}
                  />
                </View>

                <SpinnerBox
                  title="PICKUP TIME SLOT"
                  key={remountTime}
                  data={a}
                  changeOption={setDropdown}
                />
                <SpinnerBox
                  title="SCRAP CATEGORY"
                  key={remountScrap}
                  data={b}
                  changeOption={setCat}
                />
                <SpinnerBox
                  title="APPROXIMATE WEIGHT"
                  key={remountWeight}
                  data={c}
                  changeOption={setWeight}
                />
                <View style={{ marginTop: '5%' }}>
                  <SubmitButton
                    text="Next"
                    styles={{ marginTop: '5%' }}
                    onTouch={() => {
                      console.log({
                        next: 'BidCreation1',
                        actualUser: actualUser,
                        address: address,
                        cat: cat,
                        weight: weight,
                        time: time,
                        title: title,
                        pick: selected,
                        end: endDate,
                        start: startDate,
                      })

                      if (
                        address != null &&
                        title != '' &&
                        startSet &&
                        endSet &&
                        pickSet
                      ) {
                        navigation.navigate('BidCreation2', {
                          next: 'BidCreation1',
                          actualUser: actualUser,
                          address: address,
                          cat: cat,
                          weight: weight,
                          time: time.toString(),
                          title: title,
                          pick: selected,
                          end: endDate,
                          start: startDate,
                        })
                      } else {
                        alert('Please fill all the values')
                      }
                    }}
                  />
                </View>
                <View style={{ height: dimen.appbarHeight }} />
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    color: 'black',
    marginHorizontal: '5%',
    fontSize: 20,
    fontWeight: 'bold',
  },
  panel: {
    padding: 20,
    backgroundColor: 'white',
    paddingTop: 10,
    height: dimen.height,
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
  addressContainer: {
    flexDirection: 'column',
    marginHorizontal: '3%',
  },
  addressButton: {
    backgroundColor: Colors.seperatorGray,
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
  },
})

const styless = StyleSheet.create({
  savedaddresspanel: {
    position: 'absolute',
    top: height / 10 + height / 3,
    zIndex: 100,
    bottom: 0,
    right: 0,
    left: 0,
    // backgroundColor: 'pink'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: 'black',
    width: '100%',
    alignSelf: 'flex-start',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#ecf0f1',
    padding: 0,
  },
  address: {
    alignSelf: 'center',
    fontSize: 13,

    padding: 10,
    fontWeight: '500',
    color: 'gray',
    width: '100%',
    flex: 1,
  },
  horiz: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height / 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageIcon: {
    height: height / 27,
    width: height / 27,
    alignSelf: 'flex-start',
    marginLeft: Dimensions.get('window').width / 30,
    marginTop: '1%',
  },
  buttonPos: {
    position: 'absolute',
    right: 10,
  },
})
