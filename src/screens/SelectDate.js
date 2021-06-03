import React,{ Fragment, useState, useRef } from 'react';
import { View,Text,TouchableOpacity,StyleSheet,Dimensions,Alert } from 'react-native';
import {Colors} from '../Constants'

import { Calendar } from 'react-native-calendars';


import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import SubmitButton from '../components/SubmitButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import moment from 'moment';
import Date from './Date';
import WeekPicker from '../components/ui_components/WeekPicker';


bs = React.createRef();


const SelectDate = () => {
const [isPressed,setIsPressed] = useState(false)
  thisDay = moment()
  .utcOffset('+05:30')
  .format('YYYY-MM-DD');
 // thisDay = thisDay.charAt(8)+thisDay.charAt(9)+monthNames[(int)(thisDay.charAt(6))]
  console.log('t:'+thisDay)
  
  renderContent1 = () => { 
   
   
    return(<View>

    <Date onSet={() => {
     // console.log('Set')
   //  bs.snapTo(1)
   
      setIsPressed(true)
     
    }}/>

    <SubmitButton text='Cancel' onTouch={() => {
        this.bs.current.snapTo(2)
    }
    }/>
    </View>
   


  )};
  
  renderContent2 = () => {
  return(<View style={{margin: 2}}>
  <TouchableOpacity onPress = {() => {
    setIsPressed(false)
  }}>
    <Text style={{color: ,position:'absolute', marginStart:Dimensions.get('window').width-100}}></Text>
  </TouchableOpacity>
  <WeekPicker back={() => {
    setIsPressed(false)
  }}/>
  <SubmitButton text='Cancel' onTouch={()=>{
      this.bs.current.snapTo(2)
    //  setIsPressed(false)
  
  }}/>

  

  </View>)
  };

  renderHeader = () => (
    <View style={style.header}>
      <View style={style.panelHeader}>
        <View style={style.panelHandle} />
      </View>
    </View>
  );

  
  fall = new Animated.Value(1);

  return (
    <View style={style.container}>
      <BottomSheet
        enabledContentTapInteraction={true}
        ref={this.bs}
        snapPoints={[dimen.height-dimen.appbarHeight*3,400,0]}
        renderContent= {!isPressed ? this.renderContent1 : this.renderContent2}
        renderHeader={this.renderHeader}
        initialSnap={2}
        callbackNode={this.fall}
        enabledGestureInteraction={false}
      />
      <Animated.View style={{margin: 20,
        opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
    }}>
    <TouchableOpacity onTouch={() => {
      bs.current.snapTo(1)
    }}>
        <View style={{alignItems: 'center'}}>
          <SubmitButton onTouch={() => this.bs.current.snapTo(0)}
              text='Open Sheet'
          />
          
           
              
          
         
        </View>

        
       
       
     
        </TouchableOpacity>
     
      </Animated.View>
    </View>
  );
};



const style = StyleSheet.create({
  container: {
    flex: 1,
  },
 
  panel: {
    padding: 20,
    backgroundColor: 'white',
    paddingTop: 10,
    height: Dimensions.get('window').height
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 0.2,
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'gray',
    marginBottom: 10,
  },
 
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  buttonText: {
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf:"center",
    color: 'white',
    fontWeight: '300',
    ...StyleSheet.absoluteFill,
    
    
    
    
},
button:{
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: Colors.primary,
    width: Dimensions.get('window').width-30,
    height: 45,
    borderRadius: 5,
   
   

}
 
  
 
});

export default SelectDate;