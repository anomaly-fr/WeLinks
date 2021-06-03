import React, { useEffect,useState } from 'react';
import {View,StyleSheet,TextInput, Dimensions,BackHandler, Linking} from 'react-native';
import {Text} from 'react-native-paper';
import { useFocusEffect,CommonActions,useNavigation, StackActions } from '@react-navigation/native';
import sendFeedback, {sendEmail} from '../../src/Utility/EmailUtility'
import AppBar from '../components/ui_components/AppBar';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SubmitButton from '../components/SubmitButton';
import {Colors} from '../Constants';
import Axios from 'axios';
import {Config} from  '../Constants';

const SupportFAQ = ({navigation,route}) => {
    //const {privacyData,termsData,contactUsData}=route.params.cachedData;
   // console.log(route.params.cachedData,'CachedData')
    const {navigator} = route.params;
    const [phone,setPhone]=useState(null);//contactUsData === undefined ? null: contactUsData.phone);
    const [email,setEmail]=useState(null);//contactUsData === undefined? null: contactUsData.email);
    const words = {
        allTopics: 'All Topics',
        faq: 'Frequently Asked Questions',
        privacy: 'Privacy Policy',
        terms: 'Terms and Conditions',
        contact: 'Contact Us',
        phone: 'Phone',
        email : 'Email',
        feedback: 'Send Feedback'

    };

    useEffect(()=>{
        Axios.get(Config.api_url+'php?action=getContactUs&city_id=1')
        .then((response)=>{
            console.log('supportfaq');
            console.log(response.data.phone);
            setPhone(response.data.phone);
            setEmail(response.data.email);
        });
    },[]);
    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
         console.log('Can\'t go back from here');
         route.params.goBackToHome();
       
        // navigation.goBack();
         //   navigation.reset();
                  
              return true;
            
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        },)
      );

      const [content,setContent] = useState('');
    return(
    <View>
     <AppBar  title='Support & FAQs'funct={() => {
        route.params.draweNav.toggleDrawer();
        }} />

    <View style={style.container}>
    
   
      
        <ScrollView>
        <View style={{backgroundColor: 'white',flex:1,marginBottom: '30%'}}>
        
    <Text style={style.heading}>{words.allTopics}</Text>

    <View style={{borderWidth: 0.2,bordercolor: 'gray',height: 0, width: '95%',alignSelf: 'center'}}/>

    <View>
        <TouchableOpacity onPress={() => navigation.navigate('FAQ')}>
        <View style={{flexDirection: 'row',margin: '5%',marginTop: '7%'}}>

        <View style={{marginTop: '1%'}}>
        <Icon 
                                name="help-circle-outline" 
                                color =  'black'
                                
                                size={22}
                                />
        </View>
      

    <View style={{flexDirection: 'column'}}>
      
        <Text style={{...style.blackText,fontWeight: 'bold', color: 'black',marginTop: '2%',marginStart: '10%'}}>{words.faq}</Text>
       
    </View>
    <View style={{position: 'absolute',right: 8,top: 8}}>

    <Icon 
                                name="chevron-right" 
                                color= {Colors.primary}
                                
                                size={20}
                                />

    </View>

  
        </View>
            
            
        </TouchableOpacity>

    </View>


    <View>
        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy',{
           
        })}>
        <View style={{flexDirection: 'row',margin: '5%',marginTop: '1%'}}>

        <View style={{marginTop: '1%'}}>
        <Icon 
                                name="shield-outline" 
                                color =  'black'
                                
                                size={22}
                                />
        </View>
        

      

    <View style={{flexDirection: 'column'}}>
      
        <Text style={{...style.blackText,fontWeight: 'bold', color: 'black',marginTop: '4%',marginStart: '15%'}}>{words.privacy}</Text>
       
    </View>
    <View style={{position: 'absolute',right: 8,top: 8}}>

    <Icon 
        name="chevron-right" 
        color={Colors.primary}
        size={20}/>
    </View>

        </View>
            
        </TouchableOpacity>


    </View>


{/**/ }


    <View>
        <TouchableOpacity onPress={()=>navigation.navigate('Terms',{
        
        })}>
        <View style={{flexDirection: 'row',margin: '5%',marginTop: '1%'}}>

        <View style={{marginTop: '1%'}}>
        <Icon 
                                name="file-document-outline" 
                                color =  'black'
                                
                                size={22}
                                />
        </View>
      

    <View style={{flexDirection: 'column'}}>
      
        <Text style={{...style.blackText,fontWeight: 'bold', color: 'black',marginTop: '3%',marginStart: '10%'}}>{words.terms}</Text>
       
    </View>
    <View style={{position: 'absolute',right: 8,top: 8}}>

    <Icon 
                                name="chevron-right" 
                                color={Colors.primary}
                                
                                size={20}
                                />

    </View>

  
        </View>
            
            
        </TouchableOpacity>

    </View>
    <View style={{borderWidth: 0.20,bordercolor: 'gray',height: 0, width: '85%',alignSelf: 'center'}}/>


    {/**/}

    <View>
        <TouchableOpacity>
        <View style={{flexDirection: 'row',margin: '5%',marginTop: '7%'}}>

        <View style={{marginTop: '1%'}}>
        <Icon 
                                name="information-outline" 
                                color =  'black'
                                
                                size={22}
                                />
        </View>
      

    <View style={{flexDirection: 'column'}}>
      
        <Text style={{...style.blackText,fontWeight: 'bold', color: 'black',marginTop: '3%',marginStart: '15%'}}>{words.contact}</Text>
       
    </View>
  

  
        </View>
            
            
        </TouchableOpacity>

    </View>

    <View>
        <TouchableOpacity onPress={()=>{
            if(phone.trim() != '')
                Linking.openURL(`tel:${phone}`);
        }}>
        <View style={{flexDirection: 'row',margin: '5%',marginTop: '1%'}}>

        <View style={{marginTop: '1%',marginStart: '10%'}}>
        <Icon 
                                name="phone-outline" 
                                color =  'black'
                                
                                size={22}
                                />
        </View>
      

    <View style={{flexDirection: 'column'}}>
      
        <Text style={{...style.blackText,fontWeight: 'bold', color: 'black',marginTop: '5%',marginStart: '17%'}}>{phone}</Text>
       
    </View>
    <View style={{position: 'absolute',right: 8,top: 8}}>

    <Icon 
                                name="chevron-right" 
                                color={Colors.primary}
                                
                                size={20}
                                />

    </View>

  
        </View>
            
            
        </TouchableOpacity>

    </View>



    <View>
        <TouchableOpacity onPress={()=>{
            if(email.trim() != '')
            sendFeedback(email,'','')
        }}>
        <View style={{flexDirection: 'row',margin: '5%',marginTop: '1%'}}>

        <View style={{marginTop: '1%',marginStart: '10%'}}>
        <Icon 
                                name="email-edit-outline" 
                                color =  'black'
                                
                                size={22}
                                />
        </View>
      

    <View style={{flexDirection: 'column'}}>
      
        <Text style={{...style.blackText,fontWeight: 'bold', color: 'black',marginTop: '5%',marginStart: '17%'}}>{email}</Text>
       
    </View>
    <View style={{position: 'absolute',right: 8,top: 8}}>

    <Icon 
                                name="chevron-right" 
                                color={Colors.primary}
                                
                                size={20}
                                />

    </View>

  
        </View>
            
            
        </TouchableOpacity>

    </View>

    <View style={{borderWidth: 0.20,bordercolor: 'gray',height: 0, width: '85%',alignSelf: 'center'}}/>

    {/*Feedback*/}
    <View>
    <View style={{flexDirection: 'row',margin: '5%',marginTop: '1%'}}>

<View style={{marginTop: '4%'}}>
<Icon 
                        name="information-outline" 
                        color =  'black'
                        
                        size={22}
                        />
</View>


<View style={{flexDirection: 'column'}}>

<Text style={{...style.blackText,fontWeight: 'bold', color: 'black',marginTop: '14%',marginStart: '17%'}}>{words.feedback}</Text>

</View>


</View>

<TextInput style={style.feedback}
value = {content}
onChangeText = {(content) => {
    setContent(content);
}}
multiline>

</TextInput>

<View style={{marginTop: '2%'}}>
<SubmitButton text='Send Feedback'
onTouch={() => {
    sendFeedback(
    'anamxali1@gmail.com',
    `Feedback from user`,
    content
    
).then(() => {
    console.log('Successful');
});
}} />
</View>



</View>

  
    

    </View>
    </ScrollView>



    </View>
    </View>)
};

const style = StyleSheet.create({
    container: {
        backgroundColor:'white',
        
       
        
    },
    heading: {
        fontSize: 22,
        color: 'black',
        fontWeight: '900',
        margin: '2%',
        marginTop: '20%',
        marginStart: '3%'
    },
    blackText: {
        margin: '1%',
        fontWeight: 'bold',
   
        fontSize: 14,
      
        marginTop: '1%'
    },
    feedback: {
        borderWidth: 0.15,
        width: Dimensions.get('window').width-30,
      
       
      
        borderRadius: 2,
        margin: '3%',
        padding: 10,
        maxHeight: Dimensions.get('window').height/3,
       
        alignSelf: 'center',
        flex: 1
     
    }
});

export default SupportFAQ;