import React, { useEffect, useState, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  BackHandler,
} from 'react-native'
import {
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler'
import Vendor from '../components/Vendor'
import { Styles, Colors, dimen } from '../Constants'
import Accordion from 'react-native-collapsible/Accordion'
import * as Animatable from 'react-native-animatable'
import { Entypo } from '@expo/vector-icons'
import AppBar from '../components/ui_components/AppBar'
import Axios from 'axios'
import qs from 'qs'
import { Config } from '../Constants'
import ProductsList from '../components/ProductsList'

// Details of the selected vendor

const ProductVendor = ({ route, navigation }) => {
  const [brandImages, setBrandImages] = useState([])
  const [sections, setSections] = useState([])
  const [activeSections, setActiveSections] = useState([])
  const scrollView = useRef()

  const [vendorData, setVendorData] = useState(route.params);

  console.log("@vendorData logged", vendorData);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack()
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }),
  )

  const fetchVendor = async (t) => {
    if (t < 0) return
    
    console.log("vendor_id @ Product_vendor", vendorData.vendorId);

    Axios.get(
      Config.api_url +
        'php?action=getProductsList&' +
        qs.stringify({
          vendorID: vendorData.vendorId,
          vendor_type: vendorData.tag == 'Milk' ? 'milk' : 'newspaper',
        }),
      {
        'Accept-Encoding': 'gzip',
      },
    ).then(
      (response) => {
        try {
          console.log('response', JSON.stringify(response.data.products.brands))
          setSections(response.data.products.categories)
          setBrandImages(response.data.products.brands)
        } catch (error) {
          console.log(error)
          alert(`Error retrieving vendor`)
          fetchVendor(--t)
        }
      },
      (error) => {
        console.log(error)
        alert(`Error retrieving vendor`)

        fetchVendor(--t)
      },
    )
  }

  useEffect(() => {
    fetchVendor(10)
  }, [])

  const renderBrands = (item) => {

    //TODO check
    return (
      <View style={{ flex: 0 }}>
        <Image
          style={{ ...Styles.horizontalImage }}
          source={{ uri: vendorData.tag == "Milk" ?  item.brand_img_url :item.brand_image_url  }}
        />
      </View>
    )
  }

  const renderContent = (section, _, isactive) => {
    console.log(section[Object.keys(section)[0]])

    console.log("@ render@ProdVendor", vendorData.vendorId);


    return (
      <Animatable.View
        duration={400}
        style={{ ...Styles.collapsibleView }}
        transition="backgroundColor"
      >
        <ProductsList
          vendorID={vendorData.vendorId}
          navigation={navigation}
          data={section[Object.keys(section)[0]]}
          address={vendorData.address.addr_id}
          tag={vendorData.tag}
        />
      </Animatable.View>
    )
  }

  const renderHeader = (section, _, isActive) => {
    let expanderButton = (
      <Entypo name="triangle-down" size={20} color={'black'} />
    )

    if (!isActive)
      expanderButton = <Entypo name="chevron-down" size={21} color={'black'} />
    else expanderButton = <Entypo name="chevron-up" size={21} color={'black'} />

    return (
      <Animatable.View
        duration={400}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 5,
        }}
        transition="backgroundColor"
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            color: 'black',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          {Object.keys(section)[0]}
        </Text>
        {expanderButton}
      </Animatable.View>
    )
  }

  const setSectionsFunction = (sections) => {
    setActiveSections(sections.includes(undefined) ? [] : sections)

    setTimeout(() => {
      if (sections.length != 0)
        scrollView.current?.scrollTo({
          x: 0,
          y: (Dimensions.get('window').height / 9 - 20) * sections[0],
          animated: true,
        })
    }, 1000)
  }

  return (
    <View style={{ ...StyleSheet.absoluteFill }}>
      <View>
        <AppBar
          title={vendorData.vendorName}
          back
          funct={() => {
            navigation.navigate('ProductVendors', {})
          }}
        />
      </View>
      <View style={{ height: dimen.height / 16 }} />

      <View style={{ flex: 0, backgroundColor: Colors.secondary, padding: 10 }}>
        <View style={{ margin: '0%', padding: '0%' }}>
          <Vendor
            style={{ height: '40%', width: '80%', alignSelf: 'center' }}
            buttonVisible={false}
            name={vendorData.vendorName}
            reviews={vendorData.vendorReviews}
            stars={vendorData.vendorStars}
            address={vendorData.vendorAddress}
            imageUrl={vendorData.imageUrl}
          />
        </View>
        <View>
          <Text
            style={{
              paddingLeft: 14,
              fontSize: 15,
              fontWeight: 'bold',
              marginBottom: 5,
            }}
          >
            Brands:
          </Text>
          <FlatList
            style={{ ...Styles.halfFlatlist, paddingLeft: 5 }}
            renderItem={({ item }) => renderBrands(item)}
            data={brandImages}
            horizontal
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView ref={scrollView}>
          <Accordion
            style={{ ...Styles.accordion }}
            sections={sections}
            renderContent={renderContent}
            touchableComponent={TouchableOpacity}
            expandMultiple={false}
            renderHeader={renderHeader}
            activeSections={activeSections}
            onChange={setSectionsFunction}
          />
        </ScrollView>
      </View>
    </View>
  )
}

export default ProductVendor
