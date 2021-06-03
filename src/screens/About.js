import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import SubmitButton from '../components/SubmitButton';
import TextBox from '../components/ui_components/TextBox';
import { Styles, dimen, Colors } from '../Constants'
import { ScrollView } from 'react-native-gesture-handler';
import City from './City';
import Axios from 'axios';
import qs from 'qs';
import LottieView from 'lottie-react-native';
import AppBar from '../components/ui_components/AppBar';
import { Config } from '../Constants';
import { useAuth } from '../services/auth-service';

const About = ({ navigation, route, getUserDetails, user }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [referral, setReferral] = useState(' ');
    const [aboutDone, setAboutDone] = useState(false);
    const [edit, setEdit] = useState(route === undefined ? false : true);
    const [actualUser, setActualUser] = useState(route != undefined ? route.params.actualUser : null);
    const [loading, setLoading] = useState(false);
    const [pressed, setPressed] = useState(false);
    let staticName = '';
    let staticEmail = '';
    const authContext = useAuth();


    function validateEmail() {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
            return (true);
        alert("You have entered an invalid Email Address!")
        return (false)
    }

    useEffect(() => {
        if (actualUser != undefined) {
            setEmail(actualUser.email);
            setName(actualUser.name);
        }
    }, [])


    const aboutSubmit = async () => {

        console.log(validateEmail());
        if (validateEmail() && name.trim() != '') {
            try {
                if (edit) {
                    Axios.post(Config.api_url + 'php?action=editUserProfile&' + qs.stringify({
                        user_id: actualUser.user_id,
                         name,
                         email
                    })).then((response) => {
                        setLoading(false);
                        alert('Your changes have been saved successfully');
                        navigation.goBack();
                        authContext.sync();

                    }, (error) => {
                        console.log(error);

                        alert('An unexpected error occured while contacting the servers, kindly try again later');
                        navigation.goBack();
                    })
                    setLoading(true);

                }
                else
                    setAboutDone(true);
            }
            catch (error) {
                alert('something');
            }
        }
        else {
            Alert.alert('Invalid mail', 'Please enter a valid email ID');
        }
    }

    if (aboutDone)
        return (<City user={user} prevScreen="About" setAboutDone={setAboutDone} userDetails={{ email: email, name: name }} getUserDetails={getUserDetails} route={{ params: { edit: false } }} />);

    if (loading)
        return (
            <View style={{ ...StyleSheet.absoluteFill, backgroundColor: 'white' }}>
                <LottieView
                    enableMergePathsAndroidForKitKatAndAbove
                    style={{ flex: 1, padding: 50, margin: 50 }} source={require('../../assets/animations/logistics.json')} resizeMode={'contain'} autoPlay={true} loop={true} />
            </View>
        )



    return (<View style={style.mainContainer}>
        {edit ? (
            <AppBar title='My Profile' subtitle='Edit profile details' back={true} funct={() => {
                navigation.goBack();
            }} />
        ) : null}
        <ScrollView style={{ flex: 1, marginVertical: dimen.width / 20 }}>
            <Text style={style.text}>Tell us about yourself</Text>
            {
                edit ? (
                    <View>
                        <TextBox title='Name' defaultValue={name} hint='Enter your name' changeText={setName} />
                        <TextBox title='Email Address' defaultValue={email} hint='Enter your email address' changeText={setEmail} />
                    </View>
                ) :

                    (
                        <View>
                            <TextBox title='Name' defaultValue={name} hint='Enter your name' changeText={(text) => {
                                setName(text);
                                staticName = text;
                            }} />
                            <TextBox title='Email Address' defaultValue={email} hint='Enter your email address' changeText={(text) => {
                                setEmail(text);
                                staticEmail = text;
                            }}
                            />
                        </View>
                    )
            }

            <View style={Styles.submitButton}>

            </View>
        </ScrollView>
        <View style={{ marginVertical: 3, backgroundColor: Colors.primary, borderRadius: 7, alignSelf: 'center' }} >
            <SubmitButton styling={pressed} text={edit ? 'Update' : 'Continue'} onTouch={() => {
                aboutSubmit()
            }} />
        </View>
    </View>);


};

const style = StyleSheet.create({
    mainContainer: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'white',

    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',

        marginTop: 10,
        margin: '5%'
    }
});

export default About;

