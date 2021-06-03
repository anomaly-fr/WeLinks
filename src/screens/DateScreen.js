import React,{ Fragment, useState, useRef } from 'react';
import { View,Text,TouchableOpacity,StyleSheet,Dimensions,Alert } from 'react-native';


import { Calendar } from 'react-native-calendars';


import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import SubmitButton from '../components/SubmitButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import moment from 'moment';
import Date from './Date';
import WeekPicker from '../components/ui_components/WeekPicker';


const DateScreen = () => {
    
    return(
       <View style={{margin:5,padding: 5}}>
           <WeekPicker />
       </View>

       
    )
}


export default DateScreen;