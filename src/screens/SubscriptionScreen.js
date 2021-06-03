import React, { useState, useImperativeHandle, useEffect } from 'react'
import { View, StyleSheet, Text, Dimensions, Picker } from 'react-native'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler'

import Item from '../components/Item'
import { Feather } from '@expo/vector-icons'
import { Colors, dimen, Styles } from '../Constants'

const SubscriptionScreen = ({
  onCalendarOpen,
  onCalendarOpen1,
  pname,
  pquan,
  price,
  weekendPrice,
  dateref,
  dateref1,
  result,
  imageUrl,
  tag,
}) => {
  const words = {
    quantityPerDay: 'Quantity per day',
    repeat: 'Repeat',
    recharge: 'Recharge/Top-Up',
    duration: 'Duration',
    startDate: 'Set Start Date',
    endDate: 'Set End Date',
    subscribe: 'Subscribe',
  }
  console.log('ss ' + tag)
  const [number, setNumber] = useState(1)
  const [start, setStart] = useState('Not selected')
  const [end, setEnd] = useState('Not selected')
  const [startButtonWidth, setStartButtonWidth] = useState(0)
  const [startButtonHeight, setStartButtonHeight] = useState(0)
  //  const[wo,setWeek]= useState([true,true,true,true,true,true,true]);
  useEffect(() => {
    setStart(dateref)
    setEnd(dateref1)
    console.log('Datereff: ' + dateref)
    //   console.log('Datereff1: ' + dateref1)
  }, [dateref, dateref1])

  const [m, ms] = useState(false)
  const [t, ts] = useState(false)
  const [w, ws] = useState(false)
  const [th, ths] = useState(false)
  const [f, fs] = useState(false)
  const [s, ss] = useState(false)
  const [su, sus] = useState(false)

  const [button1, tapButton1] = useState(false)
  const [button2, tapButton2] = useState(false)
  const [button3, tapButton3] = useState(false)

  // const Item = Picker.Item;
  // const [value,setValue ] = useState('');

  const subsResult = {
    perDayQuan: { number },
    s: { start },
    e: { end },
    days: [{ m }, { t }, { w }, { th }, { f }, { s }, { su }],
  }

  return (
    <View
      style={{
        height: dimen.height - dimen.height / 8,
        width: '100%',
        backgroundColor: Colors.lightBlue,
      }}
    >
      <View style={{ flex: 0, marginHorizontal: 30 }}>
        <Item
          name={pname}
          quantity={pquan}
          price={price}
          imageUrl={imageUrl}
          tag={tag}
          weekendPrice={weekendPrice}
        />
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: 'white', margin: 3 }}>
        <View>
          <View style={{ ...style.view1, marginTop: '5%' }}>
            <Feather name="shopping-bag" size={22} color={Colors.lightIcon} />

            <Text style={style.greyText}>{words.quantityPerDay}</Text>

            <View style={style.quantityPick}>
              <TouchableOpacity
                style={style.minus}
                onPress={() => {
                  setNumber(number != 1 ? number - 1 : number)
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: 'gray',
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    borderRightColor: Colors.seperatorGray,
                    borderRightWidth: 0.7,
                    paddingRight: 6,
                    color: Colors.primary,
                  }}
                >
                  -
                </Text>
              </TouchableOpacity>

              <Text style={{ fontWeight: 'bold' }}>{number}</Text>

              <TouchableOpacity
                style={style.plus}
                onPress={() => {
                  setNumber(number + 1)
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: Colors.primary,
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    borderLeftColor: Colors.seperatorGray,
                    borderLeftWidth: 0.7,
                    paddingLeft: 6,
                  }}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={Styles.grayfullline}></View>

          <View style={style.view1}>
            <Feather name="repeat" size={22} color={Colors.lightIcon} />
            <Text style={style.greyText}>{words.repeat}</Text>
          </View>

          {/* This view aligns days and buttons */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              width: Dimensions.get('window').width,
              marginVertical: '8%',
            }}
          >
            {/* days */}
            <View style={{ ...style.weekPick, alignSelf: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  m ? ms(false) : ms(true)
                }}
              >
                <View
                  style={
                    m
                      ? { ...style.circle, backgroundColor: Colors.primary }
                      : style.circle
                  }
                >
                  <Text
                    style={m ? { ...style.day, color: 'white' } : style.day}
                  >
                    M
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  t ? ts(false) : ts(true)
                }}
              >
                <View
                  style={
                    t
                      ? { ...style.circle, backgroundColor: Colors.primary }
                      : style.circle
                  }
                >
                  <Text
                    style={t ? { ...style.day, color: 'white' } : style.day}
                  >
                    T
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  w ? ws(false) : ws(true)
                }}
              >
                <View
                  style={
                    w
                      ? { ...style.circle, backgroundColor: Colors.primary }
                      : style.circle
                  }
                >
                  <Text
                    style={w ? { ...style.day, color: 'white' } : style.day}
                  >
                    W
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  th ? ths(false) : ths(true)
                }}
              >
                <View
                  style={
                    th
                      ? { ...style.circle, backgroundColor: Colors.primary }
                      : style.circle
                  }
                >
                  <Text
                    style={th ? { ...style.day, color: 'white' } : style.day}
                  >
                    T
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  f ? fs(false) : fs(true)
                }}
              >
                <View
                  style={
                    f
                      ? { ...style.circle, backgroundColor: Colors.primary }
                      : style.circle
                  }
                >
                  <Text
                    style={f ? { ...style.day, color: 'white' } : style.day}
                  >
                    F
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  s ? ss(false) : ss(true)
                }}
              >
                <View
                  style={
                    s
                      ? { ...style.circle, backgroundColor: Colors.primary }
                      : style.circle
                  }
                >
                  <Text
                    style={s ? { ...style.day, color: 'white' } : style.day}
                  >
                    S
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  su ? sus(false) : sus(true)
                }}
              >
                <View
                  style={
                    su
                      ? { ...style.circle, backgroundColor: Colors.primary }
                      : style.circle
                  }
                >
                  <Text
                    style={su ? { ...style.day, color: 'white' } : style.day}
                  >
                    S
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* Daily/Weekdays/Weekends */}
            <View
              style={{
                ...style.weekPick,
                marginTop: '8%',
                justifyContent: 'space-around',
              }}
            >
              <TouchableOpacity
                style={{ color: 'green' }}
                onPress={() => {
                  //  button1 ? tapButton1(false) : tapButton1(true)
                  if (button1) {
                    if (button2 || button3) {
                      tapButton2(false)
                      tapButton3(false)
                    }
                    tapButton1(false)
                    ms(false)
                    ts(false)
                    ws(false)
                    ths(false)
                    fs(false)
                    ss(false)
                    sus(false)
                  } else {
                    tapButton1(true)
                    tapButton2(true)
                    tapButton3(true)
                    ms(true)
                    ts(true)
                    ws(true)
                    ths(true)
                    fs(true)
                    ss(true)
                    sus(true)
                  }
                }}
              >
                <View
                  style={
                    button1
                      ? {
                          ...style.dbutton,
                          backgroundColor: Colors.buttonEnabledGreen,
                          borderColor: 'white',
                          flex: 1,
                        }
                      : style.dbutton
                  }
                >
                  <Text
                    style={
                      button1 ? { ...style.btext, color: 'white' } : style.btext
                    }
                  >
                    Daily
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  //     button2 ? tapButton2(false) : tapButton2(true)
                  if (button2) {
                    if (button1) tapButton1(false)
                    tapButton2(false)
                    ms(false)
                    ts(false)
                    ws(false)
                    ths(false)
                    fs(false)
                  } else {
                    tapButton2(true)

                    ms(true)
                    ts(true)
                    ws(true)
                    ths(true)
                    fs(true)
                  }
                }}
              >
                <View
                  style={
                    button2
                      ? {
                          ...style.dbutton,
                          backgroundColor: Colors.buttonEnabledGreen,
                          borderColor: 'white',
                          flex: 1,
                        }
                      : style.dbutton
                  }
                >
                  <Text
                    style={
                      button2 ? { ...style.btext, color: 'white' } : style.btext
                    }
                  >
                    Weekdays
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  //   button3 ? tapButton3(false) : tapButton3(true)
                  if (button3) {
                    if (button1) tapButton1(false)
                    tapButton3(false)
                    ss(false)
                    sus(false)
                  } else {
                    tapButton3(true)

                    ss(true)
                    sus(true)
                  }
                }}
              >
                <View
                  style={
                    button3
                      ? {
                          ...style.dbutton,
                          backgroundColor: Colors.buttonEnabledGreen,
                          borderColor: 'white',
                          flex: 1,
                        }
                      : style.dbutton
                  }
                >
                  <Text
                    numberOfLines={1}
                    style={
                      button3 ? { ...style.btext, color: 'white' } : style.btext
                    }
                  >
                    Weekends
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={Styles.grayfullline} />

          {/* Last section */}
          <View>
            <View style={style.view1}>
              <Feather name="calendar" size={22} color={Colors.lightIcon} />

              <Text style={style.greyText}>{words.duration}</Text>
            </View>

            {/* Start date */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginStart: '5%',
              }}
            >
              <TouchableOpacity
                onLayout={(event) => {
                  setStartButtonWidth(event.nativeEvent.layout.width)
                  setStartButtonHeight(event.nativeEvent.layout.height)
                }}
                onPress={onCalendarOpen}
                style={style.dbutton1}
              >
                <Text numberOfLines={1} style={style.btext}>
                  {words.startDate}
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  ...style.dates,
                  position: 'absolute',
                  bottom: -7,
                  end: 30,
                }}
              >
                {start}
              </Text>
            </View>
            {/* End date */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginStart: '5%',
                marginTop: '3%',
              }}
            >
              <TouchableOpacity
                disabled={dateref == 'Not selected' ? true : false}
                onPress={onCalendarOpen1}
                style={
                  dateref == 'Not selected'
                    ? {
                        ...style.disabled,
                        width: startButtonWidth,
                        height: startButtonHeight,
                      }
                    : { ...style.dbutton1, width: startButtonWidth }
                }
              >
                <Text
                  numberOfLines={1}
                  style={
                    dateref == 'Not selected'
                      ? { ...style.btext, color: Colors.disabledButton }
                      : style.btext
                  }
                >
                  {words.endDate}
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  ...style.dates,
                  position: 'absolute',
                  bottom: -7,
                  end: 30,
                }}
              >
                {end}
              </Text>
            </View>
            {/* Button */}
          </View>
          <TouchableOpacity
            style={
              dateref == 'Not selected' ||
              dateref1 == 'Not selected' ||
              (m == false &&
                t == false &&
                w == false &&
                th == false &&
                f == false &&
                s == false &&
                su == false)
                ? { ...style.subscribe, backgroundColor: Colors.disabledButton }
                : style.subscribe
            }
            disabled={
              dateref == 'Not selected' ||
              dateref1 == 'Not selected' ||
              (m == false &&
                t == false &&
                w == false &&
                th == false &&
                f == false &&
                s == false &&
                su == false)
                ? true
                : false
            }
            onPress={() => {
              if (subsResult.s.start == 'Not selected')
                console.log(subsResult.s.start)
              else result(subsResult)
            }}
          >
            <Text style={style.subscribeText}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    ...Styles.parentContainer,
    marginTop: '0%',
  },

  view1: {
    flexDirection: 'row',

    marginVertical: '4.5%',
    marginStart: '5%',
  },

  greyText: {
    marginStart: '4%',
    color: 'gray',

    fontSize: 15,
    fontWeight: 'bold',
    padding: 1,
  },

  quantityPick: {
    flexDirection: 'row',
    width: '20%',
    aspectRatio: 4 / 1.5,
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderRadius: 20,
    position: 'absolute',
    right: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  dates: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: '4%',
  },

  minus: {
    alignSelf: 'center',
  },
  plus: {
    alignSelf: 'center',
  },

  circle: {
    //yes
    backgroundColor: Colors.whiteBackground,
    height: dimen.width / 9.5,
    width: dimen.width / 9.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: dimen.width / 9.5 / 2,
  },

  day: {
    //yes

    color: Colors.seperatorGray,

    fontSize: dimen.width / 24,
    fontWeight: 'bold',

    alignItems: 'center',
    justifyContent: 'center',
  },
  weekPick: {
    marginTop: '-8%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',

    alignItems: 'center',
    width: Dimensions.get('window').width - 30,

    margin: '1%',
    padding: '0.5%',
  },
  dbutton: {
    borderRadius: 5,
    borderColor: Colors.primary,
    borderWidth: 1.5,

    //  width: Dimensions.get('window').width/3,
    height: Dimensions.get('window').height / 27,
    aspectRatio: 4 / 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    // padding:'0.5%',

    flexDirection: 'row',
  },
  dbutton1: {
    borderRadius: 5,
    borderColor: Colors.primary,
    borderWidth: 1.5,
    flex: 0,

    //  width: Dimensions.get('window').width/3,
    height: Dimensions.get('window').height / 29,
    aspectRatio: 4 / 1,
    alignItems: 'center',
    justifyContent: 'center',

    flexDirection: 'row',
  },

  disabled: {
    borderRadius: 5,

    borderWidth: 1.5,

    //  width: Dimensions.get('window').width/10,
    height: Dimensions.get('window').height / 25,

    alignItems: 'center',

    flexDirection: 'row',

    borderColor: Colors.disabledButton,
  },
  btext: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  subscribe: {
    backgroundColor: Colors.primary,
    width: Dimensions.get('window').width - 30,
    height: 45,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: dimen.mVm * 1.5,
  },
  subscribeText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    color: 'white',
    fontWeight: '300',
    ...StyleSheet.absoluteFill,
  },
})

export default SubscriptionScreen
