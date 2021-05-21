import React, {useCallback, useEffect, useState} from 'react'
import MapView, {Marker, Polyline} from 'react-native-maps'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableHighlight,
  Keyboard,
} from 'react-native'
import Geolocation from '@react-native-community/geolocation'
import _ from 'lodash'
import PolyLine from '@mapbox/polyline'

import {googleAPIKey} from '../config/googleAPIKey'
import colors from '../config/colors'

const Map = () => {
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [error, setError] = useState(null)
  const [destination, setDestination] = useState('')
  const [predictions, setPredictions] = useState([])
  const [pointCoords, setPointCoords] = useState([])

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

  const changeDestination = destination => {
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
  }

  const debouncedChangeDestination = useCallback(
    _.debounce(changeDestination, 1000),
    [latitude, longitude],
  )

  const getRouteDirections = (destinationId, destinationName) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=place_id:${destinationId}&key=${googleAPIKey}`
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
          // Decode polylines to an actual coordinates list
          const points = PolyLine.decode(
            data.routes[0].overview_polyline.points,
          )
          const pointCoords = points.map(point => {
            return {latitude: point[0], longitude: point[1]}
          })
          setPointCoords(pointCoords)

          // Set name in destination input to shortened name
          setDestination(destinationName)

          // Reset destination predictions
          setPredictions([])

          // Dismiss android keyboard
          Keyboard.dismiss()
        })
    } catch (err) {
      console.error(err)
    }
  }

  const handleChangeDestination = destination => {
    setDestination(destination)
    debouncedChangeDestination(destination)
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
      >
        <Polyline coordinates={pointCoords} strokeWidth={4} strokeColor="red" />
        {/* Put a marker for destination if there is a route */}
        {/* Destination point is the last coordinate */}
        {pointCoords.length > 1 && (
          <Marker coordinate={pointCoords[pointCoords.length - 1]} />
        )}
      </MapView>
      <TextInput
        style={styles.destinationInput}
        placeholder="Enter destination..."
        value={destination}
        onChangeText={handleChangeDestination}
      />
      {predictions &&
        predictions.map(prediction => (
          <TouchableHighlight
            key={prediction.description}
            onPress={() =>
              getRouteDirections(
                prediction.place_id,
                prediction.structured_formatting.main_text,
              )
            }
          >
            <View>
              <Text style={styles.suggestion}>{prediction.description}</Text>
            </View>
          </TouchableHighlight>
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
