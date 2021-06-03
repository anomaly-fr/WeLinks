import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { Styles } from '../Constants';
import AppBar from '../components/ui_components/AppBar';
import Axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { Config } from '../Constants';

export default function PrivacyPolicy({ navigation, route }) {
  
  const [policy, setPolicy] = useState('Loading.....');

  const samplePolicy = [{
    'content': ``
  }]
  useEffect(() => {
    Axios.get(Config.api_url + 'php?action=getPrivacyPolicy', {
      'Accept-Encoding': 'gzip'
    }
    ).then((result) => {
      //  console.log("k " +result.data.privacy_policy)
      setPolicy(result.data.privacy_policy)




    }).catch((error) => {
      console.log("Error fetching Privacy Policy: " + err);
      setPolicy(samplePolicy);

    });
  });
  return (<View>
    <AppBar back={true} funct={() => {
      navigation.pop();
    }} />

    <View style={Styles.parentContainer}>
      <Text style={styles.heading}>Privacy Policy</Text>
      <View style={Styles.grayfullline} />
      <ScrollView>
        <View>
          <Text style={{ margin: '5%' }}>{policy}</Text>
        </View>
      </ScrollView>
    </View>
  </View>)
}

const styles = StyleSheet.create({
  heading: {
    color: 'black',
    margin: '5%',
    fontSize: 20,
    marginVertical: '5%',
    fontWeight: 'bold'
  }

})

