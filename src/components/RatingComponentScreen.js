import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text,TextInput} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {Styles,strings_screen,dimen,Colors} from '../Constants';
import RatingComponent from './RatingsComponent';
import SubmitButton from './SubmitButton';
import TextBox from './ui_components/TextBox';

const strings = strings_screen.ratings;


export default function RatingComponentScreen({buttonPress= ()=>{},order_details = {}}){
    const [remountKey,setRemountKey] = useState(Math.random(0.3).toString());
    var stars = 0;
    var reviewText = '';

    useEffect(()=>{
        setRemountKey(Math.random(0.3).toString());
    },[order_details])



    return (
        <View style={{backgroundColor: Colors.lightBlue }}>
            <ScrollView>
            <View style={{flex:1}}>
            <Text style={[Styles.subheading,styles.mainheading]}>{ strings.heading }</Text>
            <View style={styles.order_card}>
                <Text style={{...Styles.heading,marginTop: 0}}>Order Details</Text> 
                <View style={{marginTop: dimen.sVm}}/>
                {
                    Object.keys(order_details).map((jKey, index)=>{
                        console.log("jkey "+jKey);
                        return (
                            <View key={index.toString()} style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 14,color: 'gray',fontWeight: 'bold',flex: 1,marginLeft: dimen.sHm/4}}>{jKey +": "}</Text>
                                <Text style={{fontSize: 14,color: 'black',fontWeight: 'bold',flex: 3,marginLeft: dimen.sHm/4}}>{order_details[jKey]}</Text>
                            </View>
                        )
                        return (<Text style={{...Styles.subbold,marginLeft: dimen.sHm/4}}>{jKey +": "+ order_details[jKey]}</Text>)
                    })
                }
            </View>
            
            <RatingComponent key={Math.random().toString()} initRatings={0} starChanged={(new_stars)=>{
                stars = new_stars;
            }} />

            <TextInput key={JSON.stringify(order_details).toLowerCase()} title={strings.textbox_title} onChangeText={(text)=>{reviewText = text}} numberOfLines={8} textAlignVertical="top" style={styles.input}  placeholder={strings.hint} />
            <View style={{marginBottom:5,alignSelf:'center'}}>
            <SubmitButton onTouch={()=>{
                console.log(stars,reviewText);
                buttonPress(stars,reviewText)}} text="Submit" />
                </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainheading:{
        alignSelf: 'center',
        textAlign: 'left',
        margin: dimen.sHm,
        padding: dimen.sVm

    },
    order_card:{
        marginHorizontal: dimen.sHm,
        borderRadius: dimen.sHm,
        borderWidth: dimen.sVm/16,
        padding: dimen.sVm,
        zIndex: 10,
        elevation: 100,
        backgroundColor: Colors.seperatorGray

    },
    input:{
        marginStart: 10,
        backgroundColor: 'white',
        padding: dimen.sVm,
        marginHorizontal: dimen.sHm,
        borderRadius: dimen.sHm,
        marginBottom: dimen.bottomMargin
    }
});