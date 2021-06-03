import React from 'react'
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { useAuth } from '../../services/auth-service'
import { EvilIcons } from '@expo/vector-icons'
import { dimen } from '../../Constants'

// TopBar present in Homescreen

const TopBar = ({ homescreenRef }) => {
  const authContext = useAuth()
  const user = authContext.user

  // User city
  const CityChip = () => {
    return (
      <TouchableOpacity
        style={styles.usernamecontainer}
        onPress={() => {
          homescreenRef.props.navigation.navigate('City', {
            edit: true,
            tag: 'home',
            refreshUser: homescreenRef.retrieveUserData,
            user_id: homescreenRef.state.actualUser.user_id,
            actualUser: homescreenRef.state.actualUser,
          })
        }}
      >
        <Image
          style={styles.locim}
          source={require('../../../assets/pin.png')}
        />
        <Text adjustsFontSizeToFit style={styles.username}>
          {user.city}
        </Text>
      </TouchableOpacity>
    )
  }

  // Name and image
  const UserDisplayChip = () => {
    return (
      <TouchableOpacity
        style={styles.usernamecontainer}
        onPress={() => {
          homescreenRef.state.drawer.navigate('ProfileStack')
        }}
      >
        <Image
          style={styles.userimage}
          source={
            user.img_url.trim() != ''
              ? { uri: user.img_url }
              : require('../../../assets/notmaleavatar.png')
          }
        />
        <Text adjustsFontSizeToFit style={styles.username}>
          {user.name}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.topbar}>
      <TouchableOpacity
        onPress={() => {
          homescreenRef.setState({ pressedMenu: true })
          homescreenRef.state.drawer.toggleDrawer()
        }}
      >
        <EvilIcons
          name="navicon"
          size={24}
          color="black"
          style={{ alignSelf: 'center', padding: 10 }}
        />
      </TouchableOpacity>
      <View style={styles.topBarAlignChips}>
        <UserDisplayChip />
        <CityChip />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '7%',
    width: '100%',
    marginBottom: '5%',
    alignContent: 'center',
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.37,
    shadowRadius: 6.49,
    elevation: 3,
  },
  usernamecontainer: {
    flexDirection: 'row',
    borderRadius: 100,
    borderWidth: 0.525,
    borderColor: 'rgba(211,211,211,255)',
    padding: '3%',
    paddingVertical: '0.5%',
    alignItems: 'center',
    justifyContent: 'space-evenly',

    height: '70%',
  },

  topBarAlignChips: {
    flexDirection: 'row',
    width: dimen.width - 50,
    alignSelf: 'center',
    justifyContent: 'space-between',
    height: '100%',
    alignItems: 'center',
  },

  username: {
    fontWeight: 'bold',
    fontSize: 14,

    alignSelf: 'center',
    color: 'black',
    paddingVertical: '1%',
    paddingHorizontal: '2%',
  },
  locim: {
    height: dimen.height * 0.018,
    width: dimen.height * 0.018,
  },
  userimage: {
    height: dimen.height * 0.023,
    width: dimen.height * 0.023,
  },
})
export default TopBar
