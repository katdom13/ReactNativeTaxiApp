import React, {useState} from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'

import GenericContainer from './components/GenericContainer'
import colors from './config/colors'
import Driver from './screens/Driver'
import Passenger from './screens/Passenger'

const App = () => {
  const [isDriver, setIsDriver] = useState(false)
  const [isPassenger, setIsPassenger] = useState(false)

  if (isDriver) {
    return <GenericContainer children={<Driver />} />
  }

  if (isPassenger) {
    return <GenericContainer children={<Passenger />} />
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsPassenger(true)}
      >
        <Text style={styles.buttonText}>Passenger</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setIsDriver(true)}>
        <Text style={styles.buttonText}>Driver</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.primary,
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    marginTop: 50,
  },
})

export default App
