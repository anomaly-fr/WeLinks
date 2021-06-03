import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { Colors, dimen, Styles, Config, monthNames } from '../Constants'

import AppBar from '../components/ui_components/AppBar'
import { Feather } from '@expo/vector-icons'
import SubmitButton from '../components/SubmitButton'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import Axios from 'axios'

let appliedVendorsList = []
let dataOpen = []

let dataCloseOrCancel = []

export default function Bids({ navigation, route }) {
  const words = {
    openBids: 'Open Tenders',
    closedBids: 'Closed Tenders',
  }
  const [tab, setTab] = useState(1)
  const [cardWidth, setCardWidth] = useState(0)
  const [remount, setRemount] = useState(5)
  const [actualUser, setActualUser] = useState(route.params.actualUser)

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      populateData()
    })
    console.log('USER ' + actualUser.user_id)
    // populateData()
  }, [])

  const sortDate = (date) => {
    console.log('Wrong date ' + date)
    let d = date.split('-')
    let m = monthNames[Number(d[1] >= 10 ? d[1] : d[1] % 10)]
    console.log(`${d[2]}-${m}-${d[0]}}`)
    return `${d[2]}-${m}-${d[0]}`
  }

  const populateData = () => {
    //const quanData = await Axios.get(Config.api_url+'php?action=getCorporateScrapQuantities');
    dataOpen = []
    dataCloseOrCancel = []
    Axios.get(
      Config.api_url + 'php?action=getBids&user_id=' + actualUser.user_id,
    ).then(
      (response) => {
        var responseArray = response.data
        console.log('list ' + JSON.stringify(responseArray))
        try {
          responseArray.forEach((p) => {
            //     console.log('ppp',p);
            if (p.bid_status == 'Open') dataOpen.push(p)
            else dataCloseOrCancel.push(p)
          })
          setRemount(Math.random(0.5))
        } catch (error) {
          console.log('To err is human', error)
        }
      },
      (error) => {
        console.log('error')
      },
    )
  }

  const renderCardItem = ({ item }) => {
    var awardedVendor = null
    item.applied_vendors.forEach((i) => {
      if (i.awarded_status == 1) awardedVendor = i
    })
    //var item = dataOpen[0];
    let cardDetails = {
      bidTitle: item.bid_title,
      bidDuration:
        sortDate(item.bid_startdate) + ' to ' + sortDate(item.bid_enddate),
      bidItems: item.officescrap_category_name,
      bidItemsWeight: item.officescrap_quant_name,
      bidders: item.applied_vendors.length,
      status: item.bid_status,
      awardedTo:
        tab == 1
          ? 'not awarderd'
          : awardedVendor != null
          ? awardedVendor.company_name
          : 'Not awarded yet',
      pickUpTimeSlot: item.bid_timeslot,
      manpower: item.manpower_need,
      insurance: item.insurance_need,
      vehicle: item.vehicle_need,
      address: item.addr_details,
      notes: item.bid_notes,
      appliedVendors: item.applied_vendors,
    }

    var itema = null
    let thisVendor = null
    if (item.bid_status != 'Open') {
      itema = item.applied_vendors[0]
      if (itema != null && itema != undefined)
        thisVendor = {
          name: itema.company_name,
          email: itema.company_email_id,
          amount: itema.appln_amount,
          image: itema.vendor_img_url,
          time: itema.appln_timestamp,
          vendor_id: itema.vendor_id,
          bid_apply_id: itema.bid_apply_id,
          bid_id: itema.bid_id,
        }
    }
    appliedVendorsList = item.applied_vendors
    console.log('Applied ' + appliedVendorsList)
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          console.log('APPLIED ' + JSON.stringify(appliedVendorsList))
          if (tab != 1 && cardDetails.status != 'Cancelled') {
            console.log('Go')
            navigation.navigate('CorporateMarkPickupScreen', {
              ...item,
              actualUser: actualUser,
              ...cardDetails,
              ...thisVendor,
            })
          } else {
            console.log('go')
            navigation.navigate('TitleBidDetails', {
              ...cardDetails,
              appliedVendorsList,
              tag: tab == 1 ? 'Open' : 'Closed',
              item: { ...item },
              actualUser: actualUser,
            })
          }
        }}
      >
        {renderCard(cardDetails)}
      </TouchableWithoutFeedback>
    )
  }

  const renderTabs = () => {
    return (
      <View style={styles.tabs}>
        <TouchableWithoutFeedback
          onPress={() => {
            setTab(1)
          }}
          style={
            tab == 1
              ? styles.tab
              : { ...styles.tab, backgroundColor: 'transparent' }
          }
        >
          <Text style={styles.tabWord}>{words.openBids}</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            setTab(2)
          }}
          style={
            tab == 2
              ? styles.tab
              : { ...styles.tab, backgroundColor: 'transparent' }
          }
        >
          <Text style={styles.tabWord}>{words.closedBids}</Text>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  const renderCard = (cardDetails) => {
    if (tab == 1) {
      return (
        <View
          onLayout={(event) => {
            setCardWidth(event.nativeEvent.layout.width)
          }}
          style={styles.card}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={{ ...styles.cardTitle, fontSize: 16, flex: 5 }}>
              {cardDetails.bidTitle}
            </Text>

            <Text
              style={{
                ...styles.cardTitle,
                alignItems: 'flex-end',
                color: Colors.blue,
                fontSize: 16,
                flex: 1,
              }}
            >
              Open
            </Text>
          </View>

          <Text
            style={{ ...styles.cardTitle, color: 'gray', marginVertical: '5%' }}
          >
            {cardDetails.bidDuration}
          </Text>

          <View
            style={{
              ...styles.duration,
              paddingVertical: 0,
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                ...styles.duration,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: Colors.primary,
                justifyContent: 'flex-start',
                alignSelf: 'center',
                height: cardWidth / 7,
                alignItems: 'center',
              }}
            >
              <Feather
                name="truck"
                size={22}
                color="black"
                style={{ paddingHorizontal: 5, paddingVertical: 2 }}
              />
              <Text
                style={{
                  ...Styles.subbold,
                  fontWeight: 'bold',
                  paddingLeft: 5,
                  alignSelf: 'center',
                  paddingVertical: 2,
                  paddingRight: 10,
                }}
              >
                {cardDetails.bidItems}
              </Text>
            </View>

            <View
              style={{
                ...styles.duration,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: Colors.seperatorGray,
                justifyContent: 'flex-start',
                alignSelf: 'center',
                padding: '1%',
                height: cardWidth / 7,
                alignItems: 'center',
              }}
            >
              <MaterialCommunityIcons
                name="weight-kilogram"
                size={22}
                color="black"
                style={{
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                  alignSelf: 'center',
                }}
              />
              <Text
                style={{
                  ...Styles.subbold,
                  fontWeight: 'bold',
                  paddingLeft: 5,
                  alignSelf: 'center',
                  paddingVertical: 2,
                  paddingRight: 10,
                }}
              >
                {cardDetails.bidItemsWeight}
              </Text>
            </View>

            <View
              style={{
                ...styles.duration,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: Colors.primary,
                justifyContent: 'flex-start',
                alignSelf: 'center',
                flex: 1,
                height: cardWidth / 7,
                alignItems: 'center',
              }}
            >
              <AntDesign
                name="clockcircleo"
                size={22}
                color="black"
                style={{ paddingHorizontal: 5, paddingVertical: 2 }}
              />
              <Text
                style={{
                  ...Styles.subbold,
                  fontWeight: 'bold',
                  paddingLeft: 5,
                  alignSelf: 'center',
                  paddingVertical: 2,
                  paddingRight: 10,
                }}
              >
                {cardDetails.pickUpTimeSlot}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: '6%' }}>
            <AntDesign
              name="tago"
              size={15}
              color={Colors.primary}
              style={{ alignSelf: 'center' }}
            />
            <Text
              numberOfLines={1}
              style={{
                ...styles.cardTitle,
                flex: 1,
                marginStart: '1%',
                marginVertical: '2%',
              }}
            >{`Number of bids: ${appliedVendorsList.length}`}</Text>
            <AntDesign
              style={{ alignSelf: 'flex-end', margin: '2%' }}
              name="right"
              size={18}
              color={Colors.primary}
            />
          </View>
        </View>
      )
    }
    return (
      <View
        onLayout={(event) => {
          setCardWidth(event.nativeEvent.layout.width)
        }}
        style={styles.card}
      >
        <View
          style={{
            flexDirection: 'row',
            width: dimen.width - dimen.width / 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Text style={{ ...styles.cardTitle, fontSize: 16 }}>
              {cardDetails.bidTitle}
            </Text>
            <Text
              style={{
                ...styles.cardTitle,
                marginEnd: '6%',
                alignItems: 'flex-end',
                color:
                  cardDetails.status == 'Cancelled' ? Colors.red : Colors.blue,
                fontSize: 16,
              }}
            >
              {cardDetails.status == 'Cancelled'
                ? cardDetails.status
                : cardDetails.status}
            </Text>
          </View>

          <View
            style={{ flexDirection: 'row', flex: 1, marginStart: '20%' }}
          ></View>
        </View>
        <Text
          style={{ ...styles.cardTitle, color: 'gray', marginVertical: '5%' }}
        >
          {cardDetails.bidDuration}
        </Text>

        <View
          style={{
            ...styles.duration,
            paddingVertical: 0,
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              ...styles.duration,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: Colors.primary,
              justifyContent: 'flex-start',
              alignSelf: 'center',
              height: cardWidth / 7,
              alignItems: 'center',
            }}
          >
            <Feather
              name="truck"
              size={22}
              color="black"
              style={{ paddingHorizontal: 5, paddingVertical: 2 }}
            />
            <Text
              style={{
                ...Styles.subbold,
                fontWeight: 'bold',
                paddingLeft: 5,
                alignSelf: 'center',
                paddingVertical: 2,
                paddingRight: 10,
              }}
            >
              {cardDetails.bidItems}
            </Text>
          </View>
          <View
            style={{
              ...styles.duration,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: Colors.seperatorGray,
              justifyContent: 'flex-start',
              alignSelf: 'center',
              padding: '1%',
              height: cardWidth / 7,
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons
              name="weight-kilogram"
              size={22}
              color="black"
              style={{
                paddingHorizontal: 5,
                paddingVertical: 2,
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                ...Styles.subbold,
                fontWeight: 'bold',
                paddingLeft: 5,
                alignSelf: 'center',
                paddingVertical: 2,
                paddingRight: 10,
              }}
            >
              {cardDetails.bidItemsWeight}
            </Text>
          </View>
          <View
            style={{
              ...styles.duration,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: Colors.primary,
              justifyContent: 'flex-start',
              alignSelf: 'center',
              height: cardWidth / 7,
              alignItems: 'center',
            }}
          >
            <AntDesign
              name="clockcircleo"
              size={22}
              color="black"
              style={{ paddingHorizontal: 5, paddingVertical: 2 }}
            />
            <Text
              style={{
                ...Styles.subbold,
                fontWeight: 'bold',
                paddingLeft: 5,
                alignSelf: 'center',
                paddingVertical: 2,
                paddingRight: 10,
              }}
            >
              {cardDetails.pickUpTimeSlot}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}></View>
        <AntDesign
          style={{
            alignSelf: 'flex-end',
            marginHorizontal: '3%',
            marginBottom: '1%',
          }}
          name="right"
          size={18}
          color={Colors.primary}
        />
      </View>
    )
  }

  return (
    <View>
      <AppBar
        title={'My Tenders'}
        subtitle={'Click on any tender to view details'}
        back
        funct={() => {
          navigation.navigate('Homescreen')
        }}
      />

      <View
        style={{
          ...Styles.parentContainer,
          backgroundColor: Colors.whiteBackground,
        }}
      >
        {renderTabs()}

        <View style={{ flex: 1, paddingBottom: dimen.height / 17 }}>
          <FlatList
            style={{ marginBottom: '5%' }}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={
              (tab == 1 && dataOpen.length == 0) ||
              (tab == 2 && dataCloseOrCancel == 0) ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: dimen.height / 2,
                  }}
                >
                  <Text style={{ fontWeight: 'bold', color: 'black' }}>
                    No bids to show
                  </Text>
                </View>
              ) : null
            }
            data={tab == 1 ? dataOpen.reverse() : dataCloseOrCancel.reverse()}
            extraData={remount}
            renderItem={renderCardItem}
          />
          <View style={{ alignItems: 'center' }}>
            <SubmitButton
              text="+ New Tender"
              onTouch={() => {
                navigation.navigate('BidCreation1', {
                  ...route.params,
                })
              }}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  tabs: {
    width: dimen.width - dimen.width / 10,
    aspectRatio: 10 / 1.5,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    marginTop: '5%',
    alignSelf: 'center',
    margin: '3%',
  },
  tab: {
    width: (dimen.width - dimen.width / 10) / 2,
    aspectRatio: 10 / 1.5 / 2,
    borderRadius: 15,
    backgroundColor: '#00dece',
    flexDirection: 'row',
    //  marginTop: '6%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabWord: {
    fontWeight: 'bold',
    color: Colors.white,
  },
  card: {
    width: dimen.width - dimen.width / 10,

    borderRadius: 15,
    borderColor: Colors.seperatorGray,
    borderWidth: 0.5,
    padding: '2%',
    marginTop: dimen.sVm,
    alignSelf: 'center',
    backgroundColor: 'white',
    elevation: 1,
    // marginBottom:'1%'
  },
  cardTitle: {
    fontWeight: 'bold',
    color: Colors.primary,
    padding: '1%',
    fontSize: 14,
  },
  duration: {
    paddingVertical: 5,
    paddingHorizontal: 3,
    margin: 3,
    flex: 1,

    borderColor: Colors.primary,
    flexDirection: 'row',
  },
})
