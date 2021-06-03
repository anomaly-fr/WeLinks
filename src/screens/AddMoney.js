import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import AppBar from '../components/ui_components/AppBar';
import SubmitButton from '../components/SubmitButton';
import { Colors, dimen, Styles } from '../Constants';
import { AuthContext, useAuth } from '../services/auth-service';

const moneyOptions = ['100','500','1000']

export default function AddMoney({navigation}){
    const user = useAuth();
    const [value, setValue] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const moneySelected =(index,value)=>{
        setSelectedIndex(index);
        setValue(value);
    }


    return (
        <View style={[StyleSheet.absoluteFill,styles.parent]}>
            <View style={styles.appbar}>
                <AppBar title="Add Money" back={true} funct={()=>{navigation.goBack();}} />
            </View>
            <Text numberOfLines={2} style={[Styles.heading,styles.header]}> Please enter the amount to recharge your wallet</Text>
            <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={styles.moneyborder}>
                <TextInput 
                value={value}
                maxLength={5}
                onChangeText={(text)=>{
                    if(selectedIndex != -1)
                        setSelectedIndex(-1);
                    setValue(text.replace(/[^0-9]/g, ''))
                }}
                onFocus={()=>setSelectedIndex(-1)} style={styles.money} keyboardType="numeric" placeholder="Enter amount to recharge wallet" />
                <View style={styles.moneyOptions}>
                    {moneyOptions.map((value,index,arr)=>{
                        return (
                            <TouchableOpacity  onPress={()=>moneySelected(index,value)}>
                                <Text style={[styles.moneybox,{backgroundColor: selectedIndex == index ?  Colors.primary : 'white' ,
                                fontWeight: selectedIndex == index? 'bold': '500',
                                color: selectedIndex == index ? 'white': 'black'}]}>
                                    {"₹ " + value} 
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
           
            </View>
             <View style={styles.button}>
                <SubmitButton text={"Add ₹" + value} onTouch={()=>{
                    if(value.trim() != '')
                        navigation.navigate('Payment',{
                            online_pay:false,
                            order:{
                                amount: value
                            },
                            actualUser: user.user,
                            wallet: true
                        });
                    else
                        alert("Please enter a valid amount");
                }}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    appbar:{
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        backgroundColor: 'black',
        height: dimen.appbarHeight
    },
    parent:{
        justifyContent: 'flex-start',
        backgroundColor: 'white'
        // alignItems: 'center'
    },
    button:{
        position: 'absolute',
        alignSelf: 'center',
        bottom: 0,
        paddingVertical: 20,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    money:{
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: Colors.seperatorGray,
        borderRadius: 5,
        paddingHorizontal: 10

    },
    moneyOptions:{
        flexDirection: 'row',
        marginVertical: 20,
        justifyContent: 'space-evenly'
    },
    moneybox:{
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: Colors.seperatorGray
    },
    header:{
        alignSelf: 'center',
        width: '85%',
        textAlign: 'center',
        paddingTop: 30,
        paddingHorizontal: 30

    },
    moneyborder:{
        marginBottom: 50
    }

})