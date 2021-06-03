import { max } from 'moment'
import React, { useState } from 'react'
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native'
import { Styles, Colors, dimen } from '../Constants'

const Item = ({ name, quantity, price, weekendPrice, imageUrl, tag }) => {
  const [w, setW] = useState(0)
  const [w1, setW1] = useState(0)
  const dimg = require('../../assets/ic_launcher.png')
  console.log(tag)
  const defaultimg = dimg.uri
  if (tag == 'Newspaper')
    return (
      <View
        style={{
          flexDirection: 'row',
          backfaceVisibility: Colors.secondary,
          paddingVertical: dimen.mVm,
        }}
      >
        <Image
          style={style.image}
          source={{ uri: imageUrl != '' ? imageUrl : defaultimg }}
        />

        <View style={style.container}>
          <Text style={style.name}>{name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0 }}>
            <View style={{ flex: 1, borderRadius: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  onLayout={(event) => {
                    setW(event.nativeEvent.layout.width)
                  }}
                  style={{ flexDirection: 'row', width: w1 }}
                >
                  <Text
                    style={{
                      ...style.price,
                      marginVertical: 0,
                      paddingVertical: 0,
                      fontSize: 12,
                      alignSelf: 'center',
                    }}
                  >
                    {'Weekends- ₹' + weekendPrice}
                  </Text>
                </View>
                <Text
                  style={{
                    ...style.quantity,
                    fontWeight: 'bold',
                    margin: 0,
                    padding: 0,
                    alignSelf: 'center',
                    padding: 0,
                  }}
                >
                  ·{' '}
                </Text>

                <Text
                  style={{
                    ...style.quantity,
                    alignSelf: 'center',
                    padding: 0,
                  }}
                >
                  {quantity + 'unit/s'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View
                  onLayout={(event) => {
                    setW1(event.nativeEvent.layout.width)
                  }}
                  style={{ flexDirection: 'row' }}
                >
                  <Text
                    style={{
                      ...style.price,
                      marginVertical: 0,
                      paddingVertical: 0,
                      fontSize: 12,
                      alignSelf: 'center',
                    }}
                  >
                    {'Weekdays- ₹' + price}
                  </Text>
                </View>
                <Text
                  style={{
                    ...style.quantity,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    padding: 0,
                  }}
                >
                  ·{' '}
                </Text>
                <Text
                  style={{
                    ...style.quantity,
                    alignSelf: 'center',
                    padding: 0,
                  }}
                >
                  {quantity + ' unit/s'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )

  return (
    <View
      style={{
        flexDirection: 'row',
        backfaceVisibility: Colors.secondary,
        paddingVertical: dimen.mVm,
      }}
    >
      <Image
        style={style.image}
        source={{ uri: imageUrl != '' ? imageUrl : defaultimg }}
      />

      <View style={style.container}>
        <Text style={style.name}>{name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={style.price}>₹{price}</Text>
            <Text
              style={{
                ...style.quantity,
                alignSelf: 'center',
                fontWeight: 'bold',
              }}
            >
              ·
            </Text>
            <Text style={{ ...style.quantity, alignSelf: 'center' }}>
              {quantity}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
const style = StyleSheet.create({
  container: {
    marginTop: '0%',
    //  marginHorizontal: '1%',
    backgroundColor: Colors.lightBlue,
    flex: 2.5,

    paddingHorizontal: dimen.sHm,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    padding: 5,
    //  color: 'black'
  },
  quantity: {
    color: 'gray',
    fontSize: 11,

    padding: 5,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 13,

    padding: 5,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
  },
})

export default Item
