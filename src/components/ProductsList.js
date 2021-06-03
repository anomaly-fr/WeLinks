import React from 'react'
import { View, FlatList } from 'react-native'
import Product from '../components/Product'
import { dimen } from '../Constants'

// List of all products the selected vendor sells

const ProductsList = ({ navigation, data, vendorID, address, tag }) => {
  console.log('dat', JSON.stringify(data))
  console.log('vendor_id @ ProductsList', vendorID);
  console.log('address @ ProductsList', address);
  return (
    <View style={{ padding: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.name}
        style={{ maxHeight: dimen.height * 0.5 }}
        renderItem={({ item }) => {
          console.log('hey', item)
          return (
            <Product
              place="list"
              tag={tag}
              name={item.name}
              quantity={item.quantity}
              weekendPrice={item.weekend_price}
              price={tag == 'Milk' ? item.price : item.weekday_price}
              uri={
                tag == 'Milk' ? item.product_img_url : item.product_image_url
              }
              subscribe={() => {
                const prodName = item.name
                const prodQuan = item.quantity
                const prodRate = item.price
                const productId = item.id

                console.log(JSON.stringify(item))

                navigation.navigate('SubscribeScreen', {
                  tag: tag,
                  pname: prodName,
                  pquan: prodQuan,
                  prate: prodRate,
                  imageUrl:
                    tag == 'Milk'
                      ? item.product_img_url
                      : item.product_image_url,
                  vendorId: vendorID,
                  productId: productId,
                  address: address,
                  weekendPrice: item.weekend_price,
                  price: tag == 'Milk' ? item.price : item.weekday_price,
                })
              }}
            />
          )
        }}
      />
    </View>
  )
}

export default ProductsList
