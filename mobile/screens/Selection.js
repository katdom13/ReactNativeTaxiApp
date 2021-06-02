import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Platform,
} from 'react-native'
import colors from '../config/colors'

const Selection = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.choiceContainer, {borderBottomWidth: 1}]}
        onPress={() => navigation.navigate('Driver')}
      >
        <Text style={styles.choiceText}>I'm a driver</Text>
        <Image
          source={require('../images/steeringwheel.png')}
          style={styles.selectionImage}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.choiceContainer}
        onPress={() => navigation.navigate('Passenger')}
      >
        <Text style={styles.choiceText}>I'm a Passenger</Text>
        <Image
          source={require('../images/passenger.png')}
          style={styles.selectionImage}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  choiceContainer: {
    flex: 1,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '200',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : null,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#3A3743',
  },
  selectionImage: {
    height: 200,
    width: 200,
  },
})

export default Selection
