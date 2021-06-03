import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors, dimen, Styles, Config, monthNames } from '../Constants';
import AppBar from '../components/ui_components/AppBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import Axios from 'axios';
import qs from 'qs';


export default function VendorBidDetails({ navigation, route }) {
    const [cardDetails,setCardDetails] =useState(route.params);

    const { tag } = route.params;
    const [cardWidth,setCardWidth] = useState(0);

    console.log(cardDetails)
    console.log(tag)
    const {vendorID} = route.params

    const sortDate = (date) => {
        console.log("Wrong date " +date)
        let d = date.split('-');
        let m = monthNames[Number(d[1] >= 10 ? d[1] : d[1]%10)];
        console.log(`${d[2]}-${m}-${d[0]}}`)
        return `${d[2]}-${m}-${d[0]}`
       
        
    }

   


    const renderHeader = () => {
        console.log(cardDetails);
        const [bidAmount, setBidAmount] = useState('');
        const [editAmount,setEditAmount] = useState(cardDetails.cost);
        const [submitted, isSubmitted] = useState(false);
        const [editNow, setEditNow] = useState(false);


        console.log("Vendor " + vendorID)

        const placeBid = () => {
            console.log('Placing')
            Axios.post(Config.api_url + 'php?' + qs.stringify({
                action: 'applyBid',
                owner_id: cardDetails.ownerID,
                bid_id: cardDetails.bidID,
                vendor_id: vendorID,
                appln_amount: bidAmount
    
    
    
            })).then((value) => {
                console.log("Placed "+ JSON.stringify(value.data));
                alert(`Bid placed successfully at ${bidAmount}!`)
                setEditNow(true);
                navigation.navigate('VendorViewBids',{
                    reload: true
                });
    
            })
    
    
    
        }
        const editBid = () => {
            isSubmitted(true);
            console.log('Edit')
            Axios.post(Config.api_url + 'php?' + qs.stringify({
                action: 'editAppliedBid',
                bid_apply_id : cardDetails.applyID,
              
                bid_id: cardDetails.bidID,
                vendor_id: vendorID,       // Be careful with bid apply id and vendor
                appln_amount: editAmount
    
    
    
            })).then((value) => {
               alert(`Your bid amount has been changed to ${editAmount}!`)
               setEditAmount(editAmount);
               isSubmitted(false);
               setEditNow(false);
          
            }),(error) => {console.log(error)}
        }
       
       
        const button = () => {
            if(tag=='Open'){
            return(<TouchableOpacity style={!submitted ? { ...styles.cancelButton, backgroundColor: Colors.primary,width:cardWidth } : { ...styles.cancelButton, backgroundColor: Colors.buttonEnabledGreen, opacity: 1,width:cardWidth }}
                onPress={() => {
                  
                        if (bidAmount == "" || bidAmount == undefined || bidAmount <= 0 || bidAmount == null) {
                            alert('Please enter a valid amount to bid!');
                            isSubmitted(false);
                        } else {
                            isSubmitted(true);

                            console.log(bidAmount)
                            placeBid();
                        }
                }}>
                <Text style={!submitted ? styles.cancelText : { ...styles.cancelText, fontStyle: 'italic' }}>Bid Now</Text>
            </TouchableOpacity>)}
            else if(tag=='Submitted' && cardDetails.status != 'Cancelled')
            return(<View>
            <TouchableOpacity style={!submitted ? { ...styles.cancelButton, backgroundColor: Colors.primary,width:cardWidth } : { ...styles.cancelButton, backgroundColor: Colors.buttonEnabledGreen, opacity: 1,width:cardWidth }}
            onPress = {() => {
                !editNow ?
                setEditNow(true) : editBid();
               // editBid();
            }} >
                <Text style={!submitted ? styles.cancelText : { ...styles.cancelText, fontStyle: 'italic' }}>{!editNow ? 'Edit Now' : 'Submit Changes'}</Text>
            </TouchableOpacity>
            </View>)
            else return null;
        }

            {/* {editNow ? <TouchableOpacity style={{ ...styles.cancelButton, backgroundColor: Colors.primary }}
            onPress = {() => {
                
             //  editBid();
            }} >
                <Text style={styles.cancelText}>Submit Changes</Text>
            </TouchableOpacity> : null } */}
            return (<View style={{ flex: 0 }}>
                <View onLayout={({nativeEvent}) => {
                    setCardWidth(nativeEvent.layout.width);
                }} style={styles.bidcard}>
                    <Text style={styles.title}>{cardDetails.companyName}</Text>
                    <View style={{ ...styles.duration, flexDirection: 'column' }}>
                        <Text style={{ ...styles.title, color: 'gray', marginVertical: '3%' }}> {sortDate(cardDetails.bid_startdate) + " to " + sortDate(cardDetails.bid_enddate)} </Text>
                        <Text style={{ ...styles.title, color: 'gray', marginVertical: '3%' }}>{cardDetails.address}</Text>
                    </View>
                    {tag == 'Won' ? <View style={{ flexDirection: 'row' }}>
                        <FontAwesome5 name="money-bill-wave-alt" size={17} color="#E0BA3F" style={{ alignSelf: 'center' }} />
                        <Text style={{ ...styles.cardTitle, color: "#E0BA3F", fontWeight: 'bold', margin: '2%' }}>{" Winning Amount : ₹" + cardDetails.cost}</Text>
    
    
                    </View> : null}
                    <View style={{ flexDirection: 'row' }}>
                        <Entypo name="phone" size={17} color={Colors.primary} style={{ alignSelf: 'center' }} />
                        <Text style={{ ...styles.cardTitle, color: Colors.primary, fontWeight: 'bold' }}>{cardDetails.contact}</Text>
                    </View>
                    <View style={{ ...styles.duration, paddingVertical: 0, justifyContent: 'space-between' }}>
                        <View style={{ ...styles.duration, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, justifyContent: 'flex-start', alignSelf: 'center',height:cardWidth/7,alignItems:'center' }}>
                            <Feather name="truck" size={24} color="black" style={{ paddingHorizontal: 5, paddingVertical: 2 }} />
                            <Text style={{ ...Styles.subbold, fontWeight: 'bold', paddingLeft: 5, alignSelf: 'center', paddingVertical: 2, paddingRight: 10 }}>{cardDetails.bidItems}</Text>
                        </View>
                        <View style={{ ...styles.duration, borderRadius: 10, borderWidth: 1, borderColor: Colors.seperatorGray, justifyContent: 'flex-start', alignSelf: 'center',height:cardWidth/7 ,alignItems:'center'}}>
                            <Text style={{ ...Styles.subbold, fontWeight: 'bold', paddingLeft: 5, alignSelf: 'center', paddingVertical: 2, paddingLeft: 10 }}>{cardDetails.bidItemsWeight}</Text>
                            <MaterialCommunityIcons name="weight-kilogram" size={25} color="black" style={{ paddingHorizontal: 5, paddingVertical: 2, alignSelf: 'center' }} />
                        </View>
                        <View style={{ ...styles.duration, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, justifyContent: 'flex-start', alignSelf: 'center',height:cardWidth/7,alignItems:'center' }}>
                            <AntDesign name="clockcircleo" size={24} color="black" style={{ paddingHorizontal: 5, paddingVertical: 2 }} />
                            <Text style={{ ...Styles.subbold, fontWeight: 'bold', paddingLeft: 5, alignSelf: 'center', paddingVertical: 2, paddingRight: 10 }}>{cardDetails.pickUpTimeSlot}</Text>
                        </View>
                    </View>
                    <View style={styles.duration}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ alignSelf: 'center', fontWeight: 'bold', marginTop: '4%', paddingVertical: 2 }}>Require: </Text>
    
                            {cardDetails.manpower == 1 ? <View style={{ ...styles.requirementsButton, backgroundColor: Colors.primary, marginTop: '2%' }}>
    
                                <Text style={{ ...Styles.subbold, paddingHorizontal: 0.2, paddingVertical: 2, color: 'white',fontSize:12,textAlign:'center' }}>Manpower</Text>
                            </View> : null}
    
                            {cardDetails.insurance == 1 ? <View style={{ ...styles.requirementsButton, backgroundColor: Colors.primary }}>
                                <Text style={{ ...Styles.subbold, paddingHorizontal: 0.2, paddingVertical: 2, color: 'white' ,fontSize:12,textAlign:'center'}}>Insurance</Text>
                            </View> : null}
    
                            {cardDetails.vehicle == 1 ? <View style={{ ...styles.requirementsButton, backgroundColor: Colors.primary }}>
                                <Text style={{ ...Styles.subbold, paddingHorizontal: 0.2, paddingVertical: 2, color: 'white',fontSize:12,textAlign:'center' }}>Vehicle</Text>
                            </View> : null}
                        </View>
                    </View>
                    <View style={{ flex: 0 }}>
                        <Text style={{ ...styles.title }}>Additional Notes</Text>
                        <Text style={{ ...styles.info }}>{cardDetails.notes}</Text>
                    </View>
                    {tag != 'Won' ? <View>
                        <TextInput value={tag == 'Open' ? bidAmount : editAmount} editable={tag == 'Open' || editNow ? true : false} onChangeText={amount =>{
                            tag == 'Open' ? setBidAmount(amount) : setEditAmount(amount) 
                            }} keyboardType="number-pad" placeholder="Enter your bid amount"
                            style={{ borderRadius: 10, marginTop: '2%', borderWidth: 0.5, borderColor: 'gray' }} />
                    </View> : null}
                   
    
                </View>
                {button()}
                {/* <SubmitButton text='Cancel Bid' /> */}
              
    
            </View>
            )
        }
        return (<View>
            <AppBar
            title={'Bid Details'}
                back
                funct={() => {
           navigation.goBack();
    
                }} />
    
            <View style={{ ...Styles.parentContainer, backgroundColor: Colors.whiteBackground }}>
    
                <FlatList
                    ListHeaderComponent={renderHeader}
                    data={[1, 2, 3, 4, 5, 6, 7, 8]}
                    // renderItem={renderItem}
                    ItemSeparatorComponent={() => <View />} 
                    />
            </View>
        </View>
    
        )
      
    }

   



 


const styles = StyleSheet.create({
    bidcard: {
        width: dimen.width - dimen.width / 10,
        // height: dimen.height/3.8,
        borderRadius: 15,
        borderColor: Colors.seperatorGray,
        borderWidth: 0.5,
        padding: '2%',
        marginTop: '5%',
        alignSelf: 'center',
        backgroundColor: 'white',
        elevation: 1
    },
    duration: {
        paddingVertical: 5,
        paddingHorizontal: 3,
        margin: 3,
        flex:1,
        borderColor: Colors.primary,
        flexDirection: 'row'
    },
    requirementsButton: {
        paddingVertical: '0.5%',
        paddingHorizontal: 10,
        alignSelf: 'baseline',
        borderRadius: 10,
        marginHorizontal: '1%'
    },
    cancelText: {
        ...Styles.subbold,
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center',
        fontWeight: '700',
        padding: 15
    },
    cancelButton: {
        backgroundColor: Colors.red,
        // height: '100%',
        width: '97%',
        aspectRatio: 10 / 1.4,
        borderRadius: 5,
        alignSelf: 'center',
        marginVertical: '5%'

    },
    title: {
        fontWeight: 'bold',
        color: Colors.primary,
        padding: '1%',
        fontSize: 16,
    },
    info: {
        padding: '1%',
        fontSize: 14,
        marginTop: '3%',
        flex: 1,


    }
})