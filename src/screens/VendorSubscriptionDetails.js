import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Styles, dimen, Colors } from '../Constants';
import AppBar from '../components/ui_components/AppBar';
import { AntDesign } from '@expo/vector-icons'
import LottieView from 'lottie-react-native';




export default function VendorSubscriptionDetails({ navigation, route }) {
   const {cardDetails,tag} = route.params; 
    const [expanded, setExpanded] = useState(false);
    const [cancelClicked, setCancelClicked] = useState(0);
   
    const [loadingState, setLoading] = useState(false);
    //   console.log("ITEM"+JSON.stringify(item));



    const cancelButtonClicked = () => {
    
    }

    const renderLoading = () => {
        if (loadingState === false)
            return null;

        return (
            <View style={{ opacity: 0.8, position: 'absolute', zIndex: 100, top: 0, bottom: 0, left: 0, right: 0 }}>
                <LottieView
                    enableMergePathsAndroidForKitKatAndAbove
                    style={{ flex: 1, padding: 50, margin: 50 }} source={require('../../assets/animations/logistics.json')} resizeMode={'contain'} autoPlay={true} loop={true} />
            </View>
        )
    }


    const renderDays = () => {
        let dayText = [],i;
        const days = ['M','T','W','T','F','S','S']
       
        let dayString = "";
   
        console.log("d "+cardDetails.days[0])
         cardDetails.days.includes('monday') ? dayString = dayString.concat("Y") : dayString =  dayString.concat("N")
         cardDetails.days.includes('tuesday') ? dayString = dayString.concat("Y") : dayString =  dayString.concat("N")
         cardDetails.days.includes('wednesday')  ? dayString = dayString.concat("Y") : dayString =  dayString.concat("N")
         cardDetails.days.includes('thursday') ? dayString = dayString.concat("Y") : dayString =  dayString.concat("N")
         cardDetails.days.includes('friday') ? dayString = dayString.concat("Y") : dayString =  dayString.concat("N")
         cardDetails.days.includes('saturday')  ? dayString = dayString.concat("Y") : dayString =  dayString.concat("N")
         cardDetails.days.includes('sunday') ? dayString = dayString.concat("Y") : dayString =  dayString.concat("N")

         for(i in days){
             dayText.push(<Text style={{fontWeight: 'bold',color: dayString[i] == 'Y' ? Colors.primary : 'gray',fontSize:13}}>{days[i]+" "}</Text>)
         }


         return <View style={{flexDirection:'row'}}>
             {dayText}
             <Text style={{...Styles.subbold,color:'gray',fontSize:12,fontWeight: 'bold'}}> · {cardDetails.quantity}</Text>

         </View>
    }

    return (

        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {renderLoading()}
            <AppBar
                title={'Subscription Details'}
                back funct={() => { navigation.pop() }} />

            <ScrollView style={{ flex: 1 }}>
                <View style={{ marginTop: dimen.height / 16, flex: 16 }}>
                    <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10 }} activeOpacity={0.8} onPress={() => setExpanded(!expanded)} >
                        {route.params.card}
                    </TouchableOpacity>
                    <View style={expanded ? styles.collapsedAccordion : styles.collapsedAccordion}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(!expanded)}  >
                            <View style={expanded ? { ...styles.expandableRow, paddingBottom: 20 } : styles.expandableRow}>
                                <Text style={{ ...Styles.subbold, fontWeight: 'bold',marginLeft: dimen.sHm  }}>Item</Text>
                                <AntDesign color='black' size={17} style={{color: 'black',fontStyle: 'bold',marginHorizontal:'2%'}} name={expanded ? "up" : "down"} />
                            </View>
                        </TouchableOpacity>
                        {expanded ? 
                            <View style={styles.marinRow}>
            <Image style={{...styles.mainImage,flex: 1}} source={{uri: cardDetails.productImage}}/>
                <View style={{...styles.mainColumn,flex: 2}}>
                    <Text numberOfLines={1} style={styles.rname}>{cardDetails.productName}</Text>
                    {renderDays()}
                    <View style={{flexDirection: 'row',alignSelf: 'flex-start'}}>
                        <Text style={styles.rprice}>{"Order Total : ₹"+cardDetails.orderAmount}</Text>
                    </View>
                    <Text style={styles.rprice}>{"Number of deliveries : " +cardDetails.deliveries}</Text>

                </View>
           
        </View>: null}
                    </View>
    
                </View>
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    collapsedAccordion: {
        marginHorizontal: 20,
        marginVertical: 5,
        paddingBottom: 10,
        borderColor: Colors.seperatorGray,
        borderRadius: 15,
        borderWidth: 1,
        paddingVertical: 10,
        alignContent: 'center'

    },
    expandableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center'

    },
    cancelButton: {
        marginTop: 30,
        marginBottom: 20

    },  addRemoveContainer:{
        flex: 1,
        marginRight: dimen.sHm
    },
    marinRow:{
        flexDirection: 'row',
        marginHorizontal: dimen.width/30,
        justifyContent: 'flex-start',
        marginBottom: dimen.sVm
    },
    mainImage:{
        alignSelf: 'flex-start',
        flex: 1,
        aspectRatio: 1

    },
    mainColumn:{
        flexDirection: 'column',
        flex: 2.5,
        justifyContent: 'flex-start',
        marginStart: dimen.width/30


    },
    rprice:{
        fontWeight: 'bold',
        fontSize: 13,
        color: 'gray',
        marginTop:6
        //padding: 5

    },
    rquantity:{
        color: 'gray',
        fontSize: 11,
        marginStart: '2%',
        alignSelf: 'center',
        marginTop:6
        //padding: 5,

    },
    rname:{
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
        marginBottom: 4
        //padding: 5
    },
    container: {
        backgroundColor: Colors.whiteBackground,
       height:Dimensions.get('window').height/6,
    //    width: Dimensions.get('window').width,
       flexDirection: 'row',
      flex:4,
       
        padding: 5
    },
    name: {
        marginStart: 105,
        fontWeight: 'bold',
        fontSize: 16,
        padding: 5,
        color: 'black'
        
    },
    quantity: {
        marginStart: '3%',
        color: 'gray',
        fontSize: 11,
        marginTop: '4%',
        padding: 5,
        alignSelf: 'center',
        // color: 'black'
       
    },
    price: {
        marginStart: 105,
        // color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: '3%',
        padding: 5
      

    },
    image: {
        width: 70,
        height: 70,
        position: 'absolute',
        marginStart: '8%',
        
        
        marginTop : '3%'
        
       
    },
    quantityPick:{
        flexDirection: 'row',
         
        aspectRatio:4/1.5,
        borderColor: Colors.primary,
        borderWidth: 1.5,
        borderRadius: 20,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'space-evenly'
        
        
       
        

    },
    plus: {
        alignSelf: 'center'
    },
    button:{
        borderRadius: 5,
        borderWidth: 1,

        borderColor: Colors.primary,
   
    //    maxHeight: Dimensions.get('window').height / 33,
         width: Dimensions.get('window').width / 4,
        
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: '3%'


    }
           


}
);