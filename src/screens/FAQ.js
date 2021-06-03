import React,{useState, useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { List } from 'react-native-paper';
import {Colors, Styles} from '../Constants'
import AppBar from '../components/ui_components/AppBar'
import { ScrollView } from 'react-native-gesture-handler';
import Axios from 'axios';
import {Config} from  '../Constants';


const FAQ = ({navigation}) => {
  const [questions,updateQuestions] = useState([])
  const sampleQuestions = [
    {
        question:'How do subscriptions work?',
        answer:'Its simple, You choose your favourite brand, quantity and frequency. You make a payment. Sit back and enjoy products delivered to your doorstep!',
     
    },
    {
     question:'Do you deliver in my area?',
     answer:'Its simple, You choose your favourite brand, quantity and frequency. You make a payment. Sit back and enjoy products delivered to your doorstep!',

 },
 {
     question:'Is there a delivery fee?',
     answer:'Its simple, You choose your favourite brand, quantity and frequency. You make a payment. Sit back and enjoy products delivered to your doorstep!',
 },
 {
  question:'How do subscriptions work?',
  answer:'Its simple, You choose your favourite brand, quantity and frequency. You make a payment. Sit back and enjoy products delivered to your doorstep!',

},
{
question:'Do you deliver in my area?',
answer:'Its simple, You choose your favourite brand, quantity and frequency. You make a payment. Sit back and enjoy products delivered to your doorstep!',

},
{
q:'Is there a delivery fee?',
a:'Its simple, You choose your favourite brand, quantity and frequency. You make a payment. Sit back and enjoy products delivered to your doorstep!',
}];
useEffect(() => {
  Axios.get(Config.api_url+'php?action=getFAQs',{
      'Accept-Encoding': 'gzip'
  }
  ).then((result) => {
  console.log(result.data.faqs)
  updateQuestions(result.data.faqs)

     

  }).catch((error) => {
      console.log("Error fetching FAQs: " + err);
      updateQuestions(sampleQuestions)
      
  });

  
});

const renderAccordion = () => {
  const accordions = [];
  for(var i=0;i<questions.length;i++){
      
      accordions.push(
    <View>

 <List.Accordion title={questions[i].question} id={i} titleStyle={styles.question}>
 <List.Item  descriptionNumberOfLines={5} descriptionStyle={styles.answer} description={questions[i].answer}/>
 </List.Accordion>

 <View style={Styles.grayfullline}/>


</View>)

  }
return accordions;
};


  return(
  <View style={{flex:1}}>
   <AppBar title='FAQs' back ={true} funct={() => {
        navigation.pop();
        }} />
  
        <ScrollView>
  <View style={{...Styles.parentContainer,flex: 1,height:Dimensions.get('window').height}}>
  
  {/* <Text style={styles.heading}>Frequently Asked Questions</Text> */}
  {/* <View style={Styles.grayfullline}/> */}

  {renderAccordion()}
  </View>
  </ScrollView>
  </View>)

};

const styles = StyleSheet.create({
  heading:{
    color: 'black',
    margin: '5%',
    fontSize: 20,
    marginVertical: '5%',
    fontWeight: 'bold'
  },
  question: {
    color: 'black',
    fontSize: 16,
    fontWeight: '900',
    
  },
  answer: {
    color: 'gray',
    marginTop: '-10%'
  }
  
});
 
export default FAQ;