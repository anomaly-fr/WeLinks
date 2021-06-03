import React from 'react';
import { View,Image,Text,StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { dimen,Colors } from '../Constants';


const UserHeader = ({user,address}) => (
<View style={styles.main}>
<Image style={styles.userImage} source={user.img_url.trim() != '' ? { uri: user.img_url } : require('../../assets/notmaleavatar.png')} />

    <View style={{ flex: 5, justifyContent: 'space-between', marginLeft: dimen.sHm }} >
    <Text style={ styles.username }>{user.name}</Text>
    <View style={ styles.address }>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="map-pin" size={12} color={Colors.black} />
            <Text style={{ fontSize: 13 }}>{" " + address.addr_name}</Text>
        </View>
        <Text numberOfLines={3} style={{ fontSize: 11 }}>{address.addr_details + ".\nLandmark: "}</Text>
        <View style={{ height: 0.5 }} />
        <Text numberOfLines={1} style={{ fontSize: 11 }}>Landmark: {address.addr_landmark}</Text>
    </View>
</View>
</View>
);

const styles=StyleSheet.create({
    main:{
        flexDirection: 'row', 
        marginBottom: dimen.mVm, 
        marginTop: dimen.height / 16 + dimen.mVm, 
        marginHorizontal: dimen.sHm, 
        justifyContent: 'flex-start', 
    

    },
    userImage:{
        aspectRatio: 1, 
        paddingHorizontal: dimen.width / 30, 
        flex: 2 

    },
    address: {
        marginTop: '3%',
        borderRadius: 5,
        backgroundColor: Colors.whiteBackground,
        borderColor: Colors.seperatorGray,
        borderWidth: 0.5,

        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 12,
        elevation: 1

    },
    username: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'black'
    }

})

export default UserHeader;
