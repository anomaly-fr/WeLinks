import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  StyleSheet,
  navigator,
  FlatList,
  Dimensions,
  Image,
  Alert,
} from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Geolocation from '@react-native-community/geolocation'
import Qs from 'qs'
import Axios, * as axios from 'axios'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native'
import Button from '../components/ui_components/Button'
import { Config } from '../Constants'

import { Colors, dimen } from '../Constants'
const height = Dimensions.get('window').height

export default HomeAddress = ({
  item,
  style,
  route,
  deletae,
  index,
  popItem,
  routeparams,
}) => {
  const navigation = useNavigation()

  const [currentAddress, setCurrentAddress] = useState(
    item.addr_details + '.\n' + 'Landmark: ' + item.addr_landmark + '.',
  )
  const [label, setCurrentLabel] = useState(item.addr_name)
  const [image, setImage] = useState(require('../../assets/pin.png'))
  const init = () => {
    try {
      if ('office' == item.type) {
        setImage(require('../../assets/company.png'))
        console.log('logger')
        //setCurrentAddress('ne');
      } else if (item.type == 'home') setImage(require('../../assets/home.png'))
    } catch (error) {
      console.log(error)
    }
  }

  const setSelectedAddress = async (itemnow, index) => {
    console.log('ardino', route.params.actualUser)
    console.log('You are at +' + itemnow)
    console.log('parammssss')
    // routeparams.goToMySubs();
    navigation.navigate(route.params.next, {
      address: itemnow,
      actualUser: route.params.actualUser,
      tag: route.params.tag,
      ...routeparams,
    })
  }
  const delSelectedAddress = async (itemnow) => {
    console.log(item)
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete the address ',
      [
        {
          text: 'No',
          onPress: () => console.log('dum'),
        },
        {
          text: 'Yes',
          onPress: () => {
            Axios.post(
              Config.api_url +
                'php?action=delAddress&address_id=' +
                itemnow.addr_id,
            ).then(
              (response) => {
                console.log(response.data)
                Alert.alert(
                  'Delete success',
                  'The address was deleted successfully',
                  [
                    {
                      text: 'Okay',
                      onPress: () => console.log('pressed'),
                    },
                  ],
                )
              },
              (error) => {
                console.log(error)
                alert('Error deleting address')
              },
            )
            popItem(index)
          },
        },
      ],
    )
  }

  React.useEffect(() => {
    init()
  }, [])
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: dimen.sHm / 2,
        marginHorizontal: dimen.width / 50,
      }}
    >
      <Image source={image} style={styles.imageIcon} />
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          justifyContent: 'center',
          flex: 1,
          marginBottom: '5%',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.label}>{label}</Text>
        </View>

        <Text style={styles.address}>{currentAddress}</Text>
      </View>
      {deletae === true ? (
        <View style={{ marginTop: '2%' }}>
          <Button
            text="Delete"
            red={true}
            onTouch={() => {
              delSelectedAddress(item)
            }}
          />
        </View>
      ) : (
        <View>
          <Button
            text="Select"
            onTouch={() => {
              setSelectedAddress(item)
            }}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
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
    //  width: '100%',
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
