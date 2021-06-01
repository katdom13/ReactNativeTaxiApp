import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'
import {Input} from 'react-native-elements'

import colors from '../config/colors'

const LoginForm = props => {
  return (
    <View>
      <Input
        style={styles.input}
        inputContainerStyle={styles.inputContainer}
        placeholder="Username or Email"
        placeholderTextColor={colors.white}
        autoCapitalize="none"
        autoCorrect={false}
        name="username"
        value={props.username}
        onChangeText={username => props.handleChange('username', username)}
      />
      <Input
        style={styles.input}
        inputContainerStyle={styles.inputContainer}
        placeholder="Password"
        placeholderTextColor={colors.white}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        name="username"
        value={props.password}
        onChangeText={password => props.handleChange('password', password)}
      />
      <TouchableOpacity style={styles.button} onPress={props.handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <Text
        style={styles.link}
        onPress={() => props.navigation.navigate('Signup')}
      >
        Do not have an account yet? Sign up
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

export default LoginForm
