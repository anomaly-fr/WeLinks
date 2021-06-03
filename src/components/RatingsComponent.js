import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {dimen, strings_screen,Colors} from '../Constants';


/*
    Renders stars and manages touch input
*/

//each rating is a number from 1 to 5 representing stars given.
export default function RatingComponent({starChanged = (rating)=>{}, initRatings = 0 ,numStars = 5}){
    const [ratingStars, setRatingStars] = useState([]);

    useEffect(()=>{
        const stars = [];
        for (var i = 0; i < numStars; i++)
            stars.push( i < initRatings )
        setRatingStars(stars);
    },[]);

    const starTouched = (index)=>{
        starChanged(index+1);
        const stars = [];
        for(var i = 0; i< numStars; i++)
            stars.push( i<= index);
        setRatingStars(stars);

    }

    return (
        <View style={style.container} >
            {
                ratingStars.map((star, index)=>{
                    return (
                        <TouchableOpacity  onPress={()=> starTouched(index)}>
                            <FontAwesome  name ={ star ? "star" : "star-o"} color = { star ? Colors.ratingStars : "black" } size={50}/>
                            {star ? <FontAwesome style={{position: 'absolute'}}  name = "star-o" color = {Colors.ratingStars} size = {50}/> : null }
                        </TouchableOpacity>
                    );
                })
            }
        </View>
    )


}

const style = StyleSheet.create({
    container:{
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
        paddingVertical: dimen.sVm,
        marginVertical: dimen.sVm
    },
    starContainer:{
        flex: 1,
        marginHorizontal: dimen.sHm
    }
});