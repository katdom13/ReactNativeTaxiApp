import React, {useEffect, useState} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  NativeModules,
  Platform,
  Text,
} from 'react-native'
import {io} from 'socket.io-client'

const {StatusBarManager} = NativeModules
let socket

const App = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket = io('http://192.168.0.106:3000')
  }, [])

  useEffect(() => {
    socket.on('chat message', message => {
      setMessages([...messages, message])
    })
  }, [messages])

  const handleSubmitMessage = () => {
    socket.emit('chat message', message)
    setMessage('')
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={{
          height: 40,
          borderWidth: 2,
        }}
        autoCorrect={false}
        onChangeText={setMessage}
        value={message}
        onSubmitEditing={handleSubmitMessage}
      />
      {messages && messages.map(message => <Text>{message}</Text>)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 0,
  },
})

export default App
