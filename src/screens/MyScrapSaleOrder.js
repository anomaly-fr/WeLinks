import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { Styles, dimen, Colors, notification_identifiers } from '../Constants';
import AppBar from '../components/ui_components/AppBar';
import { AntDesign } from '@expo/vector-icons'
import SubmitButton from '../components/SubmitButton';
import Axios from 'axios';
import qs from 'qs';
import { Config } from '../Constants';
import SpinnerBox from '../components/ui_components/Spinner';
import LottieView from 'lottie-react-native';
import sendNotif from '../Utility/sendNotificationTo';
import Appliance from '../components/Appliance';


var cancellationReasons = [{
    label: 'Don\'t want pick up for now',
    value: 'Don\'t want pick up for now'
}, { label: 'Vendor did not show up', value: 'Vendor did not show up' }, { label: 'Not happy with the price vendor is offering', value: 'Not happy with the price vendor is offering' },
{
    label: 'Not happy with vendor interaction',
    value: 'Not happy with vendor interaction',
},
{
    label: 'Others',
    value: 'Others'
}];

export default function MyScrapSaleOrder({ navigation, route }) {
    const { actualUser, item } = route.params;
    const { cart } = route.params.item;
    const [expanded, setExpanded] = useState(false);
    const [cancelClicked, setCancelClicked] = useState(0);
    const [other, setOther] = useState(false);
    const [reason, setReason] = useState(cancellationReasons[0].value);
    const [notes, setNotes] = useState(' ');
    const [loadingState, setLoading] = useState(false);
    //   console.log("ITEM"+JSON.stringify(item));


    const cancelButtonClicked = () => {
        if (cancelClicked === 0)
            setCancelClicked(1);
        if (cancelClicked === 1) {
            // setLoading(true);
            if (reason === 'Others')
                if (notes.trim().length != 0)
                    Axios.post(Config.api_url + 'php?' + qs.stringify({
                        action: 'userHomeScrapCancelOrder',
                        order_id: item.all.scrap_order_id,
                        pickup_notes_by_user: notes
                    })).then((response) => {
                        console.log(response.data);
                        alert("Your order has been cancelled successfully");
                        navigation.goBack();
                        setLoading(false);
                        sendNotif('Order Cancelled', item.all.user_name + " has cancelled the scrap order", 'vendor' + item.all.vendor_id, notification_identifiers.vendor_scrap_orders);
                    }, (error) => {
                        console.log(error);
                        alert('A network error occured, please try again later');
                        setLoading(false);
                    });
                else
                    alert("Please enter a valid reason for cancellation");
            else
                Axios.post(Config.api_url + 'php?' + qs.stringify({
                    action: 'userHomeScrapCancelOrder',
                    order_id: item.all.scrap_order_id,

                    pickup_notes_by_user: reason
                })).then((response) => {
                    console.log(response.data);
                    alert("Your order has been cancelled successfully");
                    navigation.goBack();
                    sendNotif('Order Cancelled', item.all.user_name + " has cancelled the scrap order", 'vendor' + item.all.vendor_id, notification_identifiers.vendor_scrap_orders);
                  
                    setLoading(false);
                }, (error) => {
                    console.log(error);
                    alert('A network error occured, please try again later');
                    setLoading(false);

                });



        }
    }

    const renderLoading = () => {
        if (loadingState === false)
            return null;

        return (
            <View style={{ opacity: 0.8, position: 'absolute', zIndex: 100, top: 0, bottom: 0, left: 0, right: 0 }}>
                <LottieView
                    enableMergePathsAndroidForKitKatAndAbove
                    style={{ flex: 1, padding: 50, margin: 50 }} source={require('../../assets/animations/logistics.json')} resizeMode={'contain'} autoPlay={true} loop={true} />
            </View>
        )
    }


    const renderReasons = () => {

        if (cancelClicked === 1)
            return (
                <View style={styles.cancellationContainer}>
                    <SpinnerBox
                        title="Please select a reason for cancellation"
                        data={cancellationReasons}
                        changeOption={setReason}
                    />
                    {reason === "Others" ?
                        (<View>
                            <Text style={{ marginTop: dimen.height / 30, alignSelf: 'center', marginHorizontal: dimen.width * 0.05, flex: 0, fontWeight: 'bold', color: 'black', alignItems: 'center' }}>Please enter the reason for cancellation</Text>
                            <TextInput
                                placeholder={`Reason for cancellation/other information`}
                                onChangeText={setNotes}
                                textAlignVertical={'top'}
                                multiline={true}
                                line
                                numberOfLines={10}
                                style={{ fontSize: 15, color: 'black', padding: 15, margin: 30, flex: 0, borderColor: Colors.seperatorGray, borderWidth: 1, borderRadius: 5, maxHeight: dimen.height / 3 }} />
                        </View>) :
                        null

                    }




                </View>
            )

        return <View />
    }

    return (

        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {renderLoading()}
            <AppBar
                title={item.name}
                back funct={() => { navigation.pop() }} />

            <ScrollView style={{ flex: 1 }}>
                <View style={{ marginTop: dimen.height / 16, flex: 16 }}>
                    <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10 }} activeOpacity={0.8} onPress={() => setExpanded(!expanded)} >
                        {route.params.card}
                    </TouchableOpacity>
                    <View style={expanded ? styles.collapsedAccordion : styles.collapsedAccordion}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(!expanded)}  >
                            <View style={expanded ? { ...styles.expandableRow, paddingBottom: 20 } : styles.expandableRow}>
                                <Text style={{ ...Styles.subbold, fontWeight: 'bold',marginLeft: dimen.sHm  }}>Items</Text>
                                <AntDesign color='black' size={17} style={{color: 'black',fontStyle: 'bold',marginHorizontal:'2%'}} name={expanded ? "up" : "down"} />
                            </View>
                        </TouchableOpacity>
                        {expanded ? <FlatList
                            data={cart}
                            //stickyHeaderIndices={[0]}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ backgroundColor: 'white' }}
                            renderItem={({ item, index }) => {
                                return (
                                    <Appliance
                                        small={true}
                                        schedule={true}
                                        remove={true}
                                        item={item}
                                        index={index}
                                        onAdd={(num) => {


                                            cart.push({
                                                ...item,
                                                itemQuantity: num
                                            });



                                            console.log("cart" + cart)



                                        }}

                                        initquan={item.cart_quantity}
                                        name={item.homescrap_name} quantity={item.quantity} price={item.homescrap_price} price_={item.price_} image={item.homescrap_image_url}
                                        subscribe={() => {

                                            const prodName = item.name;
                                            const prodQuan = item.quantity;
                                            const prodRate = item.price;
                                            const prodRate_ = item.price_;

                                            navigation.navigate('SubscribeScreen', {
                                                tag: 'paper',
                                                pname: prodName,
                                                pquan: prodQuan,
                                                prate: prodRate
                                            })
                                        }
                                        } />

                                )

                            }}
                        /> : null}
                    </View>
                    {renderReasons()}
                    {item.all.order_status.trim() === 'ORDERED' ? (
                        <View style={styles.cancelButton}>
                            <SubmitButton text={cancelClicked === 1 ? "Confirm Cancel" : "Cancel Order"} otherColor={Colors.red} onTouch={cancelButtonClicked} />
                        </View>
                    ) : <View />
                    }










                </View>
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    collapsedAccordion: {
        marginHorizontal: 20,
        marginVertical: 5,
        paddingBottom: 10,
        borderColor: Colors.seperatorGray,
        borderRadius: 15,
        borderWidth: 1,
        paddingVertical: 10,
        alignContent: 'center'

    },
    expandableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center'

    },
    cancelButton: {
        marginTop: 30,
        marginBottom: 20

    }


}
);