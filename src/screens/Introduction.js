import * as React from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import FastImage from 'react-native-fast-image'
import SubmitButton from '../components/SubmitButton'
import { dimen } from '../Constants'

var showRealApp = false
const slides = [
  {
    key: 'one',
    title: 'Free milk delivery at home',
    text: 'Choose from a wide range of our milk products',
    image: require('../../assets/milk-intro.jpg'),
    backgroundColor: '#F3F7FA',
  },
  {
    key: 'two',
    title: 'Your favorite newspaper at your doorstep',
    text: 'Find the best newspaper delivery companies for homes, offices',
    image: require('../../assets/newspaper-intro.jpg'),
    backgroundColor: '#F3F7FA',
  },
  {
    key: 'three',
    title: 'Online doorstep scrap pickup service',
    text: 'Sell your scrap easily and get better prices and offers',
    image: require('../../assets/home-scrap-intro.jpg'),
    backgroundColor: '#F3F7FA',
  },
  {
    key: 'four',
    title: 'Scrap selling for corporates',
    text:
      'We have an option for corporates to systematically get rid of the scrap and get certificates of recycling',
    image: require('../../assets/corporate-scrap-intro.jpg'),
    backgroundColor: '#F3F7FA',
  },
]

export default class Introduction extends React.Component {
  _renderItem = ({ item }) => {
    return (
      <View style={{ ...styles.slide, backgroundColor: item.backgroundColor }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
        <FastImage style={styles.image} source={item.image} />
      </View>
    )
  }

  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    showRealApp = true
    this.props.navigation.navigate('Login', {
      getUserDetails: this.props.route.params.getUserDetailsa,
    })
  }

  render() {
    /*if (this.state.showRealApp) {
          return <App />;
        } else {*/
    return (
      <View style={styles.container}>
        <AppIntroSlider
          style={styles.intro}
          renderItem={this._renderItem}
          data={slides}
          onDone={this._onDone}
          initialNumToRender={4}
          renderDoneButton={() => {
            return <View styles={{ height: 0, width: 0 }} />
          }}
          renderNextButton={() => {
            return <View styles={{ height: 0, width: 0 }} />
          }}
        />

        <View style={styles.bottom}>
          <SubmitButton
            text="GET STARTED"
            onTouch={() => {
              this.props.navigation.navigate('Login', {
                getUserDetails: this.props.route.params.getUserDetailsa,
              })
            }}
          />
        </View>
      </View>
    )
    /* }*/
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  intro: {
    height: '87%',
    width: '100%',
  },
  bottom: {
    width: '100%',
    marginBottom: dimen.bottomMargin,
  },

  slide: {
    marginTop: 30,
    backgroundColor: 'rgba(255,0,0,0)',
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 200,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',

    padding: 10,
  },
  image: {
    marginTop: 70,
    height: 300,
    width: 300,
    alignSelf: 'center',
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 5,
    color: 'gray',
    margin: 15,
  },
})
