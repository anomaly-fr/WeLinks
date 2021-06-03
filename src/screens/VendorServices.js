import React, { useState, useEffect } from 'react'
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { dimen, Colors, Styles } from '../Constants'
import Button from '../components/ui_components/Button'
import SubmitButton from '../components/SubmitButton'
import AppBar from '../components/ui_components/AppBar'
import { AntDesign } from '@expo/vector-icons'
import Axios from 'axios'
import boyerMooreHorspool from '../Utility/Boyer'
import { Buffer } from 'buffer'

/* This screen appears when vendor has to select his/her/it 's services
 */

var milkProducts = []
var paperProducts = []

var homeProducts = []
var officeProducts = []

// Final selected sets
let selectedMilk = new Set()
let selectedPaper = new Set()
let selectedHome = new Set()
let selectedOffice = new Set()
export default function VendorServices({ route, navigation }) {
  var back = false
  const [milkRemount, setMilkRemount] = useState(0)
  const [newsRemount, setNewsRemount] = useState(0)
  const [HomeRemount, setHomeRemount] = useState(0)
  const { submit, actualUser } = route.params
  const [officeRemount, setOfficeRemount] = useState(0)
  const vendorEdit = route.params.vendorEdit === true ? true : false
  console.log(vendorEdit)
  var textRef
  if (route != undefined) if (route.params.back != undefined) back = true

  const words = {
    milkDelivery: 'Milk Delivery',
    newspaperDelivery: 'Newspaper Delivery',
    homescrapCollection: 'Home Scrap Collection',
    officescrapCollection: 'Office Scrap Collection',
  }

  const [service, setService] = useState('') // Selected service

  const [translateCart, setTranslateCart] = useState(
    new Animated.Value(dimen.height),
  )

  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [check3, setCheck3] = useState(false)
  const [check4, setCheck4] = useState(false)

  const [width, setWidth] = useState(0)
  let list = []
  let available = new Set()

  const getMilkProducts = () => {
    Axios.get(
      'https://api.dev.we-link.in/user_app_dev.php?action=getAllMilkProducts&city_id=' +
        2,
    ).then(
      (response) => {
        console.log('res' + response.data.products)
        var temp = response.data.products
        var arr = []
        temp.forEach((p) => {
          arr.push({ ...p, sel: false })
        })

        milkProducts = arr
        var initArr = 0
        if (vendorEdit) {
          route.params.actualVendor.milk_product_ids.forEach((p) => {
            try {
              milkProducts.forEach((item, index) => {
                if (item.id === p) {
                  milkProducts[index] = { ...milkProducts[index], sel: true }
                  var temp = milkProducts[index]
                  milkProducts[index] = milkProducts[initArr]
                  milkProducts[initArr] = temp
                  initArr++
                  throw 'Ah, finally found it'
                }
              })
            } catch (err) {}
          })
        }

        setMilkRemount(Math.random(0.3))
        //data=response.data;
      },
      (error) => {
        console.log(error)
      },
    )
  }
  const getPaperProducts = () => {
    Axios.get(
      'https://api.dev.we-link.in/user_app_dev.php?action=getAllNewsPaperProducts&city_id=' +
        2,
    ).then(
      (response) => {
        console.log('res' + response.data.products)
        var temp = response.data.products
        var arr = []
        temp.forEach((p) => {
          arr.push({ ...p, sel: false })
        })
        paperProducts = arr
        var initArr = 0

        if (vendorEdit) {
          route.params.actualVendor.news_product_ids.forEach((p) => {
            try {
              paperProducts.forEach((item, index) => {
                if (item.id === p) {
                  paperProducts[index] = { ...paperProducts[index], sel: true }
                  var temp = paperProducts[index]
                  paperProducts[index] = paperProducts[initArr]
                  paperProducts[initArr] = temp
                  initArr++
                  throw 'Ah, finally found it'
                }
              })
            } catch (err) {}
          })
        }

        setMilkRemount(Math.random(0.3))
        // setMilkProducts
        //data=response.data;
      },
      (error) => {
        console.log(error)
      },
    )
  }
  const getHomeProducts = () => {
    Axios.get(
      'https://api.dev.we-link.in/user_app_dev.php?action=getAllHomeScrapProducts&city_id=' +
        2,
    ).then(
      (response) => {
        console.log('res' + response.data.products)
        var temp = response.data.products
        var arr = []
        temp.forEach((p) => {
          arr.push({ ...p, sel: false })
        })
        homeProducts = arr
        var initArr = 0
        if (vendorEdit) {
          route.params.actualVendor.homescrap_product_ids.forEach((p) => {
            try {
              homeProducts.forEach((item, index) => {
                if (item.id === p) {
                  homeProducts[index] = { ...homeProducts[index], sel: true }

                  var temp = homeProducts[index]
                  homeProducts[index] = homeProducts[initArr]
                  homeProducts[initArr] = temp
                  initArr++
                  throw 'Ah, finally found it'
                }
              })
            } catch (err) {}
          })
        }

        setMilkRemount(Math.random(0.3))
      },
      (error) => {
        console.log(error)
      },
    )
  }
  const getOfficeProducts = () => {
    Axios.get(
      'https://api.dev.we-link.in/user_app_dev.php?action=getAllCorporateScrapCategories&city_id=' +
        2,
    ).then(
      (response) => {
        console.log('res' + response.data.categories)
        var temp = response.data.categories
        var arr = []
        temp.forEach((p) => {
          arr.push({ ...p, sel: false })
        })
        officeProducts = arr
        var initArr = 0
        if (vendorEdit) {
          if (route.params.actualVendor.officescrap_cat_ids != null) {
            route.params.actualVendor.officescrap_cat_ids.forEach((p) => {
              try {
                officeProducts.forEach((item, index) => {
                  if (item.id === p) {
                    officeProducts[index] = {
                      ...officeProducts[index],
                      sel: true,
                    }
                    var temp = officeProducts[index]
                    officeProducts[index] = officeProducts[initArr]
                    officeProducts[initArr] = temp
                    initArr++
                    throw 'Ah, finally found it'
                  }
                })
              } catch (err) {}
            })
          }
        }

        setMilkRemount(Math.random(0.3))
      },
      (error) => {
        console.log(error)
      },
    )
  }
  useEffect(() => {
    navigation.addListener('focus', () => {
      if (vendorEdit) {
        if (route.params.actualVendor.mlik_service != 'no') setCheck1(true)
        if (route.params.actualVendor.newspaper_service != 'no') setCheck2(true)
        if (route.params.actualVendor.homescrap_service != 'no') setCheck3(true)
        if (route.params.actualVendor.officescrap_service != 'no')
          setCheck4(true)
      }
      getMilkProducts()
      getPaperProducts()
      getHomeProducts()
      getOfficeProducts()
    })

    if (vendorEdit) {
      if (route.params.actualVendor.mlik_service != 'no') setCheck1(true)
      if (route.params.actualVendor.newspaper_service != 'no') setCheck2(true)
      if (route.params.actualVendor.homescrap_service != 'no') setCheck3(true)
      if (route.params.actualVendor.officescrap_service != 'no') setCheck4(true)
    }

    getMilkProducts()
    getPaperProducts()
    getHomeProducts()
    getOfficeProducts()

    //     console.log('retrieving')
  }, [])
  // Opens bottom sheet
  const toggleProducts = (retract) => {
    if (textRef != undefined) textRef.clear()

    console.log('toggling', translateCart)

    if (retract)
      Animated.spring(translateCart, {
        toValue: 0,
        duration: 2500,
        useNativeDriver: true,
        speed: 5,
        bounciness: 3,
      }).start()
    else {
      Animated.spring(translateCart, {
        toValue: dimen.height,
        duration: 2500,
        useNativeDriver: true,
        speed: 5,
        bounciness: 3,
      }).start()
    }
  }
  // To select a service
  const CheckBox = (check) => {
    if (!check) return <AntDesign name="checksquareo" size={24} color="gray" />
    else
      return <AntDesign name="checksquare" size={24} color={Colors.primary} />
  }

  // Component for product in flatlist
  const VendorSelectProduct = ({
    name,
    imageURL,
    product_id,
    defaultSelected,
    index,
    sel,
  }) => {
    const [selected, setSelected] = useState(sel)
    const adding = (name, imageURL) => {
      switch (service) {
        case 'Milk':
          milkProducts.forEach((p) => {
            if (p.name == name) {
              //      p.sel = selected;
              //    console.log(name + " " + "sel " + sel + " selected " + selected)
            }
          })
          if (!selected) {
            let obj = {
              name,
              imageURL,
            }
            selectedMilk = new Set(selectedMilk.add(obj))
            //  selectedMilk.add(obj);

            //     setSM(new Set(selectedMilk).add(obj));
          } else if (selected) {
            selectedMilk.forEach((product) => {
              if (product.name == name)
                //  setSM(new Set(selectedMilk.delete(product)));
                selectedMilk.delete(product)
            })
            //          list = Array.from(available);
          }
          break
        case 'Paper':
          paperProducts.forEach((p) => {
            if (p.name == name) {
              //        p.sel = selected;
            }
          })
          if (!selected) {
            let obj = {
              name,
              imageURL,
            }
            selectedPaper.add(obj)
            //       list = Array.from(smp);
          } else if (selected) {
            selectedPaper.forEach((product) => {
              if (product.name == name) selectedPaper.delete(product)
            })
            //          list = Array.from(available);
          }
          break

        case 'Home':
          homeProducts.forEach((p) => {
            if (p.name == name) {
              //        p.sel = selected;
            }
          })
          if (!selected) {
            let obj = {
              name,
              imageURL,
            }
            selectedHome.add(obj)
            //       list = Array.from(smp);
          } else if (selected) {
            selectedHome.forEach((product) => {
              if (product.name == name) selectedHome.delete(product)
            })
            //          list = Array.from(available);
          }
          break
        case 'Office':
          officeProducts.forEach((p) => {
            if (p.name == name) {
              //        p.sel = selected;
            }
          })
          if (!selected) {
            let obj = {
              name,
              imageURL,
            }
            selectedOffice.add(obj)
            //       list = Array.from(smp);
          } else if (selected) {
            selectedOffice.forEach((product) => {
              if (product.name == name) selectedOffice.delete(product)
            })
            //          list = Array.from(available);
          }
          break
      }

      console.log('Milk: \n')
      selectedMilk.forEach((p) => {
        console.log(p.name)
      })
      console.log('Paper: \n')
      selectedPaper.forEach((p) => {
        console.log(p.name)
      })
      console.log('Home: \n')
      selectedHome.forEach((p) => {
        console.log(p.name)
      })
      console.log('Office: \n')
      selectedOffice.forEach((p) => {
        console.log(p.name)
      })
    }

    const setSelectedAndAdd = (name, imageURL) => {
      //adding(name, imageURL);
      var sel = selected
      setSelected(!selected)
      if (service === 'Milk')
        milkProducts[index] = { ...milkProducts[index], sel: !sel }
      else if (service === 'Paper')
        paperProducts[index] = { ...paperProducts[index], sel: !sel }
      else if (service === 'Home')
        homeProducts[index] = { ...homeProducts[index], sel: !sel }
      else if (service === 'Office')
        officeProducts[index] = { ...officeProducts[index], sel: !sel }
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          marginVertical: '2%',
          margin: '1%',
          backgroundColor: Colors.whiteBackground,
          height: dimen.height / 8,
        }}
      >
        <Image style={style.image} source={{ uri: imageURL }} />

        <View
          style={{
            alignSelf: 'center',
            flex: 1,
            flexDirection: 'row',
            marginStart: 80,
          }}
        >
          <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>
            {name}
          </Text>
          <AntDesign
            onPress={() => {
              setSelectedAndAdd(name, imageURL)
            }}
            style={{ position: 'absolute', right: 10 }}
            name={selected ? 'checksquare' : 'checksquareo'}
            size={30}
            color={!selected ? Colors.seperatorGray : Colors.primary}
          />
        </View>
      </View>
    )
  }

  // Heading of the type of product
  const selectHeading = () => {
    switch (service) {
      case 'Milk':
        return 'Choose Milk Products'

      case 'Paper':
        return 'Choose Newspapers'

      case 'Home':
        return 'Choose Home Scrap Items'

      case 'Office':
        return 'Choose Corporate Scrap Items'
    }
  }

  const selectData = () => {
    switch (service) {
      case 'Milk':
        return milkProducts

      case 'Paper':
        return paperProducts

      case 'Home':
        return homeProducts

      case 'Office':
        return officeProducts
    }
  }

  const searchProducts = (text) => {
    var initIndex = 0
    //Using boyer moore horspool to search text and sort them accordingly
    var arr = selectData()
    console.log(text.toString())
    if (text.toString().length > 3)
      arr.forEach((item, index) => {
        var itemname = item.name.toString().toLowerCase().trim()
        var searchname = text.toString().toLowerCase().trim()

        if (
          boyerMooreHorspool(
            Buffer.from(itemname),
            Buffer.from(searchname),
            0,
          ) != -1
        ) {
          console.log(initIndex)
          var temp = arr[initIndex]
          arr[initIndex] = item
          arr[index] = temp
          initIndex++
          console.log(item.name)
        }
      })

    //arr.reverse();

    setMilkRemount(Math.random(0.69))
  }

  return (
    <View style={{ ...StyleSheet.absoluteFill }}>
      <AppBar
        title="My Services"
        back={true}
        funct={() => navigation.goBack()}
      />
      <View style={{ height: dimen.height / 12 }} />
      <Text style={style.text}>What services do you offer?</Text>
      <View style={{ paddingHorizontal: 10 }}>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              padding: '1%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ ...style.checkableText, width: width }}>
              {words.milkDelivery}
            </Text>
            <View style={{ opacity: check1 ? 1 : 0 }}>
              <Button
                text="Select"
                onTouch={() => {
                  // { addProducts() }
                  setMilkRemount(Math.random(0.7))

                  setService('Milk')

                  toggleProducts(true)
                }}
              />
            </View>
            <View>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setCheck1(!check1)
                  console.log(check1)
                }}
              >
                {CheckBox(check1)}
              </TouchableOpacity>
            </View>
          </View>

          <View style={Styles.grayfullline} />

          <View
            style={{
              flexDirection: 'row',
              padding: '1%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ ...style.checkableText, width: width }}>
              {words.newspaperDelivery}
            </Text>
            <View style={{ opacity: check2 ? 1 : 0 }}>
              <Button
                text="Select"
                onTouch={() => {
                  // { addProducts() }
                  setService('Paper')
                  toggleProducts(true)
                }}
              />
            </View>
            <View>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setCheck2(!check2)
                }}
              >
                {CheckBox(check2)}
              </TouchableOpacity>
            </View>
          </View>

          <View style={Styles.grayfullline} />
          <View
            style={{
              flexDirection: 'row',
              padding: '1%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ ...style.checkableText, width: width }}>
              {words.homescrapCollection}
            </Text>
            <View style={{ opacity: check3 ? 1 : 0 }}>
              <Button
                text="Select"
                onTouch={() => {
                  // { addProducts() }
                  setService('Home')
                  toggleProducts(true)
                }}
              />
            </View>
            <View>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setCheck3(!check3)
                  console.log(check1)
                }}
              >
                {CheckBox(check3)}
              </TouchableOpacity>
            </View>
          </View>

          <View style={Styles.grayfullline} />

          <View
            style={{
              flexDirection: 'row',
              padding: '1%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              onLayout={({ nativeEvent }) => {
                setWidth(nativeEvent.layout.width)
              }}
              style={style.checkableText}
            >
              {words.officescrapCollection}
            </Text>
            <View style={{ opacity: check4 ? 1 : 0 }}>
              <Button
                text="Select"
                onTouch={() => {
                  // { addProducts() }
                  setService('Office')
                  toggleProducts(true)
                }}
              />
            </View>
            <View>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setCheck4(!check4)
                  console.log(check1)
                }}
              >
                {CheckBox(check4)}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      <Animated.View
        style={{
          width: dimen.width,
          height: dimen.height,
          zIndex: 100,
          elevation: 10,
          position: 'absolute',
          top: 0,
          transform: [{ translateY: translateCart }],
        }}
      >
        {/*Background blur*/}
        <View
          style={{
            height: dimen.height * 0.3,
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.7)',
            zIndex: 1000,
          }}
          onTouchEnd={() => {
            toggleProducts(false)
          }}
        />
        {/*Bottom Sheet*/}
        <View
          style={{
            height: dimen.height * 0.7,
            position: 'absolute',
            top: dimen.height * 0.3,
            width: dimen.width,
            backgroundColor: 'white',
          }}
        >
          <Text
            style={{
              ...Styles.heading,
              alignSelf: 'center',
              textAlign: 'center',
              padding: 10,
            }}
          >
            {selectHeading()}
          </Text>
          <TextInput
            ref={(ref) => (textRef = ref)}
            placeholder="Enter search value"
            dfg
            onChangeText={searchProducts}
            style={{
              backgroundColor: Colors.whiteBackground,
              padding: '1%',
              borderRadius: 50,
              height: dimen.height / 20,
              margin: '5%',
            }}
          />

          <FlatList
            style={Styles.productList}
            extraData={milkRemount}
            data={selectData()}
            renderItem={({ item, index }) => {
              //   return(<Text>{item.name}</Text>)
              var imageUrl
              if (service === 'Home') imageUrl = item.product_url
              else if (service === 'Office') imageUrl = item.product_image_url
              else if (service === 'Milk') imageUrl = item.product_img_url
              else if (service === 'Paper') imageUrl = item.product_image_url

              return (
                <VendorSelectProduct
                  index={index}
                  service={service}
                  sel={item.sel}
                  name={
                    service == 'Office'
                      ? item.officescrap_category_name
                      : item.name
                  }
                  imageURL={imageUrl}
                  product_id={item.id}
                  defaultSelected={item.sel}
                />
              )
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Animated.View>
      <View
        style={{
          padding: 10,
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
        }}
      >
        <SubmitButton
          text="Submit"
          onTouch={() => {
            let finalProducts = []
            var temparr = []
            if (check1) {
              temparr.push('milk')
              let ar = Array.from(selectedMilk)
              finalProducts = finalProducts.concat(ar)
              // if(ar.length == 0){
              //     alert('At least one product needs to be selected from each category');
              //     return;
              // }
            }
            if (check2) {
              let ar = Array.from(selectedPaper)
              finalProducts = finalProducts.concat(ar)
              temparr.push('newspaper')
              // if(ar.length == 0){
              //     alert('At least one product needs to be selected from each category');
              //     return;
              // }
            }
            if (check3) {
              let ar = Array.from(selectedHome)
              finalProducts = finalProducts.concat(ar)
              temparr.push('homescrap')
              // if(ar.length == 0){
              //     alert('At least one product needs to be selected from each category');
              //     return;
              // }
            }
            if (check4) {
              let ar = Array.from(selectedOffice)
              finalProducts = finalProducts.concat(ar)
              temparr.push('officescrap')
              // if(ar.length == 0){
              //     alert('At least one product needs to be selected from each category');
              //     return;
              // }
            }

            if (temparr.length === 0) {
              alert('Please select at least one service')
              return
            } else {
              let set = []
              finalProducts = finalProducts.sort()
              for (let i = 1; i < finalProducts.length; i++) {
                if (finalProducts[i] == finalProducts[i - 1]) {
                  finalProducts.delete(finalProducts[i])
                }
              }

              finalProducts.forEach((i) => {
                console.log('SET ' + i.name)
              })

              var milkIndices = []
              var paperIndices = []
              var officeIndices = []
              var homeIndices = []

              milkProducts.forEach((item) => {
                console.log(item)
                if (item.sel) milkIndices.push(item.id)
              })
              paperProducts.forEach((p) => {
                if (p.sel) paperIndices.push(p.id)
              })
              officeProducts.forEach((p) => {
                if (p.sel) officeIndices.push(p.officescrap_cat_id)
              })
              homeProducts.forEach((p) => {
                if (p.sel) homeIndices.push(p.id)
              })
              if (milkIndices.length === 0 && check1)
                alert('Please select at least one product from milk')
              else if (paperIndices.length === 0 && check2)
                alert('Please select at least one product from Newspapers')
              else if (officeIndices.length === 0 && check4)
                alert('Please select at least one category from office scrap')
              else if (homeIndices.length === 0 && check3)
                alert('Please select at least one home scrap product')
              else if (vendorEdit) {
                route.params.editVendorFunction(
                  temparr,
                  milkIndices,
                  paperIndices,
                  officeIndices,
                  homeIndices,
                )
                alert('Your details have been updated successfully')
                navigation.pop()
              } else {
                submit(
                  temparr,
                  milkIndices,
                  paperIndices,
                  officeIndices,
                  homeIndices,
                )
                //navigation.goBack();
                navigation.goBack()
              }
            }
          }}
        />
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    padding: 10,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    marginBottom: dimen.height / 20,
    width: dimen.width / 1.5,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 25,

    marginTop: 10,
    margin: 5,
  },
  line: {
    borderWidth: 0.5,
    borderColor: '#5D5D5D',
    marginTop: 10,
  },
  view: {
    flexDirection: 'row',
    marginTop: 12,
  },
  city: {
    marginTop: 5,
    marginStart: 7,
    fontSize: 18,
  },
  checkableText: {
    marginStart: 10,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  image: {
    width: 79,
    height: 80,
    position: 'absolute',
    marginStart: '-1%',

    marginTop: '3%',
  },
})
