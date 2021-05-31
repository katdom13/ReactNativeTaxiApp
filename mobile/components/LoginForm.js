import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'
import colors from '../config/colors'

const LoginForm = props => {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        placeholderTextColor={colors.white}
        autoCapitalize="none"
        autoCorrect={false}
        name="username"
        value={props.username}
        onChangeText={username => props.handleChange('username', username)}
      />
      <TextInput
        style={styles.input}
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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
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
    padding: 10,
    color: colors.white,
    marginBottom: 10,
  },
})

export default LoginForm
