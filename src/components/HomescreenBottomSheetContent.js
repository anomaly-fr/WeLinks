import React from 'react'
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { useAuth } from '../services/auth-service'
import { EvilIcons } from '@expo/vector-icons'
import { Config, Colors } from '../Constants'
import Axios from 'axios'
import { MaterialIcons } from '@expo/vector-icons'
import qs from 'qs'
import RatingComponentScreen from '../components/RatingComponentScreen'

// Ratings pending from previous orders

const HomescreenBottomSheetContent = ({ homescreenRef }) => {
  const authContext = useAuth()
  const user = authContext.user

  return (
    <View key={homescreenRef.state.remountRating}>
      <View style={{ backgroundColor: Colors.lightBlue, paddingBottom: 100 }}>
        <View
          style={{
            backgroundColor: Colors.white,
            alignItems: 'flex-end',
            padding: '1%',
          }}
        >
          <MaterialIcons
            name="keyboard-arrow-down"
            size={25}
            color={Colors.black}
            onPress={() => {
              homescreenRef.setState({ sheetOpen: false })
              homescreenRef.bs.current.snapTo(2)
            }}
          />
        </View>

        <View>
          <RatingComponentScreen
            buttonPress={(stars, comments) => {
              console.log('posting review')
              if (homescreenRef.state.ratingTypeOpen === 'corp')
                Axios.post(
                  Config.api_url +
                    'php?' +
                    qs.stringify({
                      action: 'postRating',
                      user_id: homescreenRef.state.actualUser.user_id,
                      vendor_id:
                        homescreenRef.state.ratingOrderMeta.awarded_vendor
                          .length > 0
                          ? homescreenRef.state.ratingOrderMeta
                              .awarded_vendor[0].vendor_id
                          : 0,
                      product_type: 'corporate_scrap',
                      rating: stars,
                      feedback: comments,
                      order_id: homescreenRef.state.ratingOrderMeta.bid_id,
                    }),
                ).then((response) => {
                  const tempCorp = homescreenRef.state.corpPendingRatings
                  tempCorp.splice(0, 1)
                  if (tempCorp.length > 0) {
                    const news = tempCorp
                    homescreenRef.setState({ ratingTypeOpen: 'corp' })

                    homescreenRef.setState({
                      remountRating: Math.random(0.4).toString(),
                    })
                    homescreenRef.setState({ ratingOrderMeta: news[0] })
                    homescreenRef
                      .setState({
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
                      .catch((e) => {
                        console.log('Error', e)
                      })
                  } else {
                    homescreenRef.bs.current.snapTo(2)
                    homescreenRef.props.navigation.navigate('Bids', {
                      next: 'Bids',
                      user: homescreenRef.props.route.params.user,
                      actualUser: homescreenRef.state.actualUser,

                      profile: true,
                      ...homescreenRef.props.route.params,
                    })
                  }
                })
              else
                Axios.post(
                  Config.api_url +
                    'php?' +
                    qs.stringify({
                      action: 'postRating',
                      user_id: homescreenRef.state.actualUser.user_id,
                      vendor_id: homescreenRef.state.ratingOrderMeta.vendor_id,
                      product_type:
                        homescreenRef.state.ratingOrderMeta.product_type,
                      rating: stars,
                      feedback: comments,
                      order_id: homescreenRef.state.ratingOrderMeta.order_id,
                    }),
                  {},
                ).then((response) => {
                  console.log(response.data)
                  console.log({
                    action: 'postRating',
                    user_id: homescreenRef.state.actualUser.user_id,
                    vendor_id: homescreenRef.state.ratingOrderMeta.vendor_id,
                    product_type:
                      homescreenRef.state.ratingOrderMeta.product_type,
                    rating: stars,
                    feedback: comments,
                    order_id: homescreenRef.state.ratingOrderMeta.order_id,
                  })

                  if (!homescreenRef.state.ratingOpen) {
                    const tempNews = homescreenRef.state.newsPendingRatings
                    tempNews.splice(0, 1)
                    homescreenRef.setState({ newsPendingRatings: tempNews })

                    if (homescreenRef.state.newsPendingRatings.length > 0) {
                      const milk = tempNews
                      homescreenRef.setState({
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
                      homescreenRef.setState({ ratingOrderMeta: milk[0] })
                    } else {
                      homescreenRef.setState({ sheetOpen: false })
                      homescreenRef.bs.current.snapTo(2)
                      // homescreenRef.props.route.params.goToMySubs();
                      homescreenRef.props.navigation.navigate('AddressList', {
                        next: 'ProductVendors',
                        user: homescreenRef.props.route.params.user,
                        actualUser: homescreenRef.state.actualUser,
                        tag: 'Newspaper',
                        profile: true,
                      })
                      homescreenRef.setState({
                        remountRating: Math.random(0.4).toString(),
                      })
                    }
                  } else {
                    const tempMilk = homescreenRef.state.milkPendingRatings
                    console.log('abccbauncsnocno')
                    tempMilk.splice(0, 1)
                    homescreenRef.setState({ milkPendingRatings: tempMilk })
                    console.log(tempMilk)

                    if (homescreenRef.state.milkPendingRatings.length > 0) {
                      const milk = tempMilk
                      homescreenRef.setState({
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
                      homescreenRef.setState({ ratingOrderMeta: milk[0] })
                    } else {
                      homescreenRef.setState({ sheetOpen: false })
                      homescreenRef.bs.current.snapTo(2)
                      // homescreenRef.props.route.params.goToMySubs();
                      homescreenRef.props.navigation.navigate('AddressList', {
                        next: 'ProductVendors',
                        user: homescreenRef.props.route.params.user,
                        actualUser: homescreenRef.state.actualUser,
                        tag: 'Milk',
                        profile: true,
                        ...homescreenRef.props.route.params,
                      })
                      homescreenRef.setState({
                        remountRating: Math.random(0.4).toString(),
                      })
                    }
                  }
                })
            }}
            order_details={homescreenRef.state.ratingOrderDetails}
          />
        </View>
      </View>
    </View>
  )
}

export default HomescreenBottomSheetContent
