import React, { useState, useContext, useEffect, ReactDOM } from 'react'
import auth from '@react-native-firebase/auth'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-community/async-storage'
import Axios from 'axios'
import { Config, Constants } from '../Constants'
import qs from 'qs'
import App from '../../App'
import { mdiTrumpet } from '@mdi/js'
import messaging from '@react-native-firebase/messaging'

export const AuthConstants = {
  saved_user: 'saved_user',
  phone_unverified: 1,
  phone_verified: 2,
  new_user: 3,
  loading: 4,
  errored: 5,
  saved_vendor: 'saved_vendor',
}

export const AuthContext = React.createContext({
  user: auth().currentUser,
  sync: () => {},
})

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(AuthConstants.loading)
  const [vendor, setVendor] = useState(AuthConstants.loading)
  const debug = false
  const debugNumber = '9535311386'

  const checkUserAccounts = () => {
    NetInfo.addEventListener((state) => {
      if (state.isInternetReachable) checkFirstTime()
      else setUser(AuthConstants.errored)
    })
  }

  const logout = async () => {
    await auth().signOut()

    setUser(AuthConstants.phone_unverified)
    AsyncStorage.removeItem(AuthConstants.saved_user)
    AsyncStorage.removeItem(AuthConstants.saved_vendor)
    checkFirstTime()
  }

  const syncAndCacheUser = async () => {
    try {
      if (user == AuthConstants.phone_verified) setUser(AuthConstants.loading)
      const result = (
        await Axios.get(
          Config.api_url +
            'php?' +
            qs.stringify({
              action: 'getUser',
              phone: debug
                ? debugNumber
                : auth().currentUser.phoneNumber.substring(3),
            }),
        )
      ).data
      if (
        result.user[0].status_code != '100' &&
        result.user[0].status_code != 100
      ) {
        setUser(result.user[0])
        const user_result = result.user[0]
        messaging().subscribeToTopic('user' + user_result.user_id)
        //Caching?
        AsyncStorage.setItem(
          AuthConstants.saved_user,
          JSON.stringify(result.user[0]),
        )
        //Vendor
        try {
          const result = (
            await Axios.get(
              Config.api_url +
                'php?action=getVendorStatus&user_id=' +
                user_result.user_id,
            )
          ).data
          setVendor(result)
          console.log('oiasjoiajois', result)
          if (result.vendor[0].vendor_status === 'active') {
            try {
              const result1 = (
                await Axios.get(
                  Config.api_url +
                    'php?' +
                    qs.stringify({
                      action: 'getVendor',
                      user_id: user_result.user_id,
                    }),
                )
              ).data
              setVendor(result1.vendor)
              AsyncStorage.setItem(
                AuthConstants.saved_vendor,
                JSON.stringify(result1.vendor),
              )
              messaging().subscribeToTopic('vendor' + result1.vendor.vendor_id)
            } catch (error) {
              setVendor(AuthConstants.errored)
            }
          } else if (result.vendor[0].vendor_status === 'inprogress') {
            setVendor(Constants.veInProgress)
          } else {
            setVendor(Constants.veTryAgain)
          }
        } catch (r) {
          console.log('exceptiononvefirsttime')
          setVendor({ vendor_status: Constants.veFirstTime })
        }
      } else {
        setUser(AuthConstants.phone_verified)
        AsyncStorage.removeItem(AuthConstants.saved_user)
        AsyncStorage.removeItem(AuthConstants.saved_vendor)
      }
    } catch (error) {
      setUser(AuthConstants.errored)
    }

    //sync and cache vendor
  }

  const checkFirstTime = async () => {
    const saved_user = await AsyncStorage.getItem(AuthConstants.saved_user)

    if (debug) {
      syncAndCacheUser()
    } else {
      if (auth().currentUser == null && debug == false) {
        setUser(AuthConstants.phone_unverified)
        if (saved_user != null)
          AsyncStorage.removeItem(AuthConstants.saved_user, (error) => {})
        return
      } else if (saved_user != null || saved_user != undefined)
        try {
          setUser(JSON.parse(saved_user))
        } catch (err) {
          //The next line fetches user from the database anyway
        }
      else syncAndCacheUser()

      try {
        const saved_vendor = await AsyncStorage.getItem(
          AuthConstants.saved_vendor,
        )
        if (saved_vendor != null && saved_vendor != undefined)
          try {
            setVendor(JSON.parse(saved_vendor))
          } catch (error) {}
      } catch (error) {}
    }

    syncAndCacheUser()
  }

  useEffect(() => {
    checkUserAccounts()
    auth().onAuthStateChanged((user) => {
      if (user != null) {
        //setUser(AuthConstants.phone_verified);
        checkUserAccounts()
      }
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: user,
        vendor: vendor,
        phone: debug
          ? debugNumber
          : auth().currentUser != null
          ? auth().currentUser.phoneNumber.substring(3)
          : null,
        sync: syncAndCacheUser,
        logout: logout,
        checkFirstTime: checkFirstTime,
      }}
    >
      <App />
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
