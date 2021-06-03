import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  BackHandler,
  Animated,
  TouchableOpacity,
} from 'react-native'
import {
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import { useFocusEffect } from '@react-navigation/native'
import Vendor from '../components/Vendor'
import {
  Avatar,
  Button,
  Snackbar,
  Provider,
  DefaultTheme,
} from 'react-native-paper'
import { Styles, dimen } from '../Constants'
import Accordion from 'react-native-collapsible/Accordion'
import * as Animatable from 'react-native-animatable'
import Stars from '../components/Stars'
import Product from '../components/Product'
import AppBar from '../components/ui_components/AppBar'
import Appliance from '../components/Appliance'
import { Colors } from '../Constants'
import Axios from 'axios'
import qs from 'qs'
import { Entypo } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'
import { Config } from '../Constants'

var cart = []
var buttonwidth = (dimen.width / 5) * 1.7

//a
export default class ScrapVendor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      brandImagesData: [],
      sections: [],
      activesections: [],
      width: 0,
      translateCart: new Animated.Value(dimen.height - dimen.appbarHeight),
      cartState: false,
      extraData: 0,
      orderId: -1,
      actualUser: props.route.params.actualUser,
      address: props.route.params.address,
      cart: [],
      cartAmount: 0,
      buttons: 0,
      snackBarVisible: false,
      snackBarText: 'Added to cart',
    }
    this.orderId = -1
  }

  async fetchOrderId() {
    var orderId, prevVendor
    const { vendorId } = this.props.route.params
    const { actualUser } = this.state
    try {
      orderId = await AsyncStorage.getItem('ScrapOrderId')
      prevVendor = await AsyncStorage.getItem('PrevScrapVendor')
      //  console.log('roder',orderId);
      if (orderId != null) {
        this.setState({ orderId: orderId })
        this.orderId = orderId
      } else this.orderId = -1

      if (prevVendor != null && prevVendor != vendorId) {
        alert('Your cart has been reset due to vendor change')
        Axios.post(
          Config.api_url +
            'php?action=resetCart&' +
            qs.stringify({
              user_id: actualUser.user_id,
              order_id: orderId,
            }),
        ).then((response) => {
          cart = []
          AsyncStorage.removeItem('ScrapOrderId')
          this.setState({ extraData: Math.random(0.5) })
          this.setState({ cart: cart })
          this.orderId = -1
        })
      } else if (prevVendor === null) {
        this.orderId = -1
        cart = []
        this.setState({ extraData: Math.random(0.5) })
        this.setState({ cart: cart })
      } else {
        if (orderId != -1)
          Axios.post(
            Config.api_url +
              'php?action=getHomeScrapOrders&order_id=' +
              orderId,
          ).then((response) => {
            //    console.log('response',response.data)
            cart =
              response.data.order[0].cart != undefined
                ? response.data.order[0].cart
                : []
            //    console.log('carty',cart);
            this.setState({ extraData: Math.random(0.5) })
            this.calculateCartAmount()
          })
      }
    } catch (error) {
      //   console.log('error encountered');
      this.setState({ orderId: -1 })
      this.orderId = -1
    }
  }

  componentDidMount() {
    //   console.log('MilkVendorEntered')

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.state.cartState
        ? this.toggleCart(false)
        : this.props.navigation.pop()
      return true
    })

    this.fetchOrderId()

    Axios.get(
      Config.api_url +
        'php?action=getProductsList&' +
        qs.stringify({
          vendorID: this.props.route.params.vendorId,
          vendor_type: 'homescrap',
        }),
      {
        'Accept-Encoding': 'gzip',
      },
    )
      .then((result) => {
        var res = result.data.products
        //     console.log('result',res);
        //     console.log('res',res.categories);
        this.setState({ sections: res.categories })
        this.setState({ brandImagesData: res.brands })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  showSnackBar = () => {
    console.log('called')
    this.setState({ snackBarVisible: true })
    setTimeout(() => {
      this.setState({ snackBarVisible: false })
    }, 2000)
  }

  addItemToCart = async (item, num) => {
    // console.log(item);
    // console.log(num);
    var itemid, quantity
    const { vendorId } = this.props.route.params
    if (item.id != undefined) itemid = item.id
    else itemid = item.cart_product_id

    if (this.orderId === -1 || this.orderId === null) {
      //  console.log('firstorder');
      Axios.post(
        Config.api_url +
          'php?action=addToCart&' +
          qs.stringify({
            user_id: this.state.actualUser.user_id,
            product_id: itemid,
            quantity: num,
            address_id: this.state.address.addr_id,
            vendor_id: this.props.route.params.vendorId,
          }),
      ).then((response) => {
        this.showSnackBar()

        AsyncStorage.setItem(
          'ScrapOrderId',
          response.data.order.scrap_order_id,
        ).then(() => {
          this.orderId = response.data.order.scrap_order_id
          console.log('ORDER ID ' + this.orderId)
          cart =
            response.data.order.cart != undefined
              ? response.data.order.cart
              : []
          AsyncStorage.setItem('PrevScrapVendor', vendorId)
          this.setState({ extraData: Math.random(0.3) })
          var tempcart = cart
          cart = []
          this.setState({ extraData: Math.random(0.2) })
          cart = tempcart
          this.setState({ extraData: Math.random(0.7) })
          this.setState({ cart: cart })
          this.calculateCartAmount()
        })
      })
    } else {
      // console.log('rigsbee', {
      //     user_id: this.state.actualUser.user_id,
      //     product_id: itemid,
      //     quantity: num,
      //     address_id: this.state.address.addr_id,
      //     vendor_id: this.props.route.params.vendorId,
      //     order_id: this.orderId
      // })
      Axios.post(
        Config.api_url +
          'php?action=addToCart&' +
          qs.stringify({
            user_id: this.state.actualUser.user_id,
            product_id: parseInt(itemid),
            quantity: num,
            address_id: parseInt(this.state.address.addr_id),
            vendor_id: parseInt(this.props.route.params.vendorId),
            order_id: parseInt(this.orderId),
          }),
      ).then((response) => {
        //   console.log(response);
        //  console.log('frisbee',response.data)
        this.showSnackBar()
        cart = response.data.order.cart
        this.setState({ extraData: Math.random(0.5) })
        AsyncStorage.setItem('PrevScrapVendor', vendorId)

        //         console.log(response.data.order.cart);
        this.setState({ cart: cart })
        this.calculateCartAmount()
        this.setState({ snackbarVisible: true })
      })
    }
    //  this.setState({snackBarVisible : true});
  }

  removeItemFromCart = (item) => {
    console.log('removing')
    var itemid = -1
    if (item.id != undefined) itemid = item.id
    else itemid = item.cart_product_id

    // console.log({
    //     user_id: this.state.actualUser.user_id,
    //     product_id: item.id,
    //     quantity: 0,
    //     address_id: this.state.address.addr_id,
    //     vendor_id: this.props.route.params.vendorId,
    //     order_id: this.orderId
    // });
    Axios.post(
      Config.api_url +
        'php?action=addToCart&' +
        qs.stringify({
          user_id: this.state.actualUser.user_id,
          product_id: itemid,
          quantity: 0,
          address_id: this.state.address.addr_id,
          vendor_id: this.props.route.params.vendorId,
          order_id: this.orderId,
        }),
    ).then((response) => {
      //  console.log(response.data);
      if (response.data.order.cart != undefined) cart = response.data.order.cart
      else cart = []
      this.setState({ extraData: Math.random(0.5) })
      //AsyncStorage.setItem("PrevScrapVendor", vendorId);

      //        console.log(response.data.order.cart);
      this.setState({ cart: cart })
      setTimeout(() => {
        this.calculateCartAmount()
      }, 1000)
    })
  }

  toggleCart = (retract) => {
    //  this.setState({open: true})
    this.setState({ extraData: Math.random(0.3) })
    this.setState({ cart: cart })
    //const {cs} = this.state;
    //    console.log('toggling',this.state.translateCart)
    const { translateCart } = this.state
    if (retract) {
      Animated.spring(this.state.translateCart, {
        toValue: dimen.appbarHeight,
        duration: 2500,
        useNativeDriver: true,
        speed: 5,
        bounciness: 3,
      }).start()
      this.setState({ cartState: true })
    } else {
      Animated.spring(this.state.translateCart, {
        toValue: dimen.height - dimen.appbarHeight,
        duration: 2500,
        useNativeDriver: true,
        speed: 5,
        bounciness: 3,
      }).start()
      this.setState({ cartState: false })
    }
  }

  toggleExpanded = () => {
    this.setState({ collapsed: !collapsed })
  }
  setSectionsFunction = async (sections) => {
    this.setState({
      activesections: sections.includes(undefined) ? [] : sections,
    })
    //    console.log(sections);
    setTimeout(() => {
      if (sections.length != 0)
        this.scrollView.scrollTo({
          x: 0,
          y: (Dimensions.get('window').height / 9 - 20) * sections[0],
          animated: true,
        })
    }, 1000)
  }

  renderItem = ({ item }) => {
    return (
      <Image
        style={Styles.horizontalImage}
        source={require('../../assets/milk-icon.png')}
      />
    )
  }

  renderSectionTitle = () => {
    return (
      <View style={Styles.collapsedView}>
        <Text style={Styles.collapsedText}>collapsedText</Text>
        <Entypo name="chevron-down" size={24} color={'black'} />
      </View>
    )
  }
  renderHeader = (section, _, isActive) => {
    let expanderButton = (
      <Entypo name="triangle-down" size={24} color={'black'} />
    )

    if (!isActive)
      expanderButton = <Entypo name="chevron-down" size={21} color={'black'} />
    else expanderButton = <Entypo name="chevron-up" size={21} color={'black'} />

    return (
      <Animatable.View
        duration={400}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 5,
        }}
        // style={Styles.collapsedView}
        transition="backgroundColor"
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            color: 'black',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          {Object.keys(section)[0]}
        </Text>
        {expanderButton}
      </Animatable.View>
    )
  }

  renderContent = (section, _, isactive) => {
    return (
      <Animatable.View
        duration={400}
        style={Styles.collapsibleView}
        transition="backgroundColor"
      >
        <ScrapFlatList
          removeItemFromCart={this.removeItemFromCart}
          addItemToCart={this.addItemToCart}
          navigation={this.props.navigation}
          route={{
            params: {
              name: 'SampleVendor',
              stars: 4,
              reviews: 68,
              vendorId: this.props.route.params.vendorId,
              actualUser: this.props.route.params.actualUser,
            },
          }}
          data={section[Object.keys(section)[0]]}
        />
      </Animatable.View>
    )
    /*return(
            <Animatable.View
        duration={400}
        style={Styles.collapsibleView}
        transition="backgroundColor">
                <FlatList style={Styles.productList}
                renderItem={(item)=>{
                    return(<ProductOne style={Styles.vendorflat}/>)
                }}
                data={[1,2,3,4,5,6,7]}
                keyExtractor={(item,index)=> index.toString()}/>

        </Animatable.View>
        );*/
  }

  rendCont = (section, _, isactive) => {
    return <View style={{ height: 300, width: 300 }} />
  }
  calculateCartAmount = () => {
    let i,
      amount = 0
    for (i in cart) {
      amount +=
        parseFloat(cart[i].homescrap_price) * parseInt(cart[i].cart_quantity)
    }

    this.setState({ cartAmount: amount })
    return amount
  }

  dismissSnackbar = () => {
    this.setState({ snackBarVisible: false })
  }

  render() {
    const {
      name,
      stars,
      reviews,
      address,
      vendorAddress,
      imageUrl,
    } = this.props.route.params

    return (
      <Provider
        theme={{
          ...DefaultTheme,
          colors: {
            onSurface: Colors.primary,
            surface: 'white',
          },
        }}
      >
        <View style={{ flex: 1, marginBottom: '5%', backgroundColor: 'white' }}>
          <Snackbar
            visible={this.state.snackBarVisible}
            style={{ color: 'white', marginBottom: '1%' }}
            onDismiss={this.dismissSnackbar}
            action={{
              label: 'Dismiss',
              onPress: () => {
                this.dismissSnackbar()
              },
            }}
          >
            {this.state.snackBarText}
          </Snackbar>

          <AppBar
            title={name}
            back
            funct={() =>
              this.state.cartState
                ? this.toggleCart(false)
                : this.props.navigation.pop()
            }
          />
          <View style={{ height: dimen.appbarHeight }} />
          <View style={{ flex: 1 }}>
            <View style={style.upperContainer}>
              <Vendor
                style={{ width: '100%' }}
                buttonVisible={false}
                name={name}
                reviews={reviews}
                stars={stars}
                address={vendorAddress}
                imageUrl={imageUrl}
              />

              <View style={style.upperLowerContainer}>
                {/* Go To Cart Button */}
                <TouchableOpacity
                  onPress={() => {
                    // console.log("?")
                    this.toggleCart(true)
                    //this.props.navigation.navigate('ScrapCart',cart)
                  }}
                >
                  <View
                    style={{
                      backgroundColor: Colors.primary,
                      color: 'white',
                      width: buttonwidth,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '3%',
                      borderRadius: 8,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{ color: 'white', fontWeight: 'bold' }}
                    >{`Go to Cart(${cart.length})`}</Text>
                  </View>
                </TouchableOpacity>
                {/* Schedule Pickup Button */}
                <TouchableOpacity
                  disabled={this.state.cart != -1 && cart.length == 0}
                  onLayout={({ nativeEvent }) => {
                    this.setState({ width: nativeEvent.layout.width })
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('ScrapCart', {
                      cart,
                      actualUser: this.state.actualUser,
                      address: this.state.address,
                      vendorId: this.props.route.params.vendorId,
                      orderId: this.orderId,
                    })
                  }
                >
                  <View
                    style={{
                      backgroundColor: Colors.primary,
                      color: 'white',
                      width: buttonwidth,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '3%',
                      borderRadius: 8,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{ color: 'white', fontWeight: 'bold' }}
                    >
                      Schedule Pickup
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {/* <View style={{flexDirection: 'row',alignSelf: 'center',margin: 10,justifyContent: 'space-between',width: '80%'}}>
                    <Text style={{backgroundColor: Colors.primary,padding: 10, borderRadius: 5,color: 'white',fontWeight: 'bold'}}>Items in cart</Text>
                    <Text style={{backgroundColor: Colors.primary,padding: 10, borderRadius: 5,color: 'white',fontWeight: 'bold'}}> Schedule Pickup</Text>
                </View> */}
            </View>

            <View style={style.lowerContainer}>
              <ScrollView ref={(ref) => (this.scrollView = ref)}>
                <View style={{ marginTop: dimen.height / 25 }}>
                  <Accordion
                    style={{ ...Styles.accordion }}
                    sections={this.state.sections}
                    renderContent={this.renderContent}
                    touchableComponent={TouchableOpacity}
                    expandMultiple={false}
                    renderHeader={this.renderHeader}
                    activeSections={this.state.activesections}
                    onChange={this.setSectionsFunction}
                  />
                </View>
              </ScrollView>
            </View>
          </View>

          <Animated.View
            style={{
              width: dimen.width,
              height: dimen.height - dimen.appbarHeight,
              zIndex: 100,
              elevation: 10,
              position: 'absolute',
              bottom: 0,
              transform: [{ translateY: this.state.translateCart }],
            }}
          >
            <ScrollView style={{ backgroundColor: 'white' }}>
              {/* background blur */}
              <View
                style={{
                  flex: 0,
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  zIndex: 1000,
                }}
                onTouchEnd={() => this.toggleCart(false)}
              />
              {/* Bottom sheet */}
              <View
                style={{ flex: 1, backgroundColor: 'white', paddingBottom: 30 }}
              >
                <Text
                  style={{
                    ...Styles.heading,
                    alignSelf: 'center',
                    textAlign: 'center',
                    padding: 10,
                  }}
                >
                  Cart
                </Text>
                {this.state.extraData != null && cart[0] != undefined ? null : (
                  <Text
                    style={{
                      ...Styles.subbold,
                      margin: 100,
                      alignSelf: 'center',
                    }}
                  >
                    Cart is empty
                  </Text>
                )}
                <View>
                  <FlatList
                    data={cart}
                    extraData={this.state.cart}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <Appliance
                          remove={true}
                          item={item}
                          index={index}
                          onAdd={(num) => {
                            console.log('show')
                            //
                            this.addItemToCart(item, num)

                            /*    
                                             cart.push({
                                                ...item,
                                                itemQuantity : num
                                            });
                       
                       
                       
                                               console.log(cart)*/
                          }}
                          onRemove={(whatever) => {
                            this.removeItemFromCart(item)

                            /*console.log('Remove')
                                        cart.splice(index,1);
                                        console.log(cart);*/
                            // let temp = cart,i,ind = index;

                            // for(i in temp){
                            //         if(i != ind)
                            //         cart.push(temp[i])
                            // }
                            // console.log(cart)
                          }}
                          initquan={item.cart_quantity}
                          //onquanchange={calculateCartAmount}
                          name={item.homescrap_name}
                          quantity={item.quantity}
                          price={item.homescrap_price}
                          price_={item.price_}
                          image={item.homescrap_image_url}
                          subscribe={() => {
                            const prodName = item.name
                            const prodQuan = item.quantity
                            const prodRate = item.price
                            const prodRate_ = item.price_

                            navigation.navigate('SubscribeScreen', {
                              tag: 'paper',
                              pname: prodName,
                              pquan: prodQuan,
                              prate: prodRate,
                            })
                          }}
                        />
                      )
                    }}
                  />
                </View>

                <View style={style.gray}>
                  <Text style={{ margin: '1%' }}>
                    Disclaimer: Prices shown are only approximate value. They
                    can differ for different vendors/products.
                  </Text>
                  {/*<Text onPress={() => {
                //  this.props.navigation.navigate('FAQ') What about this?
             }} style={{textDecorationLine: 'underline',textAlign: 'left',margin: '1%',marginTop: 0}}>Learn more.</Text> */}
                </View>

                <View
                  style={{
                    padding: 10,
                    backgroundColor: 'white',
                    marginTop: dimen.width / 60,
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={style.billText}>{'Cart Amount'}</Text>
                    <Text style={style.billCost}>₹{this.state.cartAmount}</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={style.billText}>{'Pick-Up Fee'}</Text>
                    <Text style={style.billCost}>₹50</Text>
                  </View>
                  <View
                    style={{ ...Styles.grayfullline, marginVertical: '3%' }}
                  />
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={style.billText}>{'Total Cost'}</Text>
                    <Text style={style.billCost}>
                      ₹{this.state.cartAmount + 50}
                    </Text>
                  </View>
                  <TouchableOpacity
                    disabled={this.state.cart != -1 && cart.length == 0}
                    style={{
                      backgroundColor:
                        this.state.cart.length == 0
                          ? Colors.seperatorGray
                          : Colors.primary,
                      width: dimen.width * 0.9,
                      alignSelf: 'center',
                      borderRadius: 10,
                      marginTop: 5,
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('ScrapCart', {
                        cart,
                        actualUser: this.state.actualUser,
                        address: this.state.address,
                        vendorId: this.props.route.params.vendorId,
                        orderId: this.orderId,
                      })
                    }
                  >
                    <Text
                      style={{
                        ...Styles.subheading,
                        alignSelf: 'center',
                        color: 'white',
                        textAlign: 'center',
                        padding: 15,
                      }}
                    >
                      Schedule Pickup
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Provider>
    )
  }
}

const ScrapFlatList = ({
  route,
  navigation,
  data,
  addItemToCart,
  removeItemFromCart,
}) => {
  const { name } = route.params
  const { stars } = route.params
  const { tag } = route.params
  const { reviews, actualUser } = route.params

  // useFocusEffect(
  //     React.useCallback(() => {
  //         const {cartState} = this.state;
  //         const onBackPress = () => {
  //             //     console.log('Go to milk');
  //             this.state.cartState ? this.toggleCart(false) : this.props.navigation.pop();
  //             return true;

  //         };

  //         BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //         return () =>
  //             BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //     })
  // );
  const vendorId = route.params.vendorId

  // const order = navigation.getParams('order');
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.name}
        style={{ maxHeight: dimen.height * 0.5 }}
        renderItem={({ item, index }) => {
          //   console.log(item.product_img_url);

          return (
            <Appliance
              item={item}
              initquan={1}
              index={index}
              //  showSnackbar = {this.showSnackBar()}
              onAdd={(num) => {
                addItemToCart(item, num)

                /* cart.push({
                                 ...item,
                                 itemQuantity : num,
                                 itemPrice : item.price
                             });
         
         
         
         
                                 console.log(cart)*/
              }}
              onRemove={() => {
                removeItemFromCart(item)
                /*console.log('Remove')
                            cart.splice(index,1);
                            console.log(cart);*/
                // let temp = cart,i,ind = index;

                // for(i in temp){
                //         if(i != ind)
                //         cart.push(temp[i])
                // }
                // console.log(cart)
              }}
              name={item.name}
              quantity={item.quantity}
              price={item.price}
              price_={item.price_}
              image={item.product_url}
              subscribe={() => {
                const prodName = item.name
                const prodQuan = item.quantity
                const prodRate = item.price
                const prodRate_ = item.price_

                navigation.navigate('SubscribeScreen', {
                  tag: 'paper',
                  pname: prodName,
                  pquan: prodQuan,
                  prate: prodRate,
                })
              }}
            />
          )
        }}
      />
    </View>
  )
}

const style = StyleSheet.create({
  upperContainer: {
    flex: 0,
    marginBottom: 0,
  },
  upperUpperContainer: {
    flex: 5,
  },
  upperLowerContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  lowerContainer: {
    flex: 2,
  },
  container: {
    padding: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#E5F6FE',
    height: Dimensions.get('window').height / 3,
    padding: 5,
    flexDirection: 'row',
  },
  name: {
    marginTop: 0.02 * Dimensions.get('window').height,
    marginStart: '29%',
    fontWeight: 'bold',
    fontSize: 20,
  },
  address: {
    marginTop: 0.01 * Dimensions.get('window').height,
    marginStart: '29%',
    fontWeight: 'bold',
    fontSize: 13,
  },
  brandsTitle: {
    color: 'gray',
    marginStart: '29%',
    marginTop: '2%',
    fontWeight: 'bold',
  },
  review: {
    color: 'gray',
    marginStart: '5%',
    marginTop: '2%',
    fontWeight: 'bold',
  },
  stars: {
    marginStart: '29%',
    marginTop: '2%',
    fontWeight: 'bold',
  },
  image: {
    height: 100,
    width: 100,
    position: 'absolute',
    marginTop: '3%',
  },
  gray: {
    padding: '1%',
    backgroundColor: Colors.seperatorGray,
    borderRadius: 10,
    height: Dimensions.get('window').height / 11,
    margin: '3%',

    alignItems: 'flex-start',
    justifyContent: 'center',
    elevation: 1,
  },
  billText: {
    fontSize: 18,
    marginTop: '2%',
    fontWeight: '900',
    margin: '2%',
  },
  billCost: {
    fontWeight: 'bold',
    fontSize: 16,
    margin: '2%',
    textAlign: 'right',

    ...StyleSheet.absoluteFill,
  },
})

//export default ScrapVendors;
