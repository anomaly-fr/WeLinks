import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  BackHandler,
} from 'react-native'
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler'
import Vendor from '../components/Vendor'
import { useFocusEffect } from '@react-navigation/native'
import AppBar from '../components/ui_components/AppBar'
import { Avatar } from 'react-native-paper'
import { Styles, Colors, dimen } from '../Constants'
import { Feather } from '@expo/vector-icons'
import Axios from 'axios'
import qs from 'qs'
import { Config } from '../Constants'

let vendors = []
const ScrapVendors = ({ navigation, route }) => {
  const address = route.params.address
  const { actualUser } = route.params
  const [vendorExtraData, updateVendor] = useState(1)
  const { tag } = route.params
  const [imageHeight, setImageHeight] = useState(0)
  const [nameY, setNameY] = useState(0)

  console.log(address)
  console.log('milky', actualUser)

  const words = {
    milk: 'Scrap vendors in your locality',
  }

  const retrieveData = async (t) => {
    if (t < 0) return
    console.log('retrieving milk vendors')
    Axios.get(
      Config.api_url +
        'php?action=getVendors&' +
        qs.stringify({
          vendor_type: 'homescrap',
          lat: address.addr_latitude, // 18.5672,
          lng: address.addr_longitude, // 73.7583
        }),
    ).then(
      (response) => {
        try {
          console.log('vend ', response.data.vendor)
          vendors = response.data.vendor
          updateVendor(Math.random(0.5))
        } catch (error) {
          console.log('milkvendoreasarror', error)
          //retrieveData(t-1);
        }
      },
      (error) => {
        console.log('milkvendorerror', error)
        // retrieveData(t-1);
      },
    )
  }

  useEffect(() => {
    retrieveData(10)
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log('Go to homescreen')
        navigation.navigate('AddressList')
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }),
  )

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <AppBar
        title={'Scrap Vendors'}
        back
        funct={() => {
          navigation.pop()
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          marginBottom: dimen.mVm,
          marginTop: Dimensions.get('window').height / 16 + dimen.mVm,
          marginHorizontal: dimen.sHm,
          justifyContent: 'flex-start',
          alignContent: 'flex-start',
        }}
      >
        <Image
          style={{
            aspectRatio: 1,
            paddingHorizontal: dimen.width / 30,
            flex: 2,
          }}
          source={
            actualUser.img_url.trim() != ''
              ? { uri: actualUser.img_url }
              : require('../../assets/notmaleavatar.png')
          }
        />

        <View
          style={{
            flex: 5,
            justifyContent: 'space-between',
            marginLeft: dimen.sHm,
          }}
        >
          <Text style={{ ...style.username }}>{actualUser.name}</Text>
          <View style={{ ...style.address }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="map-pin" size={12} color="black" />
              <Text style={{ fontSize: 13 }}>{' ' + address.addr_name}</Text>
            </View>
            <Text numberOfLines={3} style={{ fontSize: 11 }}>
              {address.addr_details + '.\nLandmark: '}
            </Text>
            <View style={{ height: 0.5 }} />

            <Text numberOfLines={1} style={{ fontSize: 11 }}>
              Landmark: {address.addr_landmark}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 7, flexDirection: 'column' }}>
        <View style={{ ...Styles.grayfullline }} />

        <View style={style.heading}>
          <Text
            style={{ ...Styles.title, fontSize: 17, marginVertical: dimen.mVm }}
          >
            {words.milk}
          </Text>
        </View>

        {vendors.length == 0 ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14 }}>
              There are no registered vendors in your locality
            </Text>
          </View>
        ) : (
          <FlatList
            data={vendors}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => {
              const vendorName = item.company_name
              const vendorStars = item.avg_ratings
              const vendorReviews = item.reviews_number
              const vendor_id = item.vendor_id
              var brandsString = ''
              const brands =
                item.categories.homescrap != undefined
                  ? item.categories.homescrap
                  : []
              const imageUrl = item.vendor_img_url
              const vendorAddress =
                item.addresses[0] != undefined
                  ? item.addresses[0].addr_details +
                    ' ' +
                    item.addresses[0].addr_landmark +
                    ' ' +
                    item.addresses[0].addr_pincode
                  : ' '
              console.log('itembrands', brands)

              for (let i = 0; i < brands.length - 1; i++)
                brandsString = brandsString + brands[i].toString() + ',' + ' '
              if (brands.length > 0)
                brandsString =
                  brandsString + brands[brands.length - 1].toString()
              console.log(brandsString)

              return (
                <Vendor
                  name={vendorName}
                  scrap={brandsString}
                  stars={item.avg_ratings}
                  reviews={item.reviews_number}
                  imageUrl={imageUrl}
                  onSelected={() => {
                    navigation.navigate('ScrapVendor', {
                      tag: 'scrap',
                      name: vendorName,
                      stars: vendorStars,
                      reviews: vendorReviews,
                      address: address,
                      vendorAddress: vendorAddress,
                      imageUrl: imageUrl,
                      actualUser: actualUser,
                      vendorId: vendor_id,
                    })
                  }}
                />
              )
            }}
          />
        )}
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  header: {
    marginVertical: '5%',
    marginHorizontal: '2%',
    //  padding: '3%',
    //  backgroundColor: 'blue',
    //   marginStart: '20%',
    //  width: 0.8* dimen.width,
    flex: 1,
  },

  address: {
    marginTop: '3%',
    borderRadius: 5,
    backgroundColor: Colors.whiteBackground,
    borderColor: Colors.seperatorGray,
    borderWidth: 0.5,

    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    elevation: 1,
  },
  line: {
    borderWidth: 0.5,
    borderColor: 'gray',
    marginVertical: '2%',
  },
  heading: {
    //   marginBottom: '5%'
  },
  avatar: {
    marginHorizontal: '3%',
    padding: '3%',
    alignSelf: 'flex-start',
    marginTop: '6%',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
  },
})

export default ScrapVendors
