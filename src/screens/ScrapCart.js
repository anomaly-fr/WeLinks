import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { Styles, ScrapStyles, dimen, Colors, notification_identifiers } from '../Constants';
import AppBar from '../components/ui_components/AppBar';
import { EvilIcons } from '@expo/vector-icons';
import Appliance from '../components/Appliance';
import ExpandableTextBox from '../components/ui_components/ExpandableTextBox';
import moment from 'moment';
import Axios from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-community/async-storage';
import { Config } from '../Constants';
import sendNotif from '../Utility/sendNotificationTo';



export default class ScrapCart extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            startDate: 1,
            startMonth: 2,
            startYear: 2020,
            startDay: 0,
            selectedDate: null,
            selectedTIme: null,
            timeSelected: [false, false, false],
            cartItems: [],
            extraData: 0,
            cart: this.props.route.params.cart,
            cartAmount: 0,
            notes: '',
            extraData: 0,
            amount: 0,
            confirm: false
        };
    };

    placeOrder = () => {
        const { selectedDate, selectedTime } = this.state;
        const { navigation } = this.props;
        if (selectedDate === null || selectedTime === null)
            alert('Please select the data and timeslot for the pickup and try Again');
        else {
            this.setState({ confirm: true })
            Axios.post(Config.api_url + 'php?action=schedulePickup&' + qs.stringify({
                user_id: this.props.route.params.actualUser.user_id,
                address_id: this.props.route.params.address.addr_id,
                vendor_id: this.props.route.params.vendorId,
                order_id: this.props.route.params.orderId,
                pickup_date: this.state.selectedDate,
                time_slot: this.state.selectedTIme,
                order_amount: this.state.amount,
                notes: this.state.notes
            })).then((response) => {
                console.log("order is " + JSON.stringify(response))
                console.log(this.state.selectedDate)
                alert("Order placed successfully");
                sendNotif("Order Received!", "You have a new scrap order", "vendor" + this.props.route.params.vendorId, notification_identifiers.vendor_scrap_orders)
                AsyncStorage.removeItem('ScrapOrderId').then(() => {
                    AsyncStorage.removeItem('PrevScrapVendor').then(() => {
                        navigation.navigate('Homescreen');
                    })
                });

                navigation.navigate('Homescreen');
            });
        }
    }

    onRemove = (index) => {
        var tempArr = this.state.cart;
        tempArr.splice(index, 1);
        this.setState({ cart: tempArr });
    }

    getTodaysDate = () => {
        var date = moment().utcOffset("+05:30").toDate();
        var newDate = {
            startDate: date.getDate(),
            startMonth: date.getMonth(),
            startYear: date.getFullYear(),
            startDay: date.getDay()
        };
        console.log(newDate);
        this.setState({
            newDate
        });
        this.setState({ startDate: newDate.startDate });
        this.setState({ startMonth: newDate.startMonth });
        this.setState({ startYear: newDate.startYear });
        this.setState({ startDay: newDate.startDay });

        console.log("tod" + this.state.startDate);
        this.setState({
            extraData: Math.random(0.5)
        })
    }

    componentDidMount = () => {
        this.getTodaysDate();
        this.calculateCartAmount();

    }

    renderCartItem = (item) => {

    };

    dateSelectedCallback = (date) => {
        this.setState({ selectedDate: date.year + "-" + (date.month + 1) + "-" + date.date })
        console.log("dayte: " + date.year + "-" + date.month + "-" + date.date);
    };
    timeSelected = (index) => {
        var i;
        var temparr;
        this.setState({
            selectedTime: index
        });
        temparr = [false, false, false];
        temparr[index] = true;
        this.setState({
            timeSelected: temparr
        })


    }

    calculateCartAmount = () => {
        let i, amount = 0;
        for (i in this.state.cart) {
            amount += ((parseFloat(this.state.cart[i].homescrap_price)) * parseInt(this.state.cart[i].cart_quantity))

        }
        this.setState({ amount: amount })

        //  this.setState({cartAmount : amount})
        return amount;
    }



    render() {

        const { cart } = this.props.route.params;
        //console.log('cart: ' + cart[0].itemName)






        return (
            <View style={{ flex: 1 }}>
                <AppBar title='Cart' back funct={() => { this.props.navigation.pop() }} />

                <ScrollView style={{ flex: 1 }}>
                    <View style={{ marginTop: dimen.height / 16 + 20, flex: 1 }}>
                        <View style={{ flex: 0 }}>
                            <View style={{ maxHeight: dimen.height / 2 }}>
                                <FlatList
                                    data={cart}
                                    extraData={this.state.extraData}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <Appliance
                                                schedule={true}
                                                remove={true}
                                                item={item}
                                                index={index}
                                                onAdd={(num) => {


                                                    cart.push({
                                                        ...item,
                                                        itemQuantity: num
                                                    });



                                                    console.log(cart)



                                                }}
                                                onRemove={this.onRemove
                                                    // let temp = cart,i,ind = index;

                                                    // for(i in temp){
                                                    //         if(i != ind)
                                                    //         cart.push(temp[i])
                                                    // }
                                                    // console.log(cart)

                                                }
                                                initquan={item.cart_quantity}
                                                name={item.homescrap_name}
                                                quantity={item.quantity} price={item.homescrap_price} price_={item.price_} image={item.homescrap_image_url}
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
                                />
                            </View>

                            <View style={styles.gray}>
                                <Text style={{ marginHorizontal: '1%' }}>Disclaimer: Prices shown are only approximate value. They can differ for different vendors/products.</Text>

                            </View>
                            <View style={{ paddingHorizontal: 10, backgroundColor: 'white', marginTop: dimen.sVm }}>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.billText}>{"Cart Amount"}</Text>
                                    <Text style={styles.billCost}>₹{this.state.amount}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.billText}>{"Pick-Up Fee" + " "}</Text>
                                    <Text style={styles.billCost}>₹50</Text>
                                </View>
                                <View style={{ ...Styles.grayfullline, marginVertical: dimen.sVm }} />
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.billText}>{"Total Cost"}</Text>
                                    <Text style={styles.billCost}>₹{this.state.amount + 50}</Text>
                                </View>


                            </View>

                        </View>
                        <View style={{ padding: 10, backgroundColor: Colors.secondary }}>
                            <Text style={[ScrapStyles.heading]}>Pick-Up Date and Time </Text>
                            <View style={{ ...Styles.horizontalCalendarRow }}>
                                {//SevenViewshere
                                }
                            </View>
                            <WeekView extraData={this.state.extraData} start={{
                                day: this.state.startDay, date: this.state.startDate,
                                month: this.state.startMonth, year: this.state.startYear
                            }} selectedChangeInParent={this.dateSelectedCallback} />
                            {/* <Text style={{...ScrapStyles.heading,marginBottom: dimen.mVm}}>Select Time </Text> */}
                            <View style={{ margin: 10 }} />
                            <View style={Styles.horizontalCalendarButtonsRow}>
                                <TouchableOpacity style={this.state.timeSelected[0] ? {
                                    ...ScrapStyles.timebutton,
                                    borderColor: Colors.primary, paddingVertical: 10
                                } : { ...ScrapStyles.timebutton, borderColor: Colors.seperatorGray }}
                                    onPress={() => {
                                        this.timeSelected(0);
                                        this.setState({ selectedTime: '9:00AM to 12:00PM' })
                                    }}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <EvilIcons name="clock" size={24} color="black" />
                                        <Text style={Styles.subbold}>  9:00 AM -  </Text>
                                    </View>
                                    <Text style={Styles.subbold}> 12:00 PM</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.timeSelected[1] ? {
                                    ...ScrapStyles.timebutton,
                                    borderColor: Colors.primary, paddingVertical: 10
                                } : { ...ScrapStyles.timebutton, borderColor: Colors.seperatorGray }}
                                    onPress={() => {
                                        this.timeSelected(1);

                                        this.setState({ selectedTime: '12:00PM to 3:00PM' })
                                    }}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <EvilIcons name="clock" size={24} color="black" />
                                        <Text style={Styles.subbold}>  12:00 PM -  </Text>
                                    </View>
                                    <Text style={Styles.subbold}>3:00 PM</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.timeSelected[2] ? {
                                    ...ScrapStyles.timebutton,
                                    borderColor: Colors.primary, paddingVertical: 10
                                } : { ...ScrapStyles.timebutton, borderColor: Colors.seperatorGray }}
                                    onPress={() => {
                                        this.timeSelected(2);
                                        this.setState({ selectedTime: '12:00PM to 3:00PM' })

                                    }}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <EvilIcons name="clock" size={24} color="black" />
                                        <Text style={Styles.subbold}>  3:00 PM -  </Text>
                                    </View>
                                    <Text style={Styles.subbold}> 5:00 PM</Text>
                                </TouchableOpacity>
                            </View>
                            <ExpandableTextBox changeText={(text) => this.setState({ notes: text })} title="Additional notes" hint="Any additional information for the scrap pickup." />
                            <View style={{ height: 10, width: 100 }} />

                        </View>


                    </View>
                    <TouchableOpacity onPress={() => {

                        this.placeOrder();
                    }} style={this.state.confirm ? { flex: 0, backgroundColor: Colors.buttonEnabledGreen, width: dimen.width * 0.9, alignSelf: 'center', borderRadius: 10, marginBottom: 5 } : { flex: 0, backgroundColor: Colors.primary, width: dimen.width * 0.9, alignSelf: 'center', borderRadius: 10, marginBottom: 5 }}>
                        <Text style={this.state.confirm ? { alignSelf: 'center', zIndex: 100, color: 'white', fontSize: 15, padding: 15, fontStyle: 'italic', textAlign: 'center' } : { alignSelf: 'center', zIndex: 100, color: 'white', fontSize: 15, padding: 15, textAlign: 'center' }}>Confirm Pickup</Text>
                    </TouchableOpacity>
                </ScrollView>



            </View>
        );

    }
}


WeekView = ({ start, selectedChangeInParent, extraData }) => {
    var i;
    var someArray = [];
    const [initArray, setInitArray] = useState([]);
    const [extd, setextd] = useState(0);
    var date, day, nextDay;
    const [selected, setSelected] = useState([false, false, false, false, false, false, false]);
    var selectedDate = null;

    useEffect(() => {
        someArray.push(start);
        setInitArray(someArray);
        for (i = 0; i < 6; i++) {
            nextDay = { ...getNextDate(someArray[i]), day: getNextDay(someArray[i].day) }
            someArray.push(nextDay);
        }
        setInitArray(someArray);


    }, [extraData, start]);

    const getNextDay = (currentDay) => {
        if (currentDay == 6)
            return 0
        return currentDay + 1
    }

    const getNextDate = (startDate) => {
        const { month, date, year } = startDate;
        if (month == 2 && date >= 28) {
            if (date == 28)
                if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0))
                    return {
                        date: 29,
                        month: 2,
                        year: year
                    }
            return {
                date: 1,
                month: 3,
                year: year
            }
        }
        else if (((month == 4 || month == 6 || month == 9 || month == 11) && date == 30))
            return {
                date: 1,
                month: month + 1,
                year: year
            };
        else if (date == 31)
            if (month == 12)
                return {
                    date: 1,
                    month: 1,
                    year: year + 1
                };
            else
                return {
                    date: 1,
                    month: month + 1,
                    year: year
                };
        return {
            date: date + 1,
            month: month,
            year: year
        };
    }

    const itemSelected = (index) => {
        var temparr = [];
        selectedDate = initArray[index];
        for (i = 0; i < 7; i++)
            if (index == i)
                temparr.push(true);
            else
                temparr.push(false);
        setSelected(temparr);
        selectedChangeInParent(selectedDate);

    }

    return (
        <View style={Styles.scrapWeekView}>
            {initArray.map((item, index) => {
                return (
                    <DayButton key={index} dateInfo={item} onSelected={itemSelected} selected={selected[index]} index={index} />
                );
            })}
        </View>
    )

}

DayButton = ({ dateInfo, onSelected, selected, index }) => {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


    const theNeedful = () => {
        onSelected(index);
    }

    return (
        <View style={Styles.dayButton}>
            <TouchableOpacity onPress={theNeedful}>
                <View style={{ ...Styles.dayButton, backgroundColor: selected ? Colors.primary : 'transparent' }}>
                    <Text style={!selected ? Styles.subheading : { ...Styles.subbold, fontWeight: 'bold', fontSize: 15, color: 'white' }}>{days[dateInfo.day]}</Text>
                    <Text style={!selected ? { ...Styles.subbold, paddingVertical: 5 } : { ...Styles.subbold, fontWeight: 'bold', fontSize: 15, color: 'white' }}>{dateInfo.date}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    gray: {

        backgroundColor: Colors.seperatorGray,
        borderRadius: 10,
        height: Dimensions.get('window').height / 11,
        marginHorizontal: '3%',

        alignItems: 'flex-start',
        justifyContent: 'center',
        elevation: 1
    },
    billText: {
        fontSize: 18,
        marginTop: '2%',
        fontWeight: '900',
        margin: '2%'
    },
    billCost: {
        fontWeight: 'bold',
        fontSize: 16,
        margin: '2%',
        textAlign: 'right',


        ...StyleSheet.absoluteFill

    },
})
