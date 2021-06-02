import React, {useContext, useState} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  Platform,
  Alert,
  Keyboard,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import LoginForm from '../components/LoginForm'
// import axiosInstance from '../config/axios'
import AppContext from '../contexts/AppContext'
import {AxiosContext} from '../contexts/AxiosContext'

const Login = ({navigation}) => {
  const initialFormData = Object.freeze({
    username: '',
    password: '',
  })

  const [formData, setFormData] = useState(initialFormData)
  const [errorMessage, setErrorMessage] = useState('')

  const {authContext} = useContext(AppContext)
  const {login} = authContext
  const axiosInstance = useContext(AxiosContext)

  const handleChange = (inputName, inputValue) => {
    setFormData({
      ...formData,
      [inputName]: inputValue,
    })
  }

  const handleLogin = async () => {
    try {
      // Delete prior errors
      setErrorMessage('')

      const {username, password} = formData
      await axiosInstance
        .post('token/', {username, password})
        .then(async response => {
          // Set token from API
          await AsyncStorage.setItem('access_token', response.data.access)
          await AsyncStorage.setItem('refresh_token', response.data.refresh)

          // Get token form local storage
          const accessToken = await AsyncStorage.getItem('access_token')
          const refreshToken = await AsyncStorage.getItem('refresh_token')

          // Set headers using token
          axiosInstance.defaults.headers.Authorization = 'Bearer ' + accessToken

          Alert.alert('Access Token', accessToken, [
            {
              text: 'OK',
              onPress: () => {
                // Dispatch action: set state in reducer context
                login({access_token: accessToken, refreshToken: refreshToken})
              },
            },
          ])
        })
        .catch(err => {
          setErrorMessage(err.response.data.detail)
        })
      Keyboard.dismiss()
    } catch (err) {
      console.error('[]', err)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>React Native Taxi</Text>
      <LoginForm
        username={formData.username}
        password={formData.password}
        handleChange={handleChange}
        handleLogin={handleLogin}
        navigation={navigation}
      />
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <Image source={require('../images/greencar.png')} style={styles.logo} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A3743',
  },
  errorMessage: {
    padding: 15,
    fontSize: 18,
    color: '#F5D7CC',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 44,
    textAlign: 'center',
    color: '#C1D76D',
    marginVertical: 30,
    fontWeight: '200',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
  },
  logo: {
    height: 300,
    width: 300,
    alignSelf: 'center',
  },
})

export default Login
