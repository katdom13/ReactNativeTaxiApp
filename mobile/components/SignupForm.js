import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native'
import {Input} from 'react-native-elements'
import colors from '../config/colors'

const SignupForm = props => {
  return (
    <View>
      <Input
        style={styles.input}
        inputContainerStyle={styles.inputContainer}
        placeholder="First name"
        placeholderTextColor={colors.white}
        errorMessage={props.errorFormData && props.errorFormData.first_name}
        errorStyle={
          props.errorFormData && props.errorFormData.first_name && styles.error
        }
        autoCapitalize="words"
        autoCorrect={false}
        name="firstName"
        value={props.firstName}
        onChangeText={firstName => props.handleChange('firstName', firstName)}
      />
      <Input
        style={styles.input}
        inputContainerStyle={styles.inputContainer}
        placeholder="Last name"
        placeholderTextColor={colors.white}
        errorMessage={props.errorFormData && props.errorFormData.last_name}
        errorStyle={
          props.errorFormData && props.errorFormData.last_name && styles.error
        }
        autoCapitalize="words"
        autoCorrect={false}
        name="lastName"
        value={props.lastName}
        onChangeText={lastName => props.handleChange('lastName', lastName)}
      />
      <Input
        style={styles.input}
        inputContainerStyle={styles.inputContainer}
        placeholder="Username"
        placeholderTextColor={colors.white}
        errorMessage={props.errorFormData && props.errorFormData.username}
        errorStyle={
          props.errorFormData && props.errorFormData.username && styles.error
        }
        autoCapitalize="none"
        autoCorrect={false}
        name="username"
        value={props.username}
        onChangeText={username => props.handleChange('username', username)}
      />
      <Input
        style={styles.input}
        inputContainerStyle={styles.inputContainer}
        placeholder="Email"
        placeholderTextColor={colors.white}
        errorMessage={props.errorFormData && props.errorFormData.email}
        errorStyle={
          props.errorFormData && props.errorFormData.email && styles.error
        }
        autoCapitalize="none"
        autoCorrect={false}
        name="email"
        value={props.email}
        onChangeText={email => props.handleChange('email', email)}
      />
      <Input
        style={styles.input}
        inputContainerStyle={styles.inputContainer}
        placeholder="Password"
        placeholderTextColor={colors.white}
        errorMessage={props.errorFormData && props.errorFormData.password}
        errorStyle={
          props.errorFormData && props.errorFormData.password && styles.error
        }
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        name="username"
        value={props.password}
        onChangeText={password => props.handleChange('password', password)}
      />
      <TouchableOpacity style={styles.button} onPress={props.handleSignup}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
      <Text
        style={styles.link}
        onPress={() => props.navigation.navigate('Login')}
      >
        Already have an account? Log in
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ABC837',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 23,
    color: colors.white,
    fontWeight: '200',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
  },
  error: {
    marginTop: 0,
    marginBottom: 15,
    fontSize: 16,
    color: '#F5D7CC',
  },
  input: {
    height: 40,
    backgroundColor: '#8793A6',
    padding: 5,
    color: colors.white,
  },
  inputContainer: {
    borderBottomWidth: 0,
    marginBottom: 5,
  },
  link: {
    color: '#ABC837',
    fontSize: 18,
    textAlign: 'center',
  },
})

export default SignupForm
