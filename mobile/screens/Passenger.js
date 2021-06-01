import React, {useCallback, useState} from 'react'
import MapView, {Marker, Polyline} from 'react-native-maps'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableHighlight,
  Keyboard,
  ActivityIndicator,
  Image,
} from 'react-native'
import _ from 'lodash'
import socketIO from 'socket.io-client'

import {googleAPIKey} from '../config/googleAPIKey'
import colors from '../config/colors'
import BottomButton from '../components/BottomButton'

const Passenger = (props, {navigation}) => {
  const [destination, setDestination] = useState('')
  const [predictions, setPredictions] = useState([])
  const [routeResponse, setRouteResponse] = useState(null)
  const [isFindingDriver, setIsFindingDriver] = useState(false)
  const [driverLocation, setDriverLocation] = useState(null)

  const changeDestination = destination => {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${googleAPIKey}&input=${destination}&location=${props.latitude}, ${props.longitude}&radius=2000`
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
    [props.latitude, props.longitude],
  )

  const handleChangeDestination = destination => {
    setDestination(destination)
    debouncedChangeDestination(destination)
  }

  const handleGetRouteDirections = async (destinationId, destinationName) => {
    try {
      props.getRouteDirections(destinationId, destinationName).then(data => {
        // Set route
        setRouteResponse(data)

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

  const handleRequestDriver = () => {
    setIsFindingDriver(true)
    var socket = socketIO.connect('http://192.168.0.106:3000')

    socket.on('connect', () => {
      console.log('client connected')
      // Request a taxi!
      socket.emit('taxiRequest', routeResponse)
    })

    socket.on('driverLocation', location => {
      // Zoom out of map to include driver location
      props.mapRef.current.fitToCoordinates([...props.pointCoords, location])
      setIsFindingDriver(false)
      setDriverLocation(location)
    })
  }

  return (
    props.latitude &&
    props.longitude && (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: props.latitude,
            longitude: props.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          ref={props.mapRef}
        >
          <Polyline
            coordinates={props.pointCoords}
            strokeWidth={4}
            strokeColor="red"
          />
          {/* Put a marker for destination if there is a route */}
          {/* Destination point is the last coordinate */}
          {props.pointCoords.length > 1 && (
            <Marker
              coordinate={props.pointCoords[props.pointCoords.length - 1]}
            />
          )}

          {/* Display driver's location if there is a driver */}
          {driverLocation && (
            <Marker coordinate={driverLocation}>
              <Image
                style={{width: 40, height: 40}}
                source={require('../images/carIcon.png')}
              />
            </Marker>
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
                handleGetRouteDirections(
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

        {props.pointCoords.length > 1 && (
          <BottomButton func={handleRequestDriver} text="REQUEST 🚗">
            {isFindingDriver && (
              <ActivityIndicator
                animating={isFindingDriver}
                color={colors.primary}
                size="large"
              />
            )}
          </BottomButton>
        )}
      </View>
    )
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

export default Passenger
