import React from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import colors from '../config/colors'

const Selection = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Passenger')}
      >
        <Text style={styles.buttonText}>Passenger</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Driver')}
      >
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

export default Selection
