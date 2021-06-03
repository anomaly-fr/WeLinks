import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import {Text, View, FlatList, TouchableOpacity, StyleSheet, BackHandler} from 'react-native';
import AppBar from '../components/ui_components/AppBar';
import {Colors, Config, dimen, Styles} from '../Constants';
import { useAuth } from '../services/auth-service';
import ymdToApp from '../Utility/dateConvertor';
import qs from 'qs';

var transcations =[];

export default function WalletScreen({navigation,route}){

    const user = useAuth();
    console.log(user);
    const {back} = route.params;
    const [flatListre, setFlatReference] = useState(null); // remount flat list
    const [transcationsLength, setTransactionsLength] = useState(0); 
    const [selectedTab, setSelectedTab] = useState(0);  // credit, debit, all
    const [remountKey, setRemountKey] = useState('0');

    useEffect(()=>{

        //Hardware BackButtion action
        BackHandler.addEventListener('hardwareBackPress',()=>{
            route.params.goToHomeStack();
            return true;
        });

        //update transactions from backend on every reload
        navigation.addListener('focus',()=>{
            axios.get(Config.api_url+'php?'+qs.stringify({
                action: 'getWalletTransactions',
                user_id: user.user.user_id
            }))
            .then((response)=>{
                    // console.log(response);
                    try{
                            transcations = response.data.wallet_transaction;
                            console.log(transcations);
                            console.log(transcations.length);
                            setTransactionsLength(transcations.length);
                        }
                    catch(error){
                        setTransactionsLength(0);
                    }
                setRemountKey(Math.random(0.4).toString());
            });
            user.sync();
        });

    },[]);
    
    /*
        The three tabs, pager is a flatlist which renders a flatlist of transactions
        Just using a filter debit/credit/ all in place to display all transactions
    */
    
    return (
        <View style={{...StyleSheet.absoluteFill, flexDirection: 'column'}}>
            <View style={{height: dimen.appbarHeight}}>
                <AppBar
                    title="Wallet"
                    back={back ? true : false}
                    funct={()=>{
                        route.params.toggleDrawer()
                    }} 
                />
            </View>
            <View style={{justifyContent: 'center', flex: 1.5, flexDirection: 'row',width: '100%'}}>
                <View style={{justifyContent: 'space-evenly',alignItems: 'center', flexDirection: 'column',width: '100%'}}> 
                    <Text style={[Styles.heading, {width: '50%',textAlign: 'center',alignSelf: 'center', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 15, borderWidth: 1, borderColor: Colors.seperatorGray}]}>
                        {'Balance ₹ '+ user.user.wallet_balance}
                    </Text>
                    <TouchableOpacity  onPress={()=>{
                            navigation.navigate('AddMoney');
                            console.log('nav')
                        }}>
                        <View style={{alignSelf: 'center'}}>
                            {/* <Image>
                            </Image> */}
                            <Text style={{padding: 10, borderWidth: 1, borderColor: Colors.seperatorGray,...Styles.subbold}}> + Add Money To Wallet</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {
                transcationsLength == 0? <Text style={{fontSize: 18, fontWeight: '800', textAlign: 'center', flex: 3}}> No transactions to show</Text>
                : 
               ( <View style={[{flex: 3}, {flexDirection: 'column',marginHorizontal: 10}]}>
                <View style={{flexDirection: 'row', flex: 0, justifyContent: 'space-evenly', padding: 10}}>
                    {["All","Debit","Credit"].map((value,ind)=>{
                        return (<TouchableOpacity onPress={()=> {setSelectedTab(ind); flatListre.scrollToIndex({index: ind})}}>
                                    <View>
                                        <Text style={ind == selectedTab ? {fontSize: 18, fontWeight: 'bold'}:{fontSize: 14, fontWeight: '500'}}>{value+ ' '}</Text>
                                    </View>
                                </TouchableOpacity>)
                    })}
                </View>
                <View style={{flex: 1}}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        extraData={remountKey}
                        data={["All","debit","credit"]}
                        key={(index)=> index.toString()}
                        disableIntervalMomentum={true}
                        bounces={false}
                        pagingEnabled
                        onScroll={({nativeEvent})=>{
                            console.log(nativeEvent);
                            const {x} = nativeEvent.contentOffset;
                            console.log(x);
                            if(x== 0)
                                setSelectedTab(0);
                            else if(x <= dimen.width*2 -50)
                                setSelectedTab(1);
                            else 
                                setSelectedTab(2);
                        }}
                        ref={(reference) => setFlatReference(reference)}
                        renderItem={({item})=>{
                            console.log(item);
                            return (<View style={{width: dimen.width-20}}>
                                <FlatList
                                data={item == "All" ?  transcations: transcations.filter(transaction => item == transaction.trans_type )}
                                key= {( index)=> index.toString()}
                                ItemSeparatorComponent={()=> <View style={{backgroundColor: Colors.seperatorGray, height: 1}}/>}
                                renderItem={({item})=>{
                                    console.log(item);
                                    return (
                                        <View style={{ flexDirection: 'row', backgroundColor: item.trans_type == 'debit' ? Colors.secondary : Colors.primary, justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 }}>
                                            {
                                                selectedTab == 0 ? <Text style={{color: item.trans_type == 'debit'? 'black': 'white'
                                                ,
                                                marginHorizontal: 5
                                            }}>{item.trans_type}</Text> : null
                                            }
                                            <Text style={{color: item.trans_type == 'debit'? 'black': 'white'
                                            ,
                                            marginHorizontal: 5
                                        }}>{item.wallet_trans_amount}</Text>
                            
                                            <Text style={{color: item.trans_type == 'debit'? 'black': 'white'
                                            ,
                                            marginHorizontal: 5
                                        }}>{ymdToApp( item.timestamp) +"   "}</Text>
                                        </View>
                                    )
                                }}
                            />
                                </View>)

                        }}
                    />
                </View>

            </View>)
        
            }
          </View>
    );
}

const styles = StyleSheet.create({

})