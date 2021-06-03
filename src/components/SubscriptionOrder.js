import React, { useState } from 'react'
import { View, StyleSheet, Text, Dimensions, Image, Alert } from 'react-native'
import { Colors, dimen } from '../Constants'

const SubscriptionOrder = ({
  tag,
  name,
  quantity,
  price,
  num,
  days,
  startDate,
  endDate,
  imageUrl,
  weekendPrice,
}) => {
  console.log('Tage :' + tag)

  let dayString = ''

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

  //  getDate(startDate)

  return (
    <View style={{ flexDirection: 'row', marginVertical: dimen.sHm }}>
      <View style={style.container}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={style.greyText1}>{startDate + ' to ' + endDate}</Text>
        </View>

        <View style={style.line} />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Image
            style={{
              flex: 0,
              aspectRatio: 1,
              flex: 1,
              marginLeft: dimen.width / 30,
            }}
            resizeMethod={'auto'}
            resizeMode="contain"
            source={
              imageUrl.trim() != ''
                ? { uri: imageUrl }
                : require('../../assets/notmaleavatar.png')
            }
          />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-around',
              marginStart: dimen.width / 20,
              flex: 2,
            }}
          >
            <Text style={{ ...style.name }}>{name}</Text>

            <View style={{ flexDirection: 'row', marginTop: '2.5%' }}>
              <Text style={{ ...style.quantity, fontSize: 13 }}>
                {quantity.includes('unit')
                  ? num + ' units · '
                  : quantity + ' · '}
              </Text>
              <Text
                style={
                  dayString[0] == 'Y'
                    ? style.yes
                    : { ...style.yes, color: 'gray' }
                }
              >
                {' '}
                M{' '}
              </Text>
              <Text
                style={
                  dayString[1] == 'Y'
                    ? style.yes
                    : { ...style.yes, color: 'gray' }
                }
              >
                T{' '}
              </Text>
              <Text
                style={
                  dayString[2] == 'Y'
                    ? style.yes
                    : { ...style.yes, color: 'gray' }
                }
              >
                W{' '}
              </Text>
              <Text
                style={
                  dayString[3] == 'Y'
                    ? style.yes
                    : { ...style.yes, color: 'gray' }
                }
              >
                T{' '}
              </Text>
              <Text
                style={
                  dayString[4] == 'Y'
                    ? style.yes
                    : { ...style.yes, color: 'gray' }
                }
              >
                F{' '}
              </Text>
              <Text
                style={
                  dayString[5] == 'Y'
                    ? style.yes
                    : { ...style.yes, color: 'gray' }
                }
              >
                S{' '}
              </Text>
              <Text
                style={
                  dayString[6] == 'Y'
                    ? style.yes
                    : { ...style.yes, color: 'gray' }
                }
              >
                S{' '}
              </Text>
            </View>

            <Text
              style={{
                ...style.price,
                color: 'gray',
                textAlign: 'left',
                fontSize: 12,
                alignSelf: 'flex-start',
              }}
            >
              {num + ' deliveries'}
            </Text>

            <View style={{ flexDirection: 'row', paddingBottom: '5%' }}>
              {tag == 'Milk' ? (
                <Text style={{ ...style.price }}>₹{price}</Text>
              ) : (
                <View>
                  <Text style={{ ...style.price }}>Weekdays : ₹{price}</Text>
                  <Text style={{ ...style.price }}>
                    Weekends : ₹{weekendPrice}
                  </Text>
                </View>
              )}
              <View style={{ flex: 1, justifyContent: 'flex-end' }}></View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 30,

    elevation: 1,
    padding: '1%',

    borderRadius: 15,

    alignSelf: 'center',
    backgroundColor: 'white',
    elevation: 1,
  },

  line: {
    borderWidth: 0.5,
    borderColor: Colors.seperatorGray,
    marginVertical: '2%',
  },
  name: {
    fontWeight: '400',
    fontSize: 16,

    fontWeight: 'bold',
    color: 'black',
  },
  quantity: {
    fontWeight: 'bold',

    fontSize: 13,

    padding: 1,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: '2%',
    color: 'black',
  },
  greyText: {
    color: 'gray',
    fontSize: 15,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    fontSize: 13,
  },
})

export default SubscriptionOrder
