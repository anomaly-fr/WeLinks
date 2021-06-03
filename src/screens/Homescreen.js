import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { dimen, Colors } from '../Constants'
import Axios from 'axios'
import { BackHandler } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import HomescreenTopBar from '../components/ui_components/HomescreenTopBar'
import { Config } from '../Constants'
import BottomSheet from 'reanimated-bottom-sheet'
import Animated from 'react-native-reanimated'
import qs from 'qs'
import ymdToApp, { getDuration } from '../Utility/dateConvertor'
import { AuthContext, useAuth } from '../services/auth-service'
import HomescreenBottomSheetContent from '../components/HomescreenBottomSheetContent'

let promoImageData = [
  require('./../../assets/banner1.jpg'),
  require('./../../assets/banner2.jpg'),
  require('./../../assets/banner3.jpg'),
]

export default class Homescreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstLogin: false,
      actualUser: this.props.route.params.actualUser,
      pressedMenu: false,
      drawer: this.props.route.params.drawer,
      imageHeight: 0,
      fall: new Animated.Value(1),
      sheetOpen: false,
      newsPendingRatings: [],
      milkPendingRatings: [],
      corpPendingRatings: [],
      ratingOrderDetails: {},
      ratingOrderMeta: {},
      ratingOpen: false,
      ratingTypeOpen: 'news',
      remountRating: Math.random(0.2).toString(),
    }
    ;(this.images = {
      milk: require('./../../assets/milk-icon.png'),
      news: require('./../../assets/newspaper-icon.png'),
      scrap: require('./../../assets/home-scrap-icon.png'),
      corporate: require('./../../assets/corporate-scrap-icon.png'),
    }),
      (this.words = {
        title: 'What are you looking for?',
        desc: 'Select services and checkout easily',
        milk: 'Milk Delivery',
        news: 'Newspaper Delivery',
        scrap: 'Corporate Scrap',
        corporate: 'Home Scrap',
        address: 'Tap here to add an address',
      })
    this.bs = React.createRef()
    this.temp = 0
    this.sheetHeight = dimen.height
  }

  checkIfFirstLogin = async () => {
    const jsondata = await AsyncStorage.getItem('firstLogin')
    const firstLogin = await JSON.parse(jsondata)
    if (firstLogin == null) {
      navigation.navigate('About')
      this.props.navigation.navigate('About', { firstLogin: true })
      this.setState({ firstLogin: true })
    } else {
      this.setState({ firstLogin: false })
    }
  }

  retrieveUserData = async () => {
    const user = useAuth().authContext.user

    Axios.get(
      Config.api_url +
        'php?action=getUser&phone=' +
        user.phoneNumber.substring(3),
    ).then(
      (response) => {
        try {
          this.setState({ actualUser: response.data.user[0] })
        } catch (error) {
          alert('An error occured')
          console.log('error', error)
        }
      },
      (error) => {
        alert('An error occured')

        console.log('error', error)
      },
    )
  }

  // Checks if the user has any ratings to submit
  retrievePendingRatings = async (times) => {
    if (times < 0) return
    try {
      const defUrl =
        Config.api_url +
        'php?action=getPendingRating&' +
        qs.stringify({
          user_id: this.state.actualUser.user_id,
        }) +
        '&product_type='
      const milk_pending = await Axios.get(defUrl + 'milk')
      this.setState({ milkPendingRatings: milk_pending.data })
      const news_pending = await Axios.get(defUrl + 'newspaper')
      this.setState({ newsPendingRatings: news_pending.data })
      const corp_pending = await Axios.get(defUrl + 'corporate_scrap')
      this.setState({ corpPendingRatings: corp_pending.data })
    } catch (error) {
      alert('An error occured')
      console.log('Pending Rating Error', error)
      this.retrievePendingRatings(--times)
    }
  }

  componentDidMount() {
    this.retrievePendingRatings(5)

    BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
  }

  onBackPress = () => {
    try {
      BackHandler.exitApp()
      console.log('Exiting')
    } catch (e) {
      console.log('Caught', e)
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
  }

  promoImagesRender = ({ item }) => {
    return <Image source={item.toString()} style={styles.imageBanner} />
  }

  render() {
    const user = AuthContext.user

    return (
      <View style={styles.fullscreen}>
        <HomescreenTopBar homescreenRef={this} />

        <BottomSheet
          enabledContentTapInteraction={true}
          ref={this.bs}
          onCloseStart={() => {
            this.setState({ sheetOpen: false })
          }}
          snapPoints={[dimen.height * 0.85, 0, 0]}
          renderContent={() => {
            return <HomescreenBottomSheetContent homescreenRef={this} />
          }}
          initialSnap={2}
          callbackNode={this.state.fall}
          enabledGestureInteraction={false}
        />

        <Animated.View
          onPress={() => {
            console.log('Tapped')
            this.bs.current.snapTo(2)
          }}
          style={{
            ...styles.banner,
            opacity: !this.state.sheetOpen
              ? 1.0
              : Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
          }}
        >
          {/* Promo images */}
          <FlatList
            data={promoImageData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.promoImagesRender}
            horizontal={true}
            snapToAlignment={'start'}
            snapToInterval={styles.imageBanner.width}
          />
        </Animated.View>
        <Text style={styles.title}>{this.words.title}</Text>
        <Text style={styles.desc}>{this.words.desc}</Text>

        {/* The four services */}
        <View style={styles.mainContent}>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.mainContentRow}>
              {/* milk */}
              <TouchableOpacity
                onLayout={(event) => {
                  this.setState({
                    imageHeight: event.nativeEvent.layout.height / 2,
                  })
                }}
                style={styles.menuitem}
                onPress={() => {
                  this.setState({ ratingTypeOpen: 'milk' })

                  const milk = this.state.milkPendingRatings
                  if (milk.length > 0) {
                    this.setState({
                      remountRating: Math.random(0.4).toString(),
                    })
                    this.setState({ ratingOrderMeta: milk[0] })
                    this.setState({
                      ratingOrderDetails: {
                        Date: ymdToApp(milk[0].order_date),
                        Duration:
                          getDuration(
                            milk[0].subscription_start_date,
                            milk[0].subscription_end_date,
                          ) + ' Day/s',
                        Product: milk[0].product_name,
                        Quantitiy: milk[0].quantity,
                        Vendor: milk[0].company_name,
                      },
                    })
                    this.setState({ milkRatingOpen: true })

                    this.setState({ sheetOpen: true })
                    this.bs.current.snapTo(0)
                  } else {
                    this.bs.current.snapTo(2)
                    this.props.navigation.navigate('AddressList', {
                      next: 'ProductVendors',
                      user: user,
                      actualUser: this.state.actualUser,
                      tag: 'Milk',
                      profile: true,
                      ...this.props.route.params,
                    })
                  }
                }}
              >
                <Image
                  style={{
                    ...styles.menuimage,
                    height: this.state.imageHeight,
                  }}
                  source={this.images.milk}
                />
                <Text
                  style={{
                    ...styles.menutext,
                    marginTop: (this.state.imageHeight * 2) / 20,
                  }}
                >
                  {this.words.milk}
                </Text>
              </TouchableOpacity>
              {/* Newspaper */}
              <TouchableOpacity
                style={styles.menuitem}
                onPress={() => {
                  this.setState({ ratingTypeOpen: 'newspaper' })

                  const news = this.state.newsPendingRatings
                  if (news.length > 0) {
                    this.setState({
                      remountRating: Math.random(0.4).toString(),
                    })
                    console.log('Some news ' + news)
                    this.setState({ ratingOrderMeta: news[0] })
                    this.setState({
                      ratingOrderDetails: {
                        Date: ymdToApp(news[0].order_date),
                        Duration:
                          getDuration(
                            news[0].subscription_start_date,
                            news[0].subscription_end_date,
                          ) + ' Day/s',
                        Product: news[0].product_name,
                        Quantitiy: news[0].quantity,
                        Vendor: news[0].company_name,
                      },
                    })

                    this.setState({ sheetOpen: true })
                    this.bs.current.snapTo(0)
                  } else {
                    this.props.navigation.navigate('AddressList', {
                      next: 'ProductVendors',
                      user: user,
                      actualUser: this.state.actualUser,
                      tag: 'Newspaper',
                      profile: true,
                      ...this.props.route.params,
                    })
                  }
                }}
              >
                <Image
                  style={{
                    ...styles.menuimage,
                    height: this.state.imageHeight,
                  }}
                  source={this.images.news}
                />
                <Text
                  style={{
                    ...styles.menutext,
                    marginTop: (this.state.imageHeight * 2) / 20,
                  }}
                >
                  {this.words.news}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mainContentRow}>
              {/* Home Scrap */}
              <TouchableOpacity
                style={styles.menuitem}
                onPress={() => {
                  this.props.navigation.navigate('AddressList', {
                    next: 'ScrapVendors',
                    user: user,
                    actualUser: this.state.actualUser,
                    profile: true,
                    ...this.props.route.params,
                  })
                }}
              >
                <Image
                  style={{
                    ...styles.menuimage,
                    height: this.state.imageHeight,
                  }}
                  source={this.images.scrap}
                />
                <Text
                  style={{
                    ...styles.menutext,
                    marginTop: (this.state.imageHeight * 2) / 20,
                  }}
                >
                  {this.words.corporate}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuitem}
                onPress={() => {
                  const news = this.state.corpPendingRatings
                  console.log('here')
                  if (this.state.corpPendingRatings.length > 0) {
                    this.setState({ ratingTypeOpen: 'corp' })

                    this.setState({
                      remountRating: Math.random(0.4).toString(),
                    })
                    console.log(news)
                    this.setState({ ratingOrderMeta: news[0] })
                    this.setState({
                      ratingOrderDetails: {
                        Date: ymdToApp(news[0].bid_pickupdate),
                        Duration:
                          getDuration(
                            news[0].bid_startdate,
                            news[0].bid_enddate,
                          ) + ' Day/s',
                        Title: news[0].bid_title,
                        Product: news[0].officescrap_category_name,
                        Vendor: news[0].company_name,
                      },
                    })

                    this.setState({ sheetOpen: true })
                    this.bs.current.snapTo(0)
                  } else {
                    console.log('Going')
                    this.props.navigation.navigate('Bids', {
                      department: 'corporateScrap',
                      actualUser: this.state.actualUser,
                      ...this.props.route.params,
                    })
                  }
                }}
              >
                <Image
                  style={{
                    ...styles.menuimage,
                    height: this.state.imageHeight,
                  }}
                  source={this.images.corporate}
                />
                <Text
                  style={{
                    ...styles.menutext,
                    marginTop: (this.state.imageHeight * 2) / 20,
                  }}
                >
                  {this.words.scrap}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  deliveringcontainer: {
    height: '0%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    bottom: 0,
    zIndex: 100,
    elevation: 100,
  },
  deliveringTitle: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
    color: 'black',
  },
  address: {
    fontWeight: '700',
    marginLeft: 10,
    marginBottom: 3,
    marginRight: 3,
    fontSize: 15,
  },
  fullscreen: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: 'white',
  },

  usernamecontainer: {
    alignSelf: 'center',
    width: dimen.width / 3,
    flexDirection: 'row',
    alignContent: 'center',
    borderRadius: 100,
    borderWidth: 0.525,
    borderColor: 'rgba(211,211,211,255)',
    padding: 10,
    justifyContent: 'center',
    marginLeft: dimen.width * 0.005,
    marginRight: dimen.width * 0.02,
  },

  userdes: {
    fontSize: 11,
    alignSelf: 'center',
  },

  city: {
    fontWeight: '600',
    fontSize: 13,
    color: 'black',
    fontWeight: 'bold',
  },
  banner: {
    width: dimen.width - 5,
    height: dimen.height / 3.5,
    alignSelf: 'center',
    borderRadius: 12,
    // backgroundColor:'orange'
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 30,
    alignSelf: 'flex-start',
    color: 'black',
  },
  desc: {
    fontSize: 14,
    color: 'gray',
    marginTop: 3,
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  mainContent: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  mainContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
    marginTop: '6%',
  },
  menuitem: {
    height: dimen.width / 2.95,
    width: dimen.width / 3 - 25,
    margin: 10,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,

    backgroundColor: 'rgba(255,255,255,255)',
    padding: 10,
    borderRadius: 5,
  },
  menuimage: {
    height: '70%',
    width: '70%',
    alignSelf: 'center',
  },
  menutext: {
    fontWeight: 'bold',
    fontSize: 11,
    flex: 1,
    textAlign: 'center',
    color: 'black',
  },
  imageBanner: {
    width: dimen.width - 100,
    height: '100%',
    marginRight: 15,
    alignSelf: 'flex-start',
  },

  panelHandle: {
    width: '10%',
    aspectRatio: 5 / 0.5,
    borderRadius: 4,
    backgroundColor: Colors.gray,
    marginBottom: '3%',
  },
})
