import React,{useState,useEffect} from 'react';
import {View,Text,StyleSheet,ScrollView,FlatList,TouchableOpacity,TextInput} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {Colors, TextSpinnerBoxStyles,dimen,Styles, Config} from '../Constants';
import GenericSeperator from '../components/ui_components/GenericSeperator';
import AppBar from '../components/ui_components/AppBar';
import Axios from 'axios';
import qs from 'qs';

export default function CancellationScreen({navigation,route}){
    const [notes,setNotes]=useState('');
    const { bidTitle } = route.params;
    const {item,actualUser} = route.params;

    const onButton=(type)=>{
        if(type != 'cancel' && notes.trim() === ''){
            alert('Please enter a reason/some information');
            return;
        }
        else if(type != 'cancel'){
            Axios.post(Config.api_url+'php?'+qs.stringify({
                action: 'cancelBid',
                user_id: actualUser.user_id,
                bid_id: item.bid_id,
                bid_notes: notes
            })).then((response)=>{
                console.log(response.data);
                alert('Request completed sucessfully');
                navigation.goBack();
                navigation.goBack();
            }
            );
        }
        else if(type === 'cancel')
            navigation.goBack();
           return //dosomething
    

    }


    return(<View>
    <AppBar title={'Cancel Tender'} back funct={() => {navigation.pop()}}/>
        <View style={{...Styles.parentContainer}}>
            <Text style={{...Styles.heading,alignSelf: 'center',flex: 0}}>{bidTitle}</Text>
            <Text style={{marginTop: dimen.height/30,alignSelf: 'center',marginHorizontal: dimen.width*0.05,flex: 0,fontWeight: 'bold',color: 'black',alignItems:'center'}}>Are you sure you want to cancel/close?</Text>
            <TextInput 
            placeholder= {`Reason for cancellation/other information`}
                onChangeText={setNotes}
                textAlignVertical={'top'}
               multiline={true}
               line
                numberOfLines={10}
            style={{fontSize: 15,color: 'black',padding: 15,margin: 30,flex: 0,borderColor: Colors.seperatorGray,borderWidth: 1,borderRadius: 5,maxHeight: dimen.height/3}} />
            <View style={{flexDirection: 'row'}}>
            <View style={{backgroundColor: Colors.red,flex: 1,borderRadius: 7,margin: 10}}>
                <TouchableOpacity onPress={()=>onButton('cancel')} >
                    
                        <Text style={{color: 'white',fontSize: 14,textAlign: 'center',padding: 10}} >Cancel</Text>
                    
                </TouchableOpacity>
                </View>
                <View style={{backgroundColor: Colors.primary,flex: 1,borderRadius: 7,margin: 10}}>
                <TouchableOpacity onPress={()=>onButton('confirm')} >
                    
                    <Text style={{color: 'white',fontSize: 14,textAlign: 'center',padding: 10}} >Confirm</Text>
                    
                </TouchableOpacity>
                </View>
            </View>
        </View>
        </View>
    )

}