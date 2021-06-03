import React,{useState, useEffect} from 'react';
import {View,TextInput,Text,StyleSheet,ScrollView, Alert,BackHandler,TouchableOpacity} from 'react-native';
import {Styles,dimen,Constants} from '../Constants';
import TextBox from '../components/ui_components/TextBox';
import Button from '../components/ui_components/Button';
import SubmitButton from '../components/SubmitButton';
import  DocumentPicker from 'react-native-document-picker';
import AppBar from '../components/ui_components/AppBar';
import { useFocusEffect,CommonActions,useNavigation, StackActions } from '@react-navigation/native';
import Axios from 'axios';
import qs from 'qs';
import auth from '@react-native-firebase/auth'
import VendorServices from './VendorServices';
import VendorDashboard from './VendorDashboard';
import {Config} from  '../Constants';
import LottieView from 'lottie-react-native'
import * as Location from 'expo-location';
import {useAuth} from '../services/auth-service';

export default function VendorRegistration({navigation,route}){
    const [aadharFile,setAadharFile] = useState(null);
    const [gstFile,setGSTFile] = useState(null);
    const [uri,setUri] = useState(null);
    const [verification,setVerification] = useState(Constants.veFirstTime); 
    const [user,setUser]=useState(route.params.user);
    const [actualUser,setActualUser]=useState(route.params.actualUser);
    const [name,companyName]=useState('');
    const [email,companyEmail]=useState('');
    const [gst,companyGstNumber]=useState('');
    const [address,setAddress]=useState(null);
    const [loading,setLoading]=useState(true);
    const {vendorRefresh} = route.params;
    const authContext = useAuth();

    function validateEmail() {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            return (true)
        }
        return (false)
    }

    
    const checkVendorStatus=()=>{
        Axios.get(Config.api_url+'php?action=getVendorStatus&user_id='+ actualUser.user_id,)
            .then((response)=>{
                console.log("HERE"+response.data)
                setVerification(Constants.veFirstTime) // uncomment this
            try{
                var status= response.data.vendor[0].vendor_status;
                if(status=== 'active')
                    setVerification(Constants.verified);
                else if(status=== 'inactive')
                    setVerification(Constants.veFirstTime)
                else
                    setVerification(Constants.veInProgress);
                //setVerification(Constants.veFirstTime);
                setLoading(false);
            }
            catch(error){
                setVerification(Constants.veFirstTime);
                setLoading(false);
            }
        });
        
    }


    

    useEffect(()=>{
    
        checkVendorStatus();
        
    },[]);

    const submitRegistration= (services,milk,paper,office,home)=>{
        setLoading(true);
        console.log(services);
        console.log(milk);
        console.log(paper);
        console.log(office);
        console.log(home);
        var fromData=new FormData();
        fromData.append('id_proof_document',{
            uri: aadharFile.uri,
            type:'image/jpeg',
            name: aadharFile.name
        });
        fromData.append('vendor_img_url',{
            uri: gstFile.uri,
            type:'image/jpeg',
            name: gstFile.name

        })

        
        var dataUnFormatted = qs.stringify({
            user_id: actualUser.user_id,
            company_name: name,
            vendor_gstin: gst,
            email: email,
            lat: 1,
            lng: 1,
            pincode: address.pincode,
            label: address.label,
            address: address.address,
            vendor_type: services,
            milk_product_ids : milk,
            news_product_ids: paper,
            officescrap_cat_ids: office,
            homescrap_product_ids: home


        });
        var replaer = new RegExp('%5B.%5D','g');
        var dataFormatted = dataUnFormatted.replace(replaer,'\[\]');
        Axios.post(Config.api_url+'php?action=registerVendor&'+dataFormatted,fromData).then((response)=>{
            console.log(response.data);
            checkVendorStatus();
            authContext.sync();
            setLoading(false);

        },(error)=>{
            console.log(error);
        })

        
    }

    const getChangesToBeMade= ()=>{
        return 'Picture in Aadhar card isn\'t proper'
    }
    const tryingAgain =()=>{

        setVerification(Constants.veFirstTime);
    }



    const fileselect =(filename)=>{
        try{
            
        }
        catch(e){}
    };
    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
         console.log('Can\'t go back from here');
         route.params.navDrawer.toggleDrawer();
    
                  
              return true;
            
          };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        },)
      );
    
    const completeStepOne=()=>{
        if(name.toString().trim()==='' || email.toString().trim() === '' || gst.toString().trim() === '')
            alert('Please fill all the fields and try again');
        else if(aadharFile === null || gstFile === null)
            alert('Please upload appropriate documents and try again');
        else if(address === null)
            alert('Please choose your address and try again');
        else if(!validateEmail())
            alert("You have entered an invalid Email Address!")
        else if(gst.length!=15|| /[^a-zA-Z0-9]/.test(gst))
            alert("Please enter a valid 15 digit gst number")
        else{
            navigation.navigate('VendorServices',{
                submit: submitRegistration,
                actualUser: actualUser,
                vendorEdit: false
            })
        }
    } 
    
    if(loading)
    return (
        <View style={{ ...StyleSheet.absoluteFill, backgroundColor: 'white' }}>
          <LottieView
            enableMergePathsAndroidForKitKatAndAbove
            style={{ flex: 1, padding: 50, margin: 50 }} source={require('../../assets/animations/logistics.json')} resizeMode={'contain'} autoPlay={true} loop={true} />
        </View>
      );

    
    // if(verification==67)
    //     return <VendorServices submit={submitRegistration} actualUser={actualUser} navigation={navigation} route={{params:{vendorEdit: false}}}/>
    if(verification === Constants.veFirstTime)
        return(
            <View style={{...StyleSheet.absoluteFill,backgroundColor: 'white'}}>
                <AppBar  title='Vendor Registration' funct={() => {
                    route.params.navDrawer.toggleDrawer();
        }} />
                <Text style={{...Styles.heading,alignSelf: 'center'}}>Tell us about your business</Text>    
                <View style={{marginTop: dimen.height/20,height: dimen.height*0.77}}>
                <ScrollView >
                    <TextBox title="NAME OF YOUR COMPANY" hint="Enter your company's name" changeText={companyName} />
                    <TextBox title="COMPANY EMAIL ADDRESS" hint="Enter company's E-mail address" changeText={companyEmail}/>
                    <TextBox title="COMPANY GST NUMBER" hint="Enter company's GST number" changeText={companyGstNumber}/>
                    <UploadButton title='GST CERTIFICATE' browseresult={fileselect} fileSetter={setGSTFile}/>
                    <UploadButton title='ADDRESS' buttonTitle='Map' setAddress={setAddress} actualUser={actualUser} />
                    <UploadButton title='AADHAR/VERIFICATION' browseresult={fileselect} fileSetter={setAadharFile}/>
                </ScrollView>
                </View>
                <SubmitButton onTouch={()=> {
                    completeStepOne()
                   }} 
                    text='Submit' />

            </View>
        )
    else if(verification === Constants.veInProgress)
            return(
               
                <View style={{...StyleSheet.absoluteFill,justifyContent: 'flex-start',backgroundColor: 'white'}}>
                        <View style={{height: dimen.appbarHeight}}>
                        <AppBar  funct={() => {
                            route.params.navDrawer.toggleDrawer();
        }} />
        </View>
        <TouchableOpacity 
                    onPress={()=>{
                        if(vendorRefresh != undefined){
                            try{
                                vendorRefresh();
                            }
                            catch(error){
                                console.log('error');
                            }
                        }
                    }}
                    style={{flex: 1}}
                >
        <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',padding: 20}}>
                <View>
                    <Text style={styl.head}>Your Application has been submitted</Text>  
                    <Text style={styl.subheading}>Please wait patiently until your application is verified, click anywhere on this screen to refresh</Text>      
                </View>
                </View>
                </TouchableOpacity>
            </View>
            
            )
    else if(verification ===Constants.veTryAgain)
            return(
                <View style={{...StyleSheet.absoluteFill,justifyContent: 'flex-start',backgroundColor: 'white'}}>
                        <View>
                        <AppBar  funct={() => {
        navigation.toggleDrawer();
        }} />
        </View>
        <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',padding: 20,backgroundColor: 'white'}}>
                <View>
                    <Text style={styl.head}>Your Application needs some changes to be approved</Text>  
                    <Text style={styl.subheading}>{getChangesToBeMade()}</Text>      
                </View>
                <View style={{padding: 10,position: 'absolute',bottom: 0,alignSelf: 'center'}}>
                    <SubmitButton text='Try Again' onTouch={()=>{tryingAgain()}}/>
                </View>

            </View>
            </View>
            )
    else if(verification === Constants.verified){
        
        navigation.navigate('VendorDashboard',{
            actualUser: actualUser
        });
        return (<View/>)
    }
       
                
}

const styl = StyleSheet.create({
    subheading:{...Styles.subheading,alignSelf: 'center',marginTop: dimen.height/30,width: dimen.width/1.5,textAlign: 'center',fontSize: 15},
    head:{
        ...Styles.heading,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 25,
        width: dimen.width/1.2
    }
})

const UploadButton =({hint,title,browseresult,fileSetter,actualUser,buttonTitle='Browse',setAddress})=>{
    const [filename,setFileName] = useState('Please select a file');
    const [uri,setUri] = useState(null);
    var navigation;
    try{
      navigation = useNavigation();
    }
    catch(e){}

    useEffect(()=>{
        if(buttonTitle == 'Map')
            setFileName('Please choose address');
    },[])

    const browse= async()=>{
        if(buttonTitle == 'Map'){
            let {status} = await Location.requestPermissionsAsync();
          if(status === Location.PermissionStatus.GRANTED){
            // TODO add loading screen animation
            var location = await Location.getCurrentPositionAsync();
            // TODO remove loading screen animation
            navigation.navigate('AddAddress',{
                type: 'vendorRegistration',
                callback: setAddress,
                actualUser: actualUser,
                addrNameSetter: setFileName,
              initialCamera: {
                center:{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                },
                pitch: 0,
                heading: 0,
                zoom: 14,
                type: 1
              
              },
              
            
          })
          } 
          else{
            alert("Please grant the location permissions in order to add an address");
          }

            return;
        }
            try{
                const res = await DocumentPicker.pick({type: [DocumentPicker.types.images,DocumentPicker.types.pdf]});
                setUri(res.uri);
                setFileName(res.name);
                console.log(res);
                console.log(res.size)
                if( (res.size/1000) >= 50){
                    Alert.alert('Size of the file should be lesser than 50kb')
                    setFileName('Please select a file');
                }
                fileSetter(res);
            }
            catch(err){
                if(DocumentPicker.isCancel(err)){
                    Alert.alert('Please select a valid file');
                }
            }
        
    }

    return (<View style={{width: '90%',marginHorizontal: dimen.width*0.05}}>
        <Text style={{...Styles.subheading,marginTop: dimen.height/50,color: 'black',fontSize: 15,fontWeight: 'bold'}}>{title}</Text>
        <View style={{...Styles.horizontalRow,marginTop: dimen.height/80,alignSelf: 'flex-start',marginLeft: 0,alignContent: 'space-between',width: '100%'}}>
            <Text style={{width: '70%'}}>{filename}</Text>
            <Button text={buttonTitle} onTouch={browse}/>
        </View>
    </View>)
}
