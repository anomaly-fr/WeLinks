import React,{useState} from 'react';
import {Text,View,StyleSheet,TextInput, Dimensions} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import {Colors} from '../Constants';


const renderStars = (number) => {
    const [gap,setGap] = useState(0);
    
const filledStar=<FontAwesome name='star' color={Colors.ratingStars} size={16} />;
const outlinedStar=<View onLayout={({nativeEvent}) => {
    setGap(nativeEvent.layout.height);
    
}}>
<FontAwesome name='star-o' color="black" size={16} />
</View>;
const halfStar=() => (<View style={{height:gap}}>
<FontAwesome name='star-o' color="black" size={16} />
<FontAwesome name='star-half' color={Colors.ratingStars} size={16} style={{zIndex: 50,position:'absolute'}}/>
</View>);

    let full=0,half=0,outline=0;
    const frac = number - Math.floor(number);
    number = number-frac;
    full=number;

    if(frac>= 0.25 && frac<=0.75)
    half=1;

    if(frac>0.75)
    {
        full++;
        outline--;
    }

    outline=5-(full+outline+1);
 //   console.log(full+outline)
    let stars=[];
    for(let i=0;i<full;i++)
    stars.push(filledStar)
    for(let i=0;i<half;i++)
    stars.push(halfStar())
    for(let i=0;i<outline;i++)
    stars.push(outlinedStar)

    return(stars);

  



}

const Stars = ({number}) => {

   // number=3;

    return(<View style={style.container}>
    {renderStars(number)}
        

       
        
    </View>)
    
};


const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '2%',
        alignItems: 'center',
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        borderWidth:1,
        backgroundColor:'blue',
        alignSelf:'flex-start'
    },
    invisible: {
        opacity: 0,
        
    },
    visible: {
        opacity: 1
    },
    

});

export default Stars;