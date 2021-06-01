import React, {useState} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  Platform,
  Alert,
  Keyboard,
  ScrollView,
} from 'react-native'

import axiosInstance from '../config/axios'
import SignupForm from '../components/SignupForm'

const Signup = ({navigation}) => {
  const initialFormData = Object.freeze({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  })

  const [formData, setFormData] = useState(initialFormData)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorFormData, setErrorFormData] = useState(null)

  const handleChange = (inputName, inputValue) => {
    setFormData({
      ...formData,
      [inputName]: inputValue,
    })
  }

  const handleSignup = async () => {
    try {
      // Delete prior errors
      setErrorMessage('')

      const {firstName, lastName, username, email, password} = formData
      await axiosInstance
        .post('users/', {
          first_name: firstName,
          last_name: lastName,
          username: username,
          email: email,
          password: password,
        })
        .then(async response => {
          Alert.alert('Account created', 'Please log in', [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Login')
              },
            },
          ])
        })
        .catch(err => {
          console.log('AAAAAAAAAAAAAAAAAAAA', err.response.data)
          // setErrorMessage(err.response.data.detail)
          setErrorFormData(err.response.data)
        })
      Keyboard.dismiss()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>React Native Taxi</Text>
      <SignupForm
        firstName={formData.firstName}
        lastName={formData.lastName}
        username={formData.username}
        email={formData.email}
        password={formData.password}
        handleChange={handleChange}
        handleSignup={handleSignup}
        navigation={navigation}
        errorFormData={errorFormData}
      />
      <Text style={styles.errorMessage}>{errorMessage}</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A3743',
  },
  errorMessage: {
    paddingHorizontal: 10,
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

export default Signup
