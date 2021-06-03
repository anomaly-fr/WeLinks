import * as React from 'react';
import {Text,View,StyleSheet,navigator,FlatList, Dimensions} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import Qs from 'qs';
import * as axios from 'axios';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {Config} from  '../Constants';




export default class AddressSearch extends React.Component{
    constructor(props){
        super(props);
            this.location={
                region:{
                }
            }
            this.state={
              arraydata: []
            };
            this.data=[];

            
            
    }

    onComeBack= (item)=>{
      if( item)
        this.retrieveAddresses();
    }



    retrieveAddresses= async ()=>{
      try{
        var data=[];
        const jsonvalue=  await AsyncStorage.getItem('addresses');
        data= JSON.parse(jsonvalue);
        console.log(data);
        if(data!=null){
          this.data= JSON.parse(jsonvalue);
          this.setState({arraydata: data})
        }
        else{
          this.setState({arraydata: []});
        }
      }
      catch(error){}
    }

    componentDidMount(){
      this.retrieveAddresses();
      console.log('mount');
      Axios.get(Config.api_url+'php?action=getUserAddresses&'+qs.stringify({
        user_id: 1
      })).then((response)=>{
        console.log('response',response.data);

      },(error)=>{
        console.log('error',error);
      })
      
      
    }
    setSelectedAddress= async (item)=>{
      const jsonString= await JSON.stringify({firstLogin: false})
      await AsyncStorage.setItem('firstLogin',jsonString);
      const jsonAddress= await JSON.stringify(item);
      await AsyncStorage.setItem('selectedAddress',jsonAddress);
      this.props.navigation.navigate('Homescreen');
      

    }

    renderSavedAddress=({item})=>{
      return(
        <View style={styles.horiz}>
          <ScrollView>
          <Text style={styles.address}>{item.text}</Text>
          </ScrollView>
          <TouchableOpacity style={{borderWidth: 2, borderColor: 'gray',padding: 5,alignSelf: 'center',marginTop: 20}} onPress={()=>{
            this.setSelectedAddress(item)
          }}>
            <Text style={{padding: 5,fontSize: 10}}>SELECT</Text>
          </TouchableOpacity>
        </View>
      );
    }

    addressSelected =async (data,details) =>{
      const actualUser= this.props.route.params.actualUser;
      console.log(details);
      console.log(details.place_id);
      axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
          place_id: details.place_id,
          key: 'AIzaSyAghIaP3yetD5ooDpwcAK5GF0b6-YkpV8w'
        }
      }).then((response)=>{
        var locy= response.data.results[0].geometry.location;
        console.log(locy);
        this.props.navigation.navigate('AddAddress',{
          onComeBack: this.onComeBack,
          initialCamera: {
            center:{
            latitude: locy.lat,
            longitude: locy.lng,
            },
            pitch: 0,
            heading: 0,
            zoom: 14

          },
          actualUser: actualUser
        })
      });
      
    
    }

    render(){
        return(
          <View style={styles.container}>
            <View style={{...styles.container,zIndex: -10,backgroundColor: 'rgba(0,0,0,0)',height: '40%'}}>
            <GooglePlacesAutocomplete
              query={{
                key: 'AIzaSyAWOAzPnGPVoGCxK7pMgU4TZx6sZQNiofQ',
                language: 'en', // language of the results
                components: 'country:in',
                location: '12.972442,77.580643',
                radius: 100000
              }}
              onPress={this.addressSelected}
              onFail={error => console.error(error)}
              styles={placesstyle}   
              currentLocation= {true}
              currentLocationLabel= "Select current Location"
            />
            </View>
            <View style={styles.savedaddresspanel}>
          <Text style={styles.address}>SAVED ADDRESSES</Text>
            <FlatList 
            data={this.state.arraydata.reverse()}
            renderItem={this.renderSavedAddress}
            keyExtractor={(item,index)=> Math.random().toString(36).substr(2, 10)}
            />
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
  savedaddresspanel:{
    position: 'absolute',
    top: '30%',
    zIndex: 100,
    bottom: 0,
    right: 0,
    left: 0
  },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      flexDirection: 'column',
      backgroundColor: '#ecf0f1',
      padding: 0,
    },
    address:{alignSelf: 'center', fontSize: 14,padding: 10,fontWeight: 'bold',
          width: '85%',
        maxHeight: 100},
    horiz:{
      width: Dimensions.get('window').width-50,
      height: 150,flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }

    
    
  });

  const placesstyle=StyleSheet.create({
    listView:{
      zIndex: 100,
    },
    textInputContainer:{
      width: '100%',
      backgroundColor: 'white'
    },

    textInput:{
        fontWeight: 'bold',
        fontSize: 17,
        padding: 40,
    },
    row:{
        padding: 10,
        backgroundColor: 'white',
        margin: 5

    },
  })