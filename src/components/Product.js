import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Colors, dimen } from '../Constants'

// A product available with vendor
const Product = ({
  name,
  quantity,
  price,
  weekendPrice,
  subscribe,
  uri,
  tag,
}) => {
  console.log('price', uri)
  if (tag == 'Newspaper') {
    return (
      <View style={style.container}>
        <View>
          <Image style={style.image} source={{ uri }} />
        </View>
        <View style={{ marginStart: '3%' }}>
          <Text style={style.name}>{name}</Text>
          <Text style={style.quantity}>{quantity}</Text>
          <Text style={style.price}> Weekdays- ₹{price}</Text>
          <Text style={style.price}> Weekends- ₹{weekendPrice}</Text>
        </View>

        <View style={{ justifyContent: 'center', flex: 1 }}>
          <TouchableOpacity
            style={{ ...style.button, marginTop: '0%' }}
            onPress={subscribe}
          >
            <Text style={style.text}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  } else
    return (
      <View style={style.container}>
        <View style={{ marginStart: 10 }}>
          <Image style={style.image} source={{ uri }} />
        </View>
        <View style={{ marginStart: '3%' }}>
          <Text style={style.name}>{name}</Text>
          <Text style={style.quantity}>{quantity}</Text>
          <Text style={style.price}> ₹{price}</Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TouchableOpacity style={style.button} onPress={subscribe}>
            <Text style={style.text}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
}

const style = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    flexDirection: 'row',
  },
  name: {
    fontWeight: 'bold',
    marginStart: 80,
    flex: 1,
    width: dimen.width / 3,
  },
  quantity: {
    marginStart: 80,
    marginVertical: '2%',
  },
  price: {
    fontWeight: 'bold',
    marginStart: 79,
    fontSize: 14,
    marginVertical: '2%',
  },
  button: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 1,

    width: dimen.width / 4.5,
    aspectRatio: 5 / 1.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: '22%',
  },
  text: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  image: {
    width: 80,
    height: 80,
    position: 'absolute',
    marginStart: '-1%',
    marginTop: '3%',
  },
})

export default Product
