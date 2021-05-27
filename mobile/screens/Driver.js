import React, {useEffect, useState} from 'react'
import MapView, {Marker, Polyline} from 'react-native-maps'
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  // For linking to third party apps
  Linking,
  // For detecting the OS
  Platform,
  Alert,
} from 'react-native'
import socketIO from 'socket.io-client'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'

import colors from '../config/colors'
import BottomButton from '../components/BottomButton'

const Driver = props => {
  const [isFindingPassengers, setIsFindingPassengers] = useState(false)
  const [isPassengerFound, setIsPassengerFound] = useState(false)
  const [buttonText, setButtonText] = useState('FIND A PASSENGER 👥')
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
    })

    BackgroundGeolocation.on('authorization', status => {
      console.log(
        '[INFO] BackgroundGeolocation authorization status: ' + status,
      )
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              'App requires location tracking permission',
              'Would you like to open app settings?',
              [
                {
                  text: 'Yes',
                  onPress: () => BackgroundGeolocation.showAppSettings(),
                },
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            ),
          1000,
        )
      }
    })

    return () => {
      BackgroundGeolocation.removeAllListeners()
    }
  }, [])

  const handleGetRouteDirections = async (destinationId, destinationName) => {
    try {
      props.getRouteDirections(destinationId, destinationName)
    } catch (err) {
      console.error(err)
    }
  }

  const handleFindPassengers = () => {
    setIsFindingPassengers(true)
    setButtonText('FINDING A PASSENGER...')
    var socket = socketIO.connect('http://192.168.0.106:3000')
    setSocket(socket)

    socket.on('connect', () => {
      // Find passengers!
      socket.emit('findPassenger')
    })

    socket.on('taxiRequest', routeResponse => {
      console.log(routeResponse)
      handleGetRouteDirections(
        routeResponse.geocoded_waypoints[0].place_id,
        'Passenger',
      )
      setIsFindingPassengers(false)
      setIsPassengerFound(true)
      setButtonText('FOUND A PASSENGER! ACCEPT?')
    })
  }

  const handleAcceptPassengerRequest = () => {
    const passengerLocation = props.pointCoords[props.pointCoords.length - 1]

    BackgroundGeolocation.on('location', location => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {
        console.log('[DRIVER]: ACCEPT PASSENGER')
        console.log('[DEBUG] BackgroundGeolocation location', location)
        const {latitude, longitude} = location
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        socket.emit('driverLocation', {
          latitude: latitude,
          longitude: longitude,
        })
        // Readjust Polylines (?)
        // getRouteDirections(routeResponse.geocoded_waypoints[0].place_id)
        BackgroundGeolocation.endTask(taskKey)
      })
    })

    BackgroundGeolocation.start() //triggers start on start event

    if (Platform.OS === 'ios') {
      Linking.openURL(
        `http://maps.apple.com/?daddr=${passengerLocation.latitude},${passengerLocation.longitude}`,
      )
    } else {
      Linking.openURL(
        `geo:${props.latitude},${props.longitude}?q=${passengerLocation.latitude},${passengerLocation.longitude}(Passenger)`,
      )
    }
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
            >
              <Image
                style={{width: 40, height: 40}}
                source={require('../images/person-marker.png')}
              />
            </Marker>
          )}
        </MapView>
        <BottomButton
          // This function depends on status
          func={
            isPassengerFound
              ? handleAcceptPassengerRequest
              : handleFindPassengers
          }
          text={buttonText}
        >
          {isFindingPassengers && (
            <ActivityIndicator
              animating={isFindingPassengers}
              color={colors.primary}
              size="large"
            />
          )}
        </BottomButton>
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

export default Driver
