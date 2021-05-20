import React, {useCallback, useEffect, useState} from 'react'
import MapView from 'react-native-maps'
import {StyleSheet, View, TextInput, Text} from 'react-native'
import Geolocation from '@react-native-community/geolocation'
import _ from 'lodash'

import {googleAPIKey} from '../config/googleAPIKey'
import colors from '../config/colors'

const Map = () => {
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [error, setError] = useState(null)
  const [destination, setDestination] = useState('')
  const [predictions, setPredictions] = useState([])

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude)
        console.log('!!!', position.coords.latitude)
        setLongitude(position.coords.longitude)
        setError(null)
      },
      error => setError(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 2000,
      },
    )
  }, [])

  const handleChangeDestination = destination => {
    setDestination(destination)

    const debounced = _.debounce(destination => {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${googleAPIKey}&input=${destination}&location=${latitude}, ${longitude}&radius=2000`
      const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      }
      try {
        fetch(apiUrl, options)
          .then(response => response.json())
          .then(data => {
            setPredictions(data.predictions)
          })
      } catch (err) {
        console.error(err)
      }
    }, 1000)

    debounced(destination)
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      />
      <TextInput
        style={styles.destinationInput}
        placeholder="Enter destination..."
        value={destination}
        onChangeText={destination => handleChangeDestination(destination)}
      />
      {predictions &&
        predictions.map(prediction => (
          <Text style={styles.suggestion} key={prediction.description}>
            {prediction.description}
          </Text>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  destinationInput: {
    height: 40,
    borderWidth: 0.5,
    backgroundColor: colors.white,
    marginTop: 50,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  suggestion: {
    borderWidth: 0.5,
    backgroundColor: colors.white,
    fontSize: 18,
    padding: 5,
    marginLeft: 5,
    marginRight: 5,
  },
})

export default Map
