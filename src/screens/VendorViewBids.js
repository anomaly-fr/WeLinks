import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Colors, TextSpinnerBoxStyles, dimen, Styles, Config,monthNames } from '../Constants';
import GenericSeperator from '../components/ui_components/GenericSeperator';
import { Ionicons } from '@expo/vector-icons';
import AppBar from '../components/ui_components/AppBar';
import { Feather } from '@expo/vector-icons';
import SubmitButton from '../components/SubmitButton'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import Axios from 'axios';
import qs from 'qs';

import { MaterialCommunityIcons } from '@expo/vector-icons';

let openBidArray = [];
let bidsSubmitted = [];
let bidsWon = [];

export default function VendorViewBids({ navigation,route }) {

    const words = {
        openBids: 'Open Bids',
        bidsSubmitted: 'Bids Submitted',
        bidsWon: 'Bids Won'

    }
    const [tab, setTab] = useState(1);
    const [extraData, setOpenBids] = useState(1);
    const [extraData1, setAppliedBids] = useState(1);
    const [extraData2, setWonBids] = useState(1);
    const [cardWidth, setCardWidth] = useState(0);

    const [openEmtpy,isOE] = useState(false);
    const [submittedEmtpy,isSE] = useState(false);
    const [wonEmtpy,isWE] = useState(false);
    const {vendorID,actualUser} = route.params;
    
   
    const sortDate = (date) => {
        console.log("Wrong date " +date)
        let d = date.split('-');
        let m = monthNames[Number(d[1] >= 10 ? d[1] : d[1]%10)];
        console.log(`${d[2]}-${m}-${d[0]}}`)
        return `${d[2]}-${m}-${d[0]}`
       
        
    }

    
    const getBids = async () => {
        Axios.get(Config.api_url + 'php?action=getOpenBids&' + qs.stringify({
            vendor_id: vendorID,
            user_id: actualUser.user_id
        })).then((response) => {
            try {
                console.log("Response " + response.data)
                openBidArray = response.data;
                if(openBidArray.length == 0){
                    isOE(true)
                    
                }
                //  console.log("Array "+ openBidArray[0].bid_title)
                setOpenBids(Math.random(0.5));
                Axios.get(Config.api_url + 'php?action=getAppliedBids&' + qs.stringify({
                    vendor_id: vendorID
                })).then((response) => {
                    try {
                        console.log('Applied bids  ', response.data);
                        bidsSubmitted = response.data;
                        if(bidsSubmitted.length == 0){
                            isSE(true);
                        }
                        setAppliedBids(Math.random(0.5));
                        Axios.get(Config.api_url + 'php?action=getAwardedBids&' + qs.stringify({
                           vendor_id: vendorID
                        })).then((res) => {
                            try {
                                console.log('Awarded Bids  ', res.data);
                                bidsWon = res.data;
                                if(bidsWon.length == 0){
                                    isWE(true);
                                }
                                setWonBids(Math.random(0.5));
                
                            }
                            catch (error) {
                                console.log('Bids Awarded Error', error);
                               
                            }
                        }, (error) => {
                            console.log('Bids Awarded Error 1', error);
                            
                        })


                    }
                    catch (error) {
                        console.log('Applied bids error', error);
                  
                    }
                }, (error) => {
                    console.log('Applied bids error 1', error);
                   
                })

            }
            catch (error) {
                console.log('Error getting bids', error);
            }
        }, (error) => {
            console.log('Bids error', error);
        })

    }

    useEffect(() => {
        console.log('refresh');
        getBids();

    }, [tab]);

    const renderTabs = () => {
        //Renders Open, Submitted and Won bids

        return (<View style={styles.tabs}>
            <TouchableWithoutFeedback onPress={() => {
                setTab(1);
            }} style={tab == 1 ? styles.tab : { ...styles.tab, backgroundColor: 'transparent' }}>
                <Text style={styles.tabWord}>{words.openBids}</Text>

            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {
                setTab(2);
            }} style={tab == 2 ? styles.tab : { ...styles.tab, backgroundColor: 'transparent' }}>
                <Text style={styles.tabWord}>{words.bidsSubmitted}</Text>

            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {
                setTab(3);
            }} style={tab == 3 ? styles.tab : { ...styles.tab, backgroundColor: 'transparent' }}>
                <Text style={styles.tabWord}>{words.bidsWon}</Text>

            </TouchableWithoutFeedback>

        </View>)

    }

    const renderCard = (cardDetails) => {
        if (tab == 1) {
            //Open Bid Card
            return (<View onLayout={(event) => {
                setCardWidth(event.nativeEvent.layout.width);
            }} style={styles.card}>

                <Text style={{ ...styles.cardTitle, fontSize: 16 }}>{cardDetails.companyName}</Text>
                <Text style={{ ...styles.cardTitle, color: 'gray', marginVertical: '5%' }}>{sortDate(cardDetails.bid_startdate) + " to "+ sortDate(cardDetails.bid_enddate)}</Text>
                <View style={{ flexDirection: 'row',padding:'0.5%',alignItems:'center',justifyContent:'center' }}>
                    <Entypo name="map" size={20} color="gray" style={{flex:1}} />
                    <Text style={{ ...styles.cardTitle, color: 'gray',flex:5 }}>{cardDetails.address}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Entypo name="phone" size={18} color={Colors.primary} />
                    <Text style={{ ...styles.cardTitle, color: Colors.primary }}>{cardDetails.contact}</Text>
                </View>
                <View style={{ ...styles.duration, paddingVertical: 0, justifyContent: 'space-between' }}>
                    <View style={{ ...styles.duration, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, justifyContent: 'flex-start', alignSelf: 'center' }}>
                        <Feather name="truck" size={24} color="black" style={{ paddingHorizontal: 5, paddingVertical: 2 }} />
                        <Text style={{ ...Styles.subbold, fontWeight: 'bold', paddingLeft: 5, alignSelf: 'center', paddingVertical: 2, paddingRight: 10 }}>{cardDetails.bidItems}</Text>
                    </View>
                    <View style={{ ...styles.duration, borderRadius: 10, borderWidth: 1, borderColor: Colors.seperatorGray, justifyContent: 'flex-start', alignSelf: 'center', padding: '1%' }}>
                        <MaterialCommunityIcons name="weight-kilogram" size={25} color="black" style={{ paddingHorizontal: 5, paddingVertical: 2, alignSelf: 'center' }} />
                        <Text style={{ ...Styles.subbold, fontWeight: 'bold', paddingLeft: 5, alignSelf: 'center', paddingVertical: 2, paddingRight: 10 }}>{cardDetails.bidItemsWeight}</Text>

                    </View>
                    <View style={{ ...styles.duration, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, justifyContent: 'flex-start', alignSelf: 'center' }}>
                        <AntDesign name="clockcircleo" size={24} color="black" style={{ paddingHorizontal: 5, paddingVertical: 2 }} />
                        <Text style={{ ...Styles.subbold, fontWeight: 'bold', paddingLeft: 5, alignSelf: 'center', paddingVertical: 2, paddingRight: 10 }}>{cardDetails.pickUpTimeSlot}</Text>
                    </View>
                </View>
            </View>)
        }
        //Applied and awarded bids Card
        return (<View onLayout={(event) => {
            setCardWidth(event.nativeEvent.layout.width);
        }} style={styles.card}>

            <Text style={{ ...styles.cardTitle, fontSize: 16 }}>{cardDetails.companyName}</Text>
            <Text style={{ ...styles.cardTitle, color: 'gray', marginVertical: '5%' }}>{sortDate(cardDetails.bid_startdate) + " to "+ sortDate(cardDetails.bid_enddate)}</Text>
            <View style={{ flexDirection: 'row',padding:'0.5%',alignItems:'center',justifyContent:'center' }}>
                <Entypo name="map" size={20} color="gray" style={{flex:1}} />
                <Text style={{ ...styles.cardTitle, color: 'gray',flex:5 }}>{cardDetails.address}</Text>


            </View>
            <View style={{ flexDirection: 'row' }}>
                <Entypo name="phone" size={18} color={Colors.primary} />
                <Text style={{ ...styles.cardTitle, color: Colors.primary }}>{cardDetails.contact}</Text>


            </View>

            <View style={{ ...styles.duration, paddingVertical: 0, justifyContent: 'space-between' }}>
                <View style={{ ...styles.duration, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, justifyContent: 'flex-start', alignSelf: 'center' }}>
                    <Feather name="truck" size={24} color="black" style={{ paddingHorizontal: 5, paddingVertical: 2 }} />
                    <Text style={{ ...Styles.subbold, fontWeight: 'bold', paddingLeft: 5, alignSelf: 'center', paddingVertical: 2, paddingRight: 10 }}>{cardDetails.bidItems}</Text>
                </View>
                <View style={{ ...styles.duration, borderRadius: 10, borderWidth: 1, borderColor: Colors.seperatorGray, justifyContent: 'flex-start', alignSelf: 'center', padding: '1%' }}>
                    <MaterialCommunityIcons name="weight-kilogram" size={25} color="black" style={{ paddingHorizontal: 5, paddingVertical: 2, alignSelf: 'center' }} />
                    <Text style={{ ...Styles.subbold, fontWeight: 'bold', paddingLeft: 5, alignSelf: 'center', paddingVertical: 2, paddingRight: 10 }}>{cardDetails.bidItemsWeight}</Text>

                </View>
                <View style={{ ...styles.duration, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, justifyContent: 'flex-start', alignSelf: 'center' }}>
                    <AntDesign name="clockcircleo" size={24} color="black" style={{ paddingHorizontal: 5, paddingVertical: 2 }} />
                    <Text style={{ ...Styles.subbold, fontWeight: 'bold', paddingLeft: 5, alignSelf: 'center', paddingVertical: 2, paddingRight: 10 }}>{cardDetails.pickUpTimeSlot}</Text>
                </View>
            </View>
            <Text style={{ ...styles.cardTitle, alignItems: 'flex-end', color: Colors.blue, marginVertical: '5%', fontSize: 16 }}>{cardDetails.status == "Closed" ? cardDetails.status : cardDetails.status}</Text>
        </View>)



    }

    const setData = () => {
        if (tab == 1)
            return openBidArray;
        if (tab == 2)
            return bidsSubmitted;
        return bidsWon;

    }
    const setExtraData = () => {
        if (tab == 1)
            return extraData;
        if (tab == 2)
            return extraData1;
        return extraData2;
    }

    return (
        //Appbar, three tabs and flatlist inside each tab managed with states
    <View>
        <AppBar title={'View Bids'} subtitle={'Click on a bid to view details'} back={true} funct={() => {
            navigation.navigate('VendorDashboard');
        }} />

        <View style={{ ...Styles.parentContainer, backgroundColor: Colors.whiteBackground }}>

            {renderTabs()}

            <View style={{ flex: 1, paddingBottom: dimen.height / 17 }}>
          {(tab == 1 && openBidArray.length == 0) || (tab == 2 && bidsSubmitted.length == 0) 
          || (tab == 3 && bidsWon.length == 0) ? (<View style ={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold',color: 'black',fontSize: 16}}>No bids to show</Text>
          </View>) : 
                <FlatList


                    data={setData()}
                    extraData={setExtraData()}
                    renderItem={({ item, index }) => {
                        console.log("FlatList")
                        let cardDetails = {
                            companyName: item.bid_title,
                            bidDuration: item.bid_startdate + " to " + item.bid_enddate,
                            bid_startdate:  item.bid_startdate,
                            bid_enddate: item.bid_enddate,
                            bidItems: item.officescrap_category_name,
                            bidItemsWeight: item.officescrap_quant_name,
                            contact: item.user_phone,
                            status: item.bid_status,
                            //  awardedTo: item.awardedTo,
                            pickUpTimeSlot: item.bid_timeslot,
                            manpower: item.manpower_need,
                            insurance: item.insurance_need,
                            vehicle: item.vehicle_need,
                            cost: item.appln_amount,
                            address: item.addr_details,
                            notes : item.bid_notes,
                            pickUpNotes : item.bid_pickup_notes,
                            bidID : item.bid_id,
                            ownerID : item.user_id,
                            applyID : item.bid_apply_id

                        }
                        const selectTab = () => {
                            if (tab == 1)
                                return 'Open'
                            if (tab == 2)
                                return 'Submitted'
                            return 'Won'
                        }
                        return (<TouchableWithoutFeedback onPress={() => {
                            navigation.navigate('VendorBidDetails', {
                                ...cardDetails,
                                tag: selectTab(),
                                actualUser : actualUser,
                                vendorID : vendorID
                            })
                        }}>
                            {renderCard(cardDetails)}
                        </TouchableWithoutFeedback>)

                    }}
                />}
                {/* <View style={{alignItems: 'center'}}>
      <SubmitButton 
      text='+ Make a new bid' 
      onTouch = {() => {navigation.navigate('BidCreation1')
       
      }}
      />
      </View>
     */}

            </View>


        </View>



    </View>)

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
        margin: '3%'

    },
    tab: {
        width: (dimen.width - dimen.width / 10) / 3,
        aspectRatio: (10 / 1.5) / 3,
        borderRadius: 15,
        backgroundColor: '#43E0B4',
        flexDirection: 'row',
        //  marginTop: '6%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'

    },
    tabWord: {
        fontWeight: 'bold',
        color: Colors.white,
        textAlign:'center'

    },
    card: {
        width: dimen.width - dimen.width / 10,

        borderRadius: 15,
        borderColor: Colors.seperatorGray,
        borderWidth: 0.5,
        padding: '2%',
        marginTop: '5%',
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

        borderColor: Colors.primary,
        flexDirection: 'row',
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
})