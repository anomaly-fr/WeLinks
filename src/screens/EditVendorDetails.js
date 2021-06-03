import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native'
import { Styles, dimen, Constants, Config } from '../Constants'
import TextBox from '../components/ui_components/TextBox'
import Button from '../components/ui_components/Button'
import SubmitButton from '../components/SubmitButton'
import DocumentPicker from 'react-native-document-picker'
import AppBar from '../components/ui_components/AppBar'
import { useNavigation } from '@react-navigation/native'
import Axios from 'axios'
import qs from 'qs'
import { NavigationEvents } from 'react-navigation'
import { set } from 'react-native-reanimated'

export default function EditVendorDetails({ route, navigation }) {
  const [presentDetails, setPresentDetails] = useState(
    route.params.VendorProfileDetails,
  )

  const [aadharFile, setAadharFile] = useState(null)
  const [gstFile, setGSTFile] = useState(null)
  const [uri, setUri] = useState(null)
  const [actualUser, setActualUser] = useState(route.params.actualUser)
  const [name, companyName] = useState(presentDetails.company_name)
  const [email, companyEmail] = useState(presentDetails.email)
  const [gst, companyGstNumber] = useState(presentDetails.gstin)
  const [address, setAddress] = useState({
    address: '',
    landmark: '',
    lat: '',
    lng: '',
    pincode: '',
  })

  function validateEmail() {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email,
      )
    ) {
      return true
    }
    return false
  }

  //   console.log("prp" + presentDetails.address)

  const updateDetails = () => {
    let fromData = new FormData()
    // if (aadharFile !== null)

    if (
      aadharFile != undefined &&
      aadharFile != null &&
      aadharFile.name != null
    ) {
      console.log('Aadhar ' + aadharFile.name + ' ' + aadharFile.uri)

      fromData.append('id_proof_document', {
        uri: aadharFile.uri,
        type: 'image/jpeg',
        name: aadharFile.name,
      })
    }
    if (gstFile != undefined && gstFile != null && gstFile.name != null) {
      console.log('Gst ' + gstFile.name + ' ' + gstFile.uri)

      fromData.append('vendor_img_url', {
        uri: gstFile.uri,
        type: 'image/jpeg',
        name: gstFile.name,
      })
    }
    console.log('fd ' + JSON.stringify(fromData))

    //   let arr = [1,2,3];

    console.log(
      'UserID' +
        actualUser.user_id +
        ' VendorID' +
        presentDetails.vendor_id +
        ' AddressID' +
        presentDetails.addresses[0].addr_id,
    )

    Axios.post(
      Config.api_url +
        'php?' +
        qs.stringify({
          action: 'updateVendor',
          update_data: 'profile',
          user_id: actualUser.user_id,
          vendor_id: presentDetails.vendor_id,
          company_name: name,
          vendor_gstin: gst,
          company_email_id: email,
          //milk_product_ids: presentDetails.milk_product_ids,
          //  lat: 1,
          //  lng: 1,
          address_id: presentDetails.addresses[0].addr_id,
          address: address.address,
          landmark: address.landmark,
          pincode: address.pincode,
          lat: address.lat,
          lng: address.lng, // Have to send this
          //     pincode: address.pincode,
          //    label: address.label,
          //     address: address.address,
          //     vendor_type: services
        }),
      fromData,
    ).then(
      (response) => {
        try {
          console.log('response: ' + response.data.vendorID)
          alert('Details updated successfully')
          route.params.refresh()
          navigation.goBack()
        } catch (e) {}
      },
      (error) => {
        console.log('Error in posts: ' + error)
      },
    )
  }

  const fileselect = (filename) => {
    try {
    } catch (e) {}
  }

  return (
    <View style={{ ...StyleSheet.absoluteFill, backgroundColor: 'white' }}>
      <AppBar
        back
        funct={() => {
          navigation.pop()
        }}
      />
      <Text style={{ ...Styles.heading, alignSelf: 'center' }}>
        Tell us about your business
      </Text>
      <View
        style={{ marginTop: dimen.height / 20, height: dimen.height * 0.77 }}
      >
        <ScrollView>
          <TextBox
            defaultValue={presentDetails.company_name}
            title="NAME OF YOUR COMPANY"
            hint="Enter your company's name"
            changeText={companyName}
          />
          <TextBox
            defaultValue={presentDetails.company_email_id}
            title="COMPANY EMAIL ADDRESS"
            hint="Enter company's E-mail address"
            changeText={companyEmail}
          />
          <TextBox
            defaultValue={presentDetails.gstin}
            title="COMPANY GST NUMBER"
            hint="Enter company's GST number"
            changeText={companyGstNumber}
          />
          <UploadButton
            title="CHANGE GST CERTIFICATE"
            browseresult={fileselect}
            fileSetter={setGSTFile}
          />
          <UploadButton
            title="CHANGE ADDRESS"
            buttonTitle="Map"
            setAddress={setAddress}
            actualUser={actualUser}
          />
          <UploadButton
            title="CHANGE AADHAR/VERIFICATION"
            browseresult={fileselect}
            fileSetter={setAadharFile}
          />
        </ScrollView>
      </View>
      <SubmitButton
        onTouch={() => {
          if (
            name.toString().trim() === '' ||
            email.toString().trim() === '' ||
            gst.toString().trim() === ''
          )
            alert('Please fill all the fields and try again')
          else if (aadharFile === null || gstFile === null)
            alert('Please upload appropriate documents and try again')
          else if (address === null)
            alert('Please choose your address and try again')
          else if (!validateEmail())
            alert('You have entered an invalid Email Address!')
          else if (gst.length != 15 || /[^a-zA-Z0-9]/.test(gst))
            alert('Please enter a valid 15 digit gst number')
          else {
            updateDetails()
          }
        }}
        text="Update Details"
      />
    </View>
  )
}

const UploadButton = ({
  hint,
  title,
  browseresult,
  fileSetter,
  actualUser,
  buttonTitle = 'Browse',
  setAddress,
  address,
}) => {
  // console.log(actualUser)
  const [filename, setFileName] = useState('Please select a file')
  const [uri, setUri] = useState(null)
  //      const [vendorAddress,setVendorAddress] = useState('')
  var navigation
  try {
    navigation = useNavigation()
  } catch (e) {}

  useEffect(() => {
    if (buttonTitle == 'Map') setFileName('Please choose address')
  }, [])

  const browse = async () => {
    if (buttonTitle == 'Map') {
      try {
        //console.log('Map')
        navigation.navigate('AddAddress', {
          type: 'vendorRegistration',
          callback: setAddress,
          actualUser: actualUser,
          addrNameSetter: setFileName,
          initialCamera: {
            center: {
              latitude: 13.062314,
              longitude: 77.591136,
            },
            pitch: 0,
            heading: 0,
            zoom: 14,
          },
        })
      } catch (e) {
        console.log('map ' + e)
      }
      return
    }

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      })
      setUri(res.uri)
      setFileName(res.name)
      // console.log(res);
      if (res.size / 1000 > 50) {
        Alert.alert('Size of the file should be lesser than 50kb')
        setFileName('Please select a file')
      }
      console.log('size' + res.size)
      fileSetter(res)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Please select a valid file')
      }
    }
  }

  return (
    <View style={{ width: '90%', marginHorizontal: dimen.width * 0.05 }}>
      <Text
        style={{
          ...Styles.subheading,
          marginTop: dimen.height / 50,
          color: 'black',
          fontSize: 15,
          fontWeight: 'bold',
        }}
      >
        {title}
      </Text>
      <View
        style={{
          ...Styles.horizontalRow,
          marginTop: dimen.height / 80,
          alignSelf: 'flex-start',
          marginLeft: 0,
          alignContent: 'space-between',
          width: '100%',
        }}
      >
        <Text style={{ width: '70%' }}>{filename}</Text>
        <Button text={buttonTitle} onTouch={browse} />
      </View>
    </View>
  )
}
