import React, { useState ,useEffect} from 'react';
import {View, StyleSheet, Text, Dimensions,Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { dimen,Colors, Styles } from '../Constants';

const SmallAppliance = ({name,small, quantity, price,image,onAdd,selectedQuantity,onRemove,remove,item,index,initquan,schedule}) => {
    const [number,setNumber] = useState( parseInt(initquan));
    const [gap,setGap] = useState(0);
    const [added,setAdded] = useState(false)

    useEffect(()=>{
        setNumber(parseInt(initquan));
    },[initquan])

    const renderAddSubtract =()=>{
        if(schedule)
            return(<View style={{backgroundColor: 'pink',flexDirection: 'row'}}>
            <Text style={{...Styles.subbold,fontSize: 10,color:'gray',marginHorizontal:3,backgroundColor: 'yellow'}}>{'Quantity: '+initquan} </Text>
            </View>);

        return (
            remove ? (<View style={{flex: 1,margin: '2%'}}>
                 <TouchableOpacity onLayout={({nativeEvent}) => {
                    setGap(nativeEvent.layout.height)
            }}
            onPress = {() => {
                onRemove(index)

                
            }}
            style={style.button}>
            <Text style={{color: Colors.primary,fontWeight: 'bold',color: Colors.primary} }>{'Remove'}</Text>
            </TouchableOpacity>
            <View style = {added ? {...style.quantityPick,marginTop: '20%',backgroundColor: 'Colors.buttonEnabledGreen'} :{...style.quantityPick,marginTop: '20%'} }>
   
   <TouchableOpacity style={style.minus} onPress={() => {
       setNumber(number!=1 ? number-1 : number)
       selectedQuantity = number;
       console.log(selectedQuantity)
       if( remove)
            onAdd(number!=1? number-1: number);
        
   }}>
   
   <Text style={added ? {fontSize: 17,color: 'gray',alignSelf: 'center',fontWeight: 'bold',borderRightColor: Colors.seperatorGray,borderRightWidth: 0.7,paddingRight: 6,color: 'white'} : {fontSize: 17,color: 'gray',alignSelf: 'center',fontWeight: 'bold',borderRightColor: Colors.seperatorGray,borderRightWidth: 0.7,paddingRight: 6,color: Colors.primary}}>-</Text>


   </TouchableOpacity>


<Text style ={added ? {fontWeight: 'bold',color:'white'} : {fontWeight: 'bold'}}>{number}</Text>


<TouchableOpacity style={style.plus} onPress={() => {
setNumber(number+1)
if(remove)
    onAdd(number+1);
}}>

<Text 
style={added ? {fontSize: 17,color: 'white',
alignSelf: 'center',fontWeight:'bold',borderLeftColor: Colors.seperatorGray,borderLeftWidth: 0.7,paddingLeft: 6} :{fontSize: 17,color: Colors.primary,alignSelf: 'center',fontWeight:'bold',borderLeftColor: Colors.seperatorGray,borderLeftWidth: 0.7,paddingLeft: 6} }>+</Text>
</TouchableOpacity>
</View>
                
                </View>

                )
                
                 : (<View style={{flex: 1,margin: '2%'}}>
            <TouchableOpacity onLayout={({nativeEvent}) => {
                    setGap(nativeEvent.layout.height)
            }}
            onPress = {() => {
               // if(added){
                    //alert('Item removal possible from the cart');
                //    onRemove(index);
                //}
                //else
                 //   showSnackbar();
                    onAdd(number);
                //setAdded(!added);
                
                //setAdded(!added);

                
            }}
            style={added ? {...style.button,backgroundColor: Colors.buttonEnabledGreen,borderColor:Colors.buttonEnabledGreen} : style.button}>
            <Text style={added ? {color: Colors.primary,fontWeight: 'bold',fontStyle: 'italic',color: 'white'} :{color: Colors.primary,fontWeight: 'bold',color: Colors.primary} }>{added ? 'Add' : 'Add'}</Text>
            </TouchableOpacity>

        <View style = {added ? {...style.quantityPick,marginTop: '20%',backgroundColor: Colors.buttonEnabledGreen} :{...style.quantityPick,marginTop: '20%'} }>
   
            <TouchableOpacity style={style.minus} onPress={() => {
                setNumber(number!=1 ? number-1 : number)
                selectedQuantity = number;
                console.log(selectedQuantity)
                if( remove)
                    onAdd(number!=1 ? number-1 : number);
                //quanchange(selectedQuantity);
            }}>
            
            <Text style={added ? {fontSize: 17,color: 'gray',alignSelf: 'center',fontWeight: 'bold',borderRightColor: Colors.seperatorGray,borderRightWidth: 0.7,paddingRight: 6,color: 'white'} : {fontSize: 17,color: 'gray',alignSelf: 'center',fontWeight: 'bold',borderRightColor: Colors.seperatorGray,borderRightWidth: 0.7,paddingRight: 6,color: Colors.primary}}>-</Text>


            </TouchableOpacity>


   <Text style ={added ? {fontWeight: 'bold',color:'white'} : {fontWeight: 'bold'}}>{number}</Text>

  
<TouchableOpacity style={style.plus} onPress={() => {
   setNumber(number+1)
   if(remove)
        onAdd(number+1);
}}>

   <Text 
   style={added ? {fontSize: 17,color: 'white',
   alignSelf: 'center',fontWeight:'bold',borderLeftColor: Colors.seperatorGray,borderLeftWidth: 0.7,paddingLeft: 6} :{fontSize: 17,color: Colors.primary,alignSelf: 'center',fontWeight:'bold',borderLeftColor: Colors.seperatorGray,borderLeftWidth: 0.7,paddingLeft: 6} }>+</Text>
</TouchableOpacity>
</View>

        </View>)
        )
    }

    return(<View style={{flexDirection: 'row',padding:'1%'}}>
    <View style={{...style.container,flex:1}}>
     
    
    <View style={{flex:1}}>

        <Text numberOfLines={1} style={style.name}>{name}</Text>
        <View style={{flexDirection: 'row'}}>
       
        <Text style={{...style.price,fontSize:12}}>₹{price}</Text>
        <Text style={{...style.quantity,fontSize:10}}>{quantity}</Text>
        </View>
       
        
        </View>
        <Image style={style.image} source={{uri: image}}/>
       
        </View>
        <View style={{alignItems: 'flex-end',justifyContent: 'flex-end',marginBottom: '4%'}}>
        {
            renderAddSubtract()



        }
        
        
        </View>
      
        </View>)
        
        
};
const style = StyleSheet.create({
    container: {
       height:Dimensions.get('window').height/10,
       margin: '1%',
       flex:1,
    //    width: Dimensions.get('window').width,
       flexDirection: 'row',
  //    flex:4,
   //    borderWidth: 1,
        padding: 5
    },
    name: {
        marginStart: 88,
        fontWeight: 'bold',
        fontSize: 14,
        padding: 5,
        color: 'gray'
    //    backgroundColor: 'white'
        
    },
    quantity: {
        marginStart: '3%',
   //     color: 'black',
        fontSize: 11,
        marginTop: '6%',
        padding: 5,
        alignSelf: 'center'
       
    },
    price: {
        marginStart: 88,
        
        fontWeight: 'bold',
        fontSize: 15,
      //  marginTop: '6%',
        padding: 5
      

    },
    image: {
        width: 60,
        height: 60,
        position: 'absolute',
        marginStart: '8%',
        
        
        marginTop : '5%'
        
       
    },
    quantityPick:{
        flexDirection: 'row',
         
        aspectRatio:4/1.5,
        borderColor: Colors.primary,
        borderWidth: 1.5,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginStart: '10%',
       
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: '%'
        
       
        

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
        marginTop: '4%'


    }
           
});



export default SmallAppliance;