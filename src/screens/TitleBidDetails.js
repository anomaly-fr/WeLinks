import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Colors, dimen, Styles, Config } from '../Constants';
import GenericSeperator from '../components/ui_components/GenericSeperator';
import AppBar from '../components/ui_components/AppBar';
import Button from '../components/ui_components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Axios from 'axios';


export default function TitleBidDetails({ navigation, route }) {
    const cardDetails = route.params;
    const { tag } = route.params;
    const { item, actualUser } = route.params;
    const extraData = Math.random(0.5);
    const [appliedVendorsList, setAppliedVendorsList] = useState(route.params.appliedVendorsList);
    const [cardWidth, setCardWidth] = useState(0);

    const [title, stitle] = useState("Bid Title");
    const [address, sAddress] = useState('No.17, 23rd Cross 18th A main road, G Block, Sahakarnagar, Bangalore - 560092.')


    const fetchVendorDetails = () => {
        Axios.get(Config.api_url + 'php?action=getBids&user_id=' + actualUser.user_id)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].bid_id == item.bid_id)
                        setAppliedVendorsList(response.data[i].applied_vendors)
                }
            })
    }


    useEffect(() => {
        fetchVendorDetails();

    }, [])

    const renderHeader = () => {
        //   console.log(cardDetails)
        return (<View style={{ flex: 0 }}>
            {/* <Text style={{ ...Styles.heading, alignSelf: 'center' }}>Bid Details</Text> */}
            <View onLayout={({ nativeEvent }) => {
                setCardWidth(nativeEvent.layout.width);
            }} style={styles.bidcard}>
                <Text style={styles.title}>{cardDetails.bidTitle}</Text>
                <Text style={styles.info}>{cardDetails.address}</Text>
                <View style={styles.duration}>
                    <Text style={{ ...styles.title, color: 'gray', marginVertical: '3%', margin: 0, fontSize: 13 }}>{'Duration: ' + cardDetails.bidDuration} </Text>
                </View>
                <View style={{ ...styles.duration, paddingVertical: 0, justifyContent: 'space-between' }}>
                    <View style={{ ...styles.duration, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, justifyContent: 'flex-start', alignSelf: 'center', height: cardWidth / 7, alignItems: 'center', margin: 5 }}>
                        <Feather name="truck" size={22} color="black" style={{ paddingHorizontal: 5, paddingVertical: 2 }} />
                        <Text style={{ ...Styles.subbold, fontWeight: 'bold', paddingLeft: 5, alignSelf: 'center', paddingVertical: 2, paddingRight: 10 }}>{cardDetails.bidItems}</Text>
                    </View>
                    <View style={{ ...styles.duration, borderRadius: 10, borderWidth: 1, borderColor: Colors.seperatorGray, justifyContent: 'flex-start', alignSelf: 'center', height: cardWidth / 7, alignItems: 'center', margin: 5 }}>
                        <Text style={{ ...Styles.subbold, fontWeight: 'bold', paddingLeft: 5, alignSelf: 'center', paddingVertical: 2, paddingLeft: 10 }}>{cardDetails.bidItemsWeight}</Text>
                        <MaterialCommunityIcons name="weight-kilogram" size={22} color="black" style={{ paddingHorizontal: 5, paddingVertical: 2, alignSelf: 'center' }} />
                    </View>
                    <View style={{ ...styles.duration, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, justifyContent: 'flex-start', alignSelf: 'center', height: cardWidth / 7, alignItems: 'center', margin: 5 }}>
                        <AntDesign name="clockcircleo" size={22} color="black" style={{ paddingHorizontal: 5, paddingVertical: 2 }} />
                        <Text style={{ ...Styles.subbold, fontWeight: 'bold', paddingLeft: 5, alignSelf: 'center', paddingVertical: 2, paddingRight: 10 }}>{cardDetails.pickUpTimeSlot}</Text>
                    </View>
                </View>
                <View style={styles.duration}>
                    {cardDetails.manpower == 1 || cardDetails.insurance == 1 || cardDetails.vehicle == 1 ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 4 }}>
                        <Text numberOfLines={1} style={{ alignSelf: 'center', fontWeight: 'bold', marginTop: '4%', paddingVertical: 2, marginHorizontal: '1%' }}>Require:</Text>
                        {cardDetails.manpower == 1 ?
                            <View style={{ ...styles.requirementsButton, backgroundColor: Colors.primary, marginTop: '2%' }}>

                                <Text style={{ ...Styles.subbold, paddingHorizontal: 0.2, paddingVertical: 2, color: 'white', fontSize: 12, textAlign: 'center' }}>Manpower</Text>
                            </View> : null}
                        {cardDetails.insurance == 1 ?
                            <View style={{ ...styles.requirementsButton, backgroundColor: Colors.primary, flex: 1 }}>
                                <Text numberOfLines={1} style={{ ...Styles.subbold, paddingHorizontal: 0.2, paddingVertical: 2, color: 'white', fontSize: 12, textAlign: 'center' }}>Insurance</Text>
                            </View> : null}

                        {cardDetails.vehicle == 1 ? <View style={{ ...styles.requirementsButton, backgroundColor: Colors.primary, flex: 1 }}>
                            <Text numberOfLines={1} style={{ ...Styles.subbold, paddingHorizontal: 0.2, paddingVertical: 2, color: 'white', fontSize: 12, textAlign: 'center' }}>Vehicle</Text>
                        </View> : null}
                    </View> : null}
                </View>
                <View style={{ flex: 0 }}>
                    <Text style={{ ...styles.title }}>Additional Notes</Text>
                    <Text style={{ ...styles.title, color: 'gray', fontWeight: '100' }}>{cardDetails.notes != '' ? cardDetails.notes : 'No additional notes'}</Text>
                </View>
                <View>
                    <Text style={{ ...styles.title, marginVertical: '3%', color: cardDetails.status == 'Cancelled' ? Colors.red : Colors.blue }}>{cardDetails.status}</Text>
                </View>
            </View>
            {/* <SubmitButton text='Cancel Bid' /> */}
            {tag == 'Open' ?
                <TouchableOpacity style={{ ...styles.cancelButton, width: cardWidth, alignSelf: 'center' }} onPress={() => {
                    // alert('Are you sure you want to cancel this bid?');
                    navigation.navigate('CancellationScreen', {
                        bidTitle: cardDetails.bidTitle,
                        item: item,
                        actualUser: actualUser

                    });
                }}>
                    <Text style={styles.cancelText}>Cancel Tender</Text>
                </TouchableOpacity>
                : <View style={{ marginTop: dimen.height / 50 }} />}
            <Text style={{ ...Styles.heading, alignSelf: 'center', marginTop: dimen.mVm }}>{appliedVendorsList.length == 0 ? 'No ' : ''}Bids Received</Text>

        </View>
        )
    }

    const renderItem = ({ item }) => {
        let thisVendor = {
            name: item.company_name,
            email: item.company_email_id,
            amount: item.appln_amount,
            image: item.vendor_img_url,
            time: item.appln_timestamp,
            vendor_id: item.vendor_id,
            bid_apply_id: item.bid_apply_id,
            bid_id: item.bid_id,
            address: item.addr_details
        };
        return (
            <View style={{ ...styles.container, width: cardWidth, alignSelf: 'center' }}>
                <Image style={{ ...styles.image, aspectRatio: 1 / 1.7, alignSelf: 'flex-end', borderWidth: 1, flex: 1 }} source={{ uri: "https://dev.we-link.in/dist/img/users/" + item.vendor_img_url }} />
                <View style={{ marginStart: '4%', flex: 4, alignSelf: 'center' }}>
                    <Text style={styles.name}> {item.company_name}</Text>
                    <View style={{ flexDirection: 'row', marginTop: '2%' }}>
                        <FontAwesome5 name="money-bill-wave-alt" size={17} color={Colors.blue} style={{ alignSelf: 'center' }} />
                        <Text style={{ ...styles.name, fontSize: 14 }}> {'Offer : '}</Text>
                        <Text style={{ ...styles.name, fontSize: 14, color: Colors.blue }}> {"₹ " + item.appln_amount}</Text>
                    </View>

                </View>
                <View style={{ alignSelf: 'center', marginRight: dimen.width / 50 }}>
                    <Button text='View' onTouch={() => {
                        navigation.navigate('AwardBid', {
                            tag: cardDetails.status,
                            ...thisVendor,
                            actualUser: actualUser
                        })

                    }} />
                </View>


            </View>)
    }



    return (<View>
        <AppBar title={'Tender Details'}
            back
            funct={() => {
                navigation.pop();
            }} />

        <View style={{ ...Styles.parentContainer, backgroundColor: Colors.whiteBackground }}>

            <FlatList
                style={{ padding: '0.5%', paddingHorizontal: '1%', marginBottom: dimen.height / 17 }}
                ListHeaderComponent={renderHeader}
                data={appliedVendorsList}
                extraData={extraData}
                renderItem={renderItem}

                ItemSeparatorComponent={() => <GenericSeperator />} />
        </View>
    </View>

    )
}

const styles = StyleSheet.create({

    button: {
        flexDirection: 'column',
        width: dimen.width - 20,
        alignSelf: 'center', flex: 1,
        alignSelf: 'center',
        justifyContent: 'center'
    },
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
        paddingVertical: '2%',
        //  paddingHorizontal: 3,
        //  margin: 3,

        borderColor: Colors.primary,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between'
    },
    requirementsButton: {
        paddingVertical: '0.3%',
        paddingHorizontal: 8,
        alignSelf: 'baseline',
        borderRadius: 10,
        marginHorizontal: '1%'
    },
    cancelText: {
        ...Styles.subbold,
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center',
        fontWeight: '700'
    },
    cancelButton: {
        backgroundColor: Colors.red,
        // height: '100%',
        aspectRatio: 10 / 1.4,
        borderRadius: 5,
        alignSelf: 'center',
        marginVertical: dimen.sVm,
        width: dimen.width - dimen.width / 10,
        justifyContent: 'center'

    },
    title: {
        fontWeight: 'bold',
        color: Colors.primary,
        paddingHorizontal: '1%',
        // padding: '1%',
        fontSize: 16,
    },
    info: {
        //  padding: '1%',
        fontSize: 14,
        marginTop: '3%',
        // flex: 1,


    },
    container: {
        //  margin: '1%',
        //  marginBottom: '5%',
        flexDirection: 'row',
        marginTop: '1.5%',
        justifyContent: 'space-between',
        elevation: 1,

        padding: '1%',
        // borderWidth: 5,
        //  borderColor: 'transparent',
        borderRadius: 10,
        // borderWidth: 0.5,
        //  backgroundColor: 'black',
        marginBottom: '1%',
        backgroundColor: 'white'
        //  paddingVertical: 10

    },
    name: {
        fontWeight: 'bold',
        color: 'black'
    }
})