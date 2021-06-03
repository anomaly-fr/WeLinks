import React, { useState ,useEffect} from 'react';
import {View, StyleSheet, Text, Dimensions,Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { dimen,Colors, Styles } from '../Constants';

const Appliance = ({name,small, quantity, price,image,onAdd,selectedQuantity,onRemove,remove,item,index,initquan,schedule}) => {
    const [number,setNumber] = useState( parseInt(initquan));
    const [gap,setGap] = useState(0);
    const [added,setAdded] = useState(false)

    useEffect(()=>{
        setNumber(parseInt(initquan));
    },[initquan])

    const renderAddSubtract =()=>{
        if(schedule)
            return <></>;// aa
        // return (
        //     <View style={{...style.mainColumn,backgroundColor: 'black'}}>
        //                          <TouchableOpacity onLayout={({nativeEvent}) => {
        //             setGap(nativeEvent.layout.height)
        //     }}
        //     onPress = {() => {
        //         onRemove(index)

                
        //     }}
        //     style={style.button}>
        //     <Text style={{color: Colors.primary,fontWeight: 'bold',color: Colors.primary} }>{'Remove'}</Text>
        //     </TouchableOpacity>
        //     </View>
        // )

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
            <View style = {added ? {...style.quantityPick,marginTop: '4%',backgroundColor: Colors.buttonEnabledGreen} :{...style.quantityPick,marginTop: '4%'} }>
   
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

    if(schedule)
        return(
            <View style={style.marinRow}>
                <Image style={style.mainImage} source={{uri: image}}/>
                <View style={style.mainColumn}>
                    <Text numberOfLines={1} style={!small ? style.rname : {...style.rname,fontSize:14}}>{name}</Text>
                    <Text style={{...Styles.subbold,marginBottom:4,color:'gray'}}>{'Quantity: '+initquan} </Text>
                    <Text style={!small ? style.rprice : {...style.rprice,fontSize:12}}>{"Rate: ₹"+price}</Text>
                    <View style={{flexDirection: 'row',alignSelf: 'flex-start'}}>
                        <Text style={!small ? style.rprice : {...style.rprice,fontSize:12,marginBottom:4}}>Amount: ₹{price*initquan}</Text>
                        <Text style={!small ? style.rquantity : {...style.rquantity,fontSize:10}}>{quantity}</Text>
                    </View>
                </View>
            </View>
        )

    return (
        <View style={style.marinRow}>
            <Image style={{...style.mainImage,flex: 1}} source={{uri: image}}/>
                <View style={{...style.mainColumn,flex: 2}}>
                    <Text numberOfLines={1} style={!small ? style.rname : {...style.rname,fontSize:14}}>{name}</Text>
                    <Text style={{...Styles.subbold,color:'gray',fontSize:13}}>{'Quantity: '+initquan} </Text>
                    <View style={{flexDirection: 'row',alignSelf: 'flex-start'}}>
                        <Text style={!small ? style.rprice : {...style.rprice,fontSize:10}}>₹{price}</Text>
                        <Text style={!small ? style.rquantity : {...style.rquantity,fontSize:10}}>{quantity}</Text>
                    </View>
                </View>
            <View style={style.addRemoveContainer}>
                {renderAddSubtract()}
            </View>
        </View>
    )

    return(<View style={{flexDirection: 'row',backgroundColor: Colors.whiteBackground}}>
    <View style={small ? null : {...style.container,flex:2}}>
     
    
    <View>
    <Text numberOfLines={1} style={!small ? style.name : {...style.name,fontSize:14}}>{name}</Text>
                   
                    <View style={{flexDirection: 'row'}}>
                        <Text style={!small ? style.price : {...style.price,fontSize:12}}>₹{price}</Text>
                        <Text style={!small ? style.quantity : {...style.quantity,fontSize:10}}>{quantity}</Text>
                    </View>

        
        

       
        
        </View>
        <Image style={style.image} source={{uri: image}}/>
       
        </View>
        
        {
            renderAddSubtract()
        }
        
        
        
        </View>)
        
        
};
const style = StyleSheet.create({
    addRemoveContainer:{
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
           
});



export default Appliance;