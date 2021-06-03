import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, BackHandler, FlatList } from 'react-native';
import Vendor from '../components/Vendor';
import AppBar from '../components/ui_components/AppBar';
import { Styles } from '../Constants';
import Axios from 'axios';
import qs from 'qs';
import { useAuth } from '../../src/services/auth-service';
import { Config, dimen } from '../Constants';
import GenericSeperator from '../components/ui_components/GenericSeperator';
import UserHeader from '../components/UserHeader';


// This screen displays the list of all nearby milk vendors

const ProductVendors = ({route,navigation}) => {

    
    
    const { tag,address } = route.params;
    const type=tag;
    const user = useAuth().user;
    const [data, setData] = useState([]);  // stores all vendors



    const words = {
        desc: `${type} vendors in your locality`,
        noVendors: `There are no registered vendors in your locality`
    }


    const fetchVendors = async (t) => {
        if (t < 0)
            return;

        Axios.get(Config.api_url + 'php?action=getVendors&' + qs.stringify({
            vendor_type: type=='Newspaper'?'newspaper':'milk',
            lat: address.addr_latitude,
            lng: address.addr_longitude
        })).then((response) => {
            try {
                setData(response.data.vendor);
            }
            catch (error) {

                alert(`Error retrieving ${type} vendors`);
                fetchVendors(--t);
            }
        }, (error) => {

            alert(`Error retrieving ${type} vendors`);

            fetchVendors(--t);
        })
    }

    useEffect(() => {
        fetchVendors(10);
    }, []);



    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {

                navigation.navigate('AddressList');
                return true;

            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        })

    );



    return (<View style={{ flex: 1, backgroundColor: 'white' }}>
        <AppBar title={`${type} Vendors`}
            back
            funct={() => {
                navigation.pop();
            }} />
        <UserHeader user={user} address={address} />
        <View style={Styles.grayfullline} />
        <View style={style.heading}>
            <Text style={{ ...Styles.title, fontSize: 17, marginVertical: dimen.sVm }}>{words.desc}</Text>
        </View>

        {data.length == 0 ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14 }}>{words.noVendors}</Text>

        </View> :
            <FlatList
                data={data}
                keyExtractor={(item) => item.name}
                ItemSeparatorComponent={() => <GenericSeperator />}
                renderItem={({ item }) => {


                    const vendorName = item.company_name;
                    const vendorStars = item.avg_ratings;
                    const vendorReviews = item.reviews_number;
                    const vendorId = item.vendor_id;
                    let brandsString = '';
                    const vendorAddress = item.addresses[0] != undefined ? item.addresses[0].addr_details + ' ' + item.addresses[0].addr_landmark + ' ' + item.addresses[0].addr_pincode : ' '
                    const brands = item.brands != undefined ? item.brands : [];
                    for (let i = 0; i < brands.length - 1; i++)
                        brandsString = brandsString + brands[i].brand.toString() + ', ';
                    if (brands.length > 0)
                        brandsString = brandsString + brands[brands.length - 1].brand.toString();

                    const imageUrl = item.vendor_img_url;

                    return (
                        <Vendor name={vendorName} brands={brandsString} stars={item.avg_ratings} reviews={item.reviews_number} imageUrl={imageUrl}
                            onSelected={() => {

                                navigation.navigate('ProductVendor', {
                                    tag,
                                    address,
                                    vendorName,
                                    vendorStars,
                                    vendorReviews,
                                    vendorAddress,
                                    imageUrl,
                                    user,
                                    vendorId,
                                    
                                })


                            }}

                        />
                    )

                }}
            />}



    </View>)
};

const style = StyleSheet.create({
    header: {
        marginVertical: '5%',
        marginHorizontal: '2%',
        flex: 1

    },


    line: {
        borderWidth: 0.5,
        borderColor: 'gray',
        marginVertical: '2%',


    },

    avatar: {

        marginHorizontal: '3%',
        padding: '3%',
        alignSelf: 'flex-start',
        marginTop: '6%'




    }
});

export default ProductVendors;