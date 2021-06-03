import { StyleSheet, Dimensions } from 'react-native'

export const Config = {
  api_url: 'https://api.dev.we-link.in/user_app.',
}

export const notification_identifiers = {
  vendor_milk_subscriptions: '1',
  vendor_newspaper_subscriptions: '2',
  user_milk_subscriptions: '3',
  user_newspaper_subscriptions: '4',
  vendor_scrap_orders: '5',
  user_scrap_orders: '6',
  misc: '7',
  user_corporate_orders: '8',
  vendor_corporate_orders: '9',
}

export const monthNames = [
  '',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const strings_screen = {
  ratings: {
    heading:
      'Please review your previous order before proceeding with next subscription',
    hint: 'Review Comments (Optional)',
    textbox_title: ' as',
  },
}

export const dimen = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
  appbarHeight: Dimensions.get('window').height / 16,
  bottomMargin: Dimensions.get('window').height / 60,
  sVm: Dimensions.get('window').height / 100,
  mVm: Dimensions.get('window').height / 60,
  bVm: Dimensions.get('window').height / 30,
  sHm: Dimensions.get('window').width / 30,
}

export const Colors = {
  primary: '#00C4B6', // primary: '#00C99D',"#00C4B6"
  secondary: '#EDF9F9',
  seperatorGray: 'rgba(211,211,211,255)',
  lightIcon: '#D3D3D3',
  disabledButton: '#BBC0C4',
  white: '#FFFFFF',
  blue: '#6775DD', // Bids
  red: '#F61F1F', // Cancel
  whiteBackground: '#F9F9F9',
  buttonEnabledGreen: '#64E4cE',
  lightBlue: '#EDF9F9',
  ratingStars: '#F7B604',
  black: '#000000',
  gray: 'gray',
}

export const Constants = {
  Logged: 'Logged',
  firstLogin: 'FIRST_LOGIN',
  username: 'USERNAME',
  city: 'CITY',
  selectedAddress: 'selectedAddress',
  shareMessage:
    'Hey! Check out WeLinks, the one stop destination for your daily needs! https://www.google.com\nUse my referral code!',
  veFirstTime: 'firstTime',
  veInProgress: 'inprogress',
  veRejected: 'rejected',
  veTryAgain: 'tryAgain',
  verified: 'active',
}
export const Styles = StyleSheet.create({
  //Common Styles
  heading: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: '2%',
    alignSelf: 'flex-start',
    color: 'black',
  },
  title: {
    color: 'black',
    margin: '5%',
    fontSize: 20,
    marginVertical: '5%',
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 14,
    color: 'gray',
  },
  subbold: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'bold',
  },
  grayfullline: {
    height: 0.5,
    width: '95%',
    borderWidth: 0.3,
    borderColor: Colors.seperatorGray,
    //   color: Colors.seperatorGray,
    marginVertical: 5,
    alignSelf: 'center',
    zIndex: 100,
    elevation: 0.2,
  },
  selectionButton: {},

  parentContainer: {
    width: '100%',
    height: dimen.height - dimen.height / 14,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    marginTop: Dimensions.get('window').height / 14,
  },
  fortyUpperPanel: {
    width: '100%',
    minHeight: '40%',

    backgroundColor: Colors.lightBlue,
    flex: 0,
  },
  horizontal: {
    flexDirection: 'row',
    width: '100%',
    height: '50%',
    alignContent: 'center',
  },
  vendorImage: {
    flex: 1,
    height: '100%',
  },
  vendorInfo: {
    flex: 3,
    height: '100%',
    backgroundColor: 'pink',
  },
  halfFlatList: {
    height: '50%',
    width: '100%',
    alignSelf: 'center',
    margin: 10,
    padding: 10,
  },
  horizontalImage: {
    //    marginTop: 5,
    height: Dimensions.get('window').height * 0.13 - 30,
    width: Dimensions.get('window').height * 0.13 - 30,
    marginHorizontal: 10,
  },
  sixtyLowerPanel: {
    height: '70%',
  },
  accordion: {
    width: '100%',

    // borderWidth: 5,
  },
  collapsedView: {
    height: Dimensions.get('window').height / 9 - 18,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    //  backgroundColor: 'blue',

    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  collapsibleView: {
    width: '100%',
    //      backgroundColor: 'pink'
  },
  productList: {
    height: Dimensions.get('window').height * 0.45, //nominal value was 65 -30
    width: '100%',
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vendorFlat: {
    width: Dimensions.get('window').width,
  },
  submitButton: {
    position: 'absolute',
    flex: 1,
    bottom: 20,
    left: 10,
    right: 10,
    width: Dimensions.get('window').width - 20,
    borderRadius: 10,
    height: Dimensions.get('window').height / 12,
    minHeight: 40,
  },
  collapsedText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  touchableButtonBorder: {
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
  },

  //Scrapcart.js mainly
  submitButtonBottom: {
    width: '90%',
    height: Dimensions.get('window').height / 14,
    bottom: 15,
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.seperatorGray,
    elevation: 1,
  },
  horizontalCalendarButtonsRow: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  horizontalRow: {
    justifyContent: 'space-between',
    padding: 5,
    margin: 5,
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  horizontalCalendarRow: {
    fontSize: 14,
    marginLeft: 20,
    marginTop: 20,
    alignSelf: 'flex-start',
    color: 'gray',
  },
  dayButton: {
    width: dimen.width / 8,
    height: dimen.width / 8,
    alignItems: 'center',
    borderRadius: 100,
    justifyContent: 'center',
  },
  scrapWeekView: {
    width: '100%',
    flexDirection: 'row',
    padding: '2%',
    justifyContent: 'space-evenly',
  },
  scrapTopCart: {
    //  height: dimen.height/1.2,
    width: '100%',
    //   paddingVertical: '5%'
  },
  scrapBottom: {
    height: '60%',
    width: '100%',
    backgroundColor: Colors.secondary,
  },
})

export const ScrapStyles = StyleSheet.create({
  heading: {
    ...Styles.heading,
    alignSelf: 'center',
    color: Colors.primary,
  },
  subheading: {
    ...Styles.subheading,
    alignSelf: 'center',
  },
  timebutton: {
    borderWidth: 1,
    borderRadius: 5,
    padding: '3%',
    alignSelf: 'center',
  },
})

export const TextSpinnerBoxStyles = StyleSheet.create({
  mainContainer: {
    paddingVertical: dimen.height / 100,
    marginTop: dimen.height / 100,
    paddingHorizontal: dimen.width * 0.1,
    alignSelf: 'center',
  },
  text: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    //   backgroundColor: '#F9F9F9'
  },
  input: {
    height: dimen.height / 15,
    backgroundColor: 'white',
    alignSelf: 'center',
    width: dimen.width * 0.85,
  },
  answer: {
    marginTop: 8,
    height: dimen.height / 14,
    width: Dimensions.get('window').width - 30,
    backgroundColor: 'white',
    borderColor: Colors.seperatorGray,
    borderWidth: 1,
    borderRadius: 5,
  },
  icon: {
    padding: 6,
  },
})
