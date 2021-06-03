import * as React from 'react'
import { Text, Image, TouchableOpacity, Dimensions, StyleSheet, View, Animated } from 'react-native';
import MapView from 'react-native-maps'
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import SubmitButton from '../components/SubmitButton';
import * as Location from 'expo-location';
import Axios from 'axios';
import { Styles } from '../Constants';
import qs from 'qs';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Config, Colors, dimen } from '../Constants';

const height = dimen.height;
const width = dimen.width;
var lowerPanelHeight = height / 1.7;
var lowerAddressHeight = lowerPanelHeight / 3;
var panelTranslateAfter = (0);
var panelTranslate = (lowerPanelHeight - lowerAddressHeight);

// Adds new addresses for vendors or users

export default class AddAddress extends React.Component {
  constructor(props) {
    super(props);
    this.constants = {
      additionalInfoChars: 300,
      landmarkChars: 200,
      labelChars: 100
    },
      this.state = {
        circlemark: new Animated.Value(0),
        circleopacity: new Animated.Value(1),
        circlemarktrail: new Animated.Value(0),
        circleopacitytrail: new Animated.Value(1),
        bottomPanelAnimation: new Animated.Value(panelTranslateAfter),
        inputsValid: false,
        adding: false,
        additionalInfoChars: 0,
        landmarkChars: 0,
        labelChars: 0,
        type: props.route.params.type === 'vendorRegistration' ? 0 : 1,
        vendorEdit: props.route.params.vendorEdit,  // check
        arrowOpacity: new Animated.Value(0),
        marker: {
          title: 'Home',
          description: 'Move map around to place pin',
        },
        title: props.route.params.placeName,
        description: 'city',
        flexfor: 3,
        latitude: this.props.route.params.initialCamera.center.latitude,
        longitude: this.props.route.params.initialCamera.center.longitude,
        landmark: '',
        fineAddressInfo: '',
        label: '',
        pincode: ''
      };
    this.location = {
      latitude: this.props.route.params.initialCamera.center.latitude,
      longitude: this.props.route.params.initialCamera.center.longitude
    };
    this.errorMst = {};
    this.landmarkBox = null;
    this.placesstyle = StyleSheet.create({
      listView: {
        zIndex: 201,
      },
      textInputContainer: {
        width: '100%',
        backgroundColor: Colors.white
      },

      textInput: {
        fontWeight: 'bold',
        fontSize: 17,
        padding: 40,
      },
      row: {
        padding: 10,
        backgroundColor: Colors.white,
        margin: 5

      },
    })
  };



  addAddress = async () => {

    const { user_id } = this.props.route.params.actualUser;
    const { label, pincode, title, landmark, fineAddressInfo } = this.state;
    if (this.state.type === 0) {
      this.setState({ adding: true });
      this.props.route.params.callback({
        user_id: user_id,
        label: label,
        pincode: pincode,
        address: `${fineAddressInfo} ${title}`,  // check
        landmark: landmark,
        lat: this.location.latitude,
        lng: this.location.longitude
      });
      this.props.route.params.addrNameSetter(title);
      this.props.navigation.goBack();
    }
    else {

      if (this.state.title != 'loading') {
        const data = this.state.vendorEdit ? qs.stringify({
          vendor_id: this.props.route.params.vendor_id,
          label: label,
          pincode: pincode,
          address: title,
          landmark: landmark,
          lat: this.location.latitude,
          lng: this.location.longitude
        }) :
          qs.stringify({
            user_id: user_id,
            label: label,
            pincode: pincode,
            address: title,
            landmark: landmark,
            lat: this.location.latitude,
            lng: this.location.longitude
          });

        Axios.post(Config.api_url + 'php?action=addAddress&' + data,).then((response) => {
          console.log(response.data);
          this.setState({ adding: false });
          this.props.route.params.onComeBack(true);
          this.props.navigation.goBack();

        }, (error) => {
          console.log(error);
        })
        this.setState({ adding: true });
      }

    }

  };

  animations = () => {
    const { circlemark, circleopacity, circleopacitytrail, circlemarktrail, arrowOpacity } = this.state;

    //RippleCrircle
    Animated.loop(
      Animated.stagger(700, [
        Animated.sequence([
          Animated.parallel([
            Animated.timing(circlemark, {
              toValue: 1,
              duration: 1700,
              useNativeDriver: true
            }),
            Animated.timing(circleopacity, {
              toValue: 0,
              duration: 1700,
              useNativeDriver: true
            })
          ]),
          Animated.parallel([
            Animated.timing(circlemark, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true
            }),
            Animated.timing(circleopacity, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            })
          ])])
        ,
        Animated.sequence([
          Animated.parallel([
            Animated.timing(circlemarktrail, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true
            }),
            Animated.timing(circleopacitytrail, {
              toValue: 0,
              duration: 700,
              useNativeDriver: true
            })
          ]),
          Animated.parallel([
            Animated.timing(circlemarktrail, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true
            }),
            Animated.timing(circleopacitytrail, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            })
          ])])
      ])
    ).start();

    Animated.timing(arrowOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };
  backbutton = () => {
    console.log('back', 'button');
  };
  currentLocation = () => {
    console.log('current', 'location');
    this.map.animateCamera({
      center: {
        latitude: 13.2366,
        longitude: 76.669
      },
      pitch: 0,
      heading: 0,
      zoom: 15
    })
  };

  addressSelected = async (data, details) => {
    const actualUser = this.props.route.params.actualUser;
    console.log(details);
    console.log(details.place_id);
    Axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        place_id: details.place_id,
        key: process.env.API_KEY
      }
    }).then((response) => {
      var locy = response.data.results[0].geometry.location;
      console.log(locy);
      this.map.animateCamera(
        {
          center: {
            latitude: locy.lat,
            longitude: locy.lng
          },
          pitch: 0,
          heading: 0,
          zoom: 15
        }
        , { duration: 1000 });
    });
  }
  checkFieldsValidity = () => {
    if (this.state.landmark.trim().length < 2 || this.state.landmark.length > this.constants.landmarkChars || this.state.fineAddressInfo.trim().length < 2 || this.state.fineAddressInfo.length > this.constants.additionalInfoChars || this.state.label.trim().length < 2 || this.state.label.length > this.constants.labelChars)
      this.setState({ inputsValid: false });
    else
      this.setState({ inputsValid: true })
  };



  componentDidMount() {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      console.log('log', status);
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
      let location = await Location.getCurrentPositionAsync({});
      this.location = location
      console.log('loc', this.location);
      console.log('lat', this.location.coords.latitude);
    })();
    this.animations();
  };
  regionChanging = () => {
    this.setState({ title: 'loading', description: 'loading' })
    Animated.spring(this.state.bottomPanelAnimation, {
      toValue: panelTranslate,
      duration: 1000,
      useNativeDriver: true
    }).start();
    Animated.spring(this.state.arrowOpacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true
    }).start();
  };
  addressChanged = (parameter) => {
    this.location = {
      latitude: parameter.latitude,
      longitude: parameter.longitude
    }
    this.setState({ latitude: parameter.latitude, longitude: parameter.longitude })
    Axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: parameter.latitude + ',' + parameter.longitude,
        key: 'AIzaSyAghIaP3yetD5ooDpwcAK5GF0b6-YkpV8w'
      }
    }).then((response) => {
      try {
        var addressComponents = (response.data.results[0].address_components);
        var pincode = addressComponents[addressComponents.length - 1].short_name;
        console.log(pincode);

        var addresses = response.data.results[0];
        this.setState({ title: addresses.formatted_address });
        this.setState({ pincode: pincode })
      }
      catch (error) {
        this.setState({ title: 'Please move the pin to a valid location' });
      }
    });

    Animated.spring(this.state.bottomPanelAnimation, {
      toValue: panelTranslateAfter,
      duration: 1500,
      useNativeDriver: true
    }).start();

    Animated.timing(this.state.arrowOpacity, {
      toValue: 1,
      timing: 300,
      useNativeDriver: true
    }).start();

  };
  mapinit = () => { };

  onPress = () => { };

  render() {
    const { circlemark, circleopacity, circlemarktrail, circleopacitytrail, bottomPanelAnimation, arrowOpacity } = this.state;

    let submitButton;

    if (this.state.adding)
      return (
        <View style={{ ...StyleSheet.absoluteFill, backgroundColor: 'white' }}>
          <LottieView
            enableMergePathsAndroidForKitKatAndAbove
            style={{ flex: 1, padding: 50, margin: 50 }} source={require('../../assets/animations/logistics.json')} resizeMode={'contain'} autoPlay={true} loop={true} />
          <Text style={{ ...Styles.heading, textAlign: 'center', flex: 0, padding: 10, margin: 50, alignSelf: 'center' }}>Adding Address</Text>
        </View>
      )


    if (this.state.inputsValid)
      submitButton = (
        <SubmitButton text='Continue' onTouch={this.addAddress}
        />
      );
    else
      submitButton = (<View style={{ ...styles.submitButton }}>
        <SubmitButton text='Continue' onTouch={() => { var i = 5 }} otherColor={'gray'}
        />
      </View>);

    return (
      <View style={styles.mainContainer} >
        <MapView style={{ height: height / 5 * 3.5, position: 'absolute', top: 0, width: '100%' }} mapstyle={mapstyle} ref={ref => this.map = ref}
          onTouchStart={this.regionChanging}
          onRegionChangeComplete={(region) => this.addressChanged(region)}
          onPanDrag={(event) => {
            try { this.googlePlaces.blur() }
            catch (error) { }
          }}
          showsCompass={false}
          pitchEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={true}
          initialCamera={this.props.initialCamera}
          onMapReady={() => {
            this.setState({ flexfor: 4 })
            this.map.animateCamera(this.props.route.params.initialCamera, {
              duration: 1500
            })
          }}
        >
        </MapView>
        <View style={{ flex: 1.5 }} />

        <Animated.View style={{ ...styles.lowerpanel, transform: [{ translateY: bottomPanelAnimation }], flex: 1 }} >
          <ScrollView style={styles.lowerhorizontal}>
            <Text style={styles.heading}>{this.state.title}</Text>
            <Text style={styles.otherHeading}>Additional Address Info:</Text>

            <TextInput ref={this.landmarkBox} placeholder={'Enter address details here like Flat/Door no'} accessibilityHint={'Additional Info'} style={styles.inputBox}
              onChangeText={(text) => {
                this.setState({ additionalInfoChars: text.length })
                this.setState({ fineAddressInfo: text })
                this.checkFieldsValidity()
              }} />
            <View style={{ ...styles.characterLimit, opacity: this.state.additionalInfoChars >= this.constants.additionalInfoChars ? 1 : 0, height: this.state.additionalInfoChars >= this.constants.additionalInfoChars ? 14 : 0 }}>
              <Ionicons style={{ margin: '1%', alignSelf: 'center' }} name="ios-information-circle-outline" size={18} color={Colors.red} />
              <Text style={{ color: Colors.red, alignSelf: 'center', fontSize: 14, fontWeight: 'bold', marginVertical: '2%' }}>{`Additional Info must be less than ${this.constants.additionalInfoChars} characters`}</Text>

            </View>
            <Text style={styles.otherHeading}> Landmark:</Text>
            <TextInput ref={this.landmarkBox} placeholder={'Enter landmark here'} accessibilityHint={'Landmark'} style={styles.inputBox}
              onChangeText={(text) => {
                this.setState({ landmarkChars: text.length })
                this.setState({ landmark: text })
                this.checkFieldsValidity()
              }} />

            <View style={{ ...styles.characterLimit, opacity: this.state.landmarkChars >= this.constants.landmarkChars ? 1 : 0, height: this.state.landmarkChars >= this.constants.landmarkChars ? 14 : 0 }}>
              <Ionicons style={{ margin: '1%', alignSelf: 'center' }} name="ios-information-circle-outline" size={18} color={Colors.red} />
              <Text style={{ color: Colors.red, alignSelf: 'center', fontSize: 14, fontWeight: 'bold', marginVertical: '2%' }}>{`Landmark must be less than ${this.constants.landmarkChars} characters.`}</Text>

            </View>
            <Text style={styles.otherHeading}> Label:</Text>
            <TextInput ref={this.landmarkBox} placeholder={'Enter identificaiton label here'} accessibilityHint={'Label'} style={styles.inputBox}
              onChangeText={(text) => {
                this.setState({ labelChars: text.length })
                this.setState({ label: text })
                this.checkFieldsValidity()
              }} />

            <View style={{ ...styles.characterLimit, opacity: this.state.labelChars >= this.constants.labelChars ? 1 : 0, height: this.state.labelChars >= this.constants.labelChars ? 14 : 0 }}>
              <Ionicons style={{ margin: '1%', alignSelf: 'center' }} name="ios-information-circle-outline" size={18} color={Colors.red} />
              <Text style={{ color: Colors.red, alignSelf: 'center', fontSize: 14, fontWeight: 'bold', marginVertical: '2%' }}>{`Label must be less than ${this.constants.labelChars} characters.`}</Text>

            </View>


          </ScrollView>
          {submitButton}
        </Animated.View>



        <TouchableOpacity
          style={styles.backbuttoncontainer}
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Animated.Image style={{ ...styles.backbutton, opacity: arrowOpacity }} source={require('./../../assets/backbutton.png')} />
        </TouchableOpacity>



        <Image source={require('./../../assets/marker.png')} style={styles.marker} />
        <Animated.View style={{
          ...styles.anim, opacity: circleopacity, transform: [{
            scale: circlemark
          }]
        }} />
        <Animated.View style={{
          ...styles.animtrail, opacity: circleopacitytrail, transform: [{
            scale: circlemarktrail
          }]
        }} />
      </View>

    )
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    ...StyleSheet.absoluteFill,
    flex: 1,

  },
  inputBox: {
    width: '100%',
    borderBottomWidth: 0.3,
    borderBottomColor: 'gray',
    marginHorizontal: 30,
    alignSelf: 'center',
    borderStyle: 'dotted',
    marginBottom: 10,
    borderStyle: 'dashed'
  },
  mapview: {
    height: height / 5 * 2,
    width: '100%'
  },
  lowerpanel: {
    zIndex: 200,
    elevation: 0,
    height: lowerPanelHeight,
    bottom: 0,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'white',
    right: 0,
    left: 0,
    justifyContent: 'space-between',
    flexDirection: 'column',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  submitButton: {
    margin: 15,
    bottom: '1%',
    alignSelf: 'center',

  },
  lowerhorizontal: {
    flexDirection: 'column',
    height: lowerPanelHeight - 500

  },
  heading: {
    fontWeight: 'bold',
    margin: 5,
    fontSize: 15, marginBottom: 30,
    width: '100%',
    maxHeight: 200,
    marginHorizontal: 50,
    marginBottom: 30,
    alignSelf: 'center'
  },
  otherHeading: {
    fontWeight: 'bold',
    margin: 5,
    fontSize: 14,
    width: '100%',
  },
  changetouch: {
    padding: 7,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'black'
  },
  address: {
    marginLeft: 30,
    fontSize: 15,
    color: 'gray'
  },
  button: {
    position: 'absolute',
    bottom: 5,
  },
  anim: {
    position: 'absolute',
    top: height / 10 * 3.5 - 50,
    left: width / 2 - 50,
    right: width / 2 - 50,
    height: 100,
    width: 100,
    borderRadius: 50,
    zIndex: 100,
    backgroundColor: 'gray',
    borderColor: 'black',
    borderWidth: 1

  },
  animtrail: {
    position: 'absolute',
    top: height / 10 * 3.5 - 50,
    left: width / 2 - 50,
    right: width / 2 - 50,
    height: 100,
    width: 100,
    borderRadius: 50,
    zIndex: 100,
    backgroundColor: 'blue',
    borderColor: 'black',
    borderWidth: 1
  },
  currentlocationcontainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 30,
    height: 30,
    shadowOffset: {
      width: 2,
      height: 3
    },
    shadowColor: 'gray',
    shadowRadius: 7,
    elevation: 5
  },
  marker: {
    position: 'absolute',
    top: height / 10 * 3.5 - 40,
    left: width / 2 - 20,
    right: width / 2 - 20,
    height: 40,
    width: 40,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  backbutton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 20,
    width: 35,
    zIndex: 10000,

  },
  backbuttoncontainer: {

    position: 'absolute',
    top: 25,
    left: 20,
    height: 20,
    width: 35,
    zIndex: 100,
    flexWrap: 'wrap'
  },
  currentlocationcontainer: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    height: 20,
    width: 35,
    zIndex: 100,
    flexWrap: 'wrap'

  },
  currentlocationiamge: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 30,
    height: 30,
    zIndex: 70
  },
  characterLimit: {
    flexDirection: 'row',
    alignItems: 'center',

  }



});

const mapstyle = [
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
];
