import React, {useEffect, useRef, useState} from 'react'
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
import Geolocation from '@react-native-community/geolocation'
import PolyLine from '@mapbox/polyline'
import socketIO from 'socket.io-client'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'

import {googleAPIKey} from '../config/googleAPIKey'
import colors from '../config/colors'
import BottomButton from '../components/BottomButton'

const Driver = () => {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [error, setError] = useState(null)
  const [pointCoords, setPointCoords] = useState([])
  const mapRef = useRef(null)
  const [isFindingPassengers, setIsFindingPassengers] = useState(false)
  const [isPassengerFound, setIsPassengerFound] = useState(false)
  const [buttonText, setButtonText] = useState('FIND A PASSENGER 👥')
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    let watchId = Geolocation.watchPosition(
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
      Geolocation.watchPosition(watchId)
      BackgroundGeolocation.removeAllListeners()
    }
  }, [])

  // Output any changes to error
  useEffect(() => {
    if (error != null) {
      console.error(error)
    }
  }, [error])

  const getRouteDirections = destinationId => {
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

          // Zoom out
          mapRef.current.fitToCoordinates(pointCoords)
        })
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
      // console.log('client connected')
      // Request a taxi!
      socket.emit('findPassenger')
    })

    socket.on('taxiRequest', routeResponse => {
      console.log(routeResponse)
      getRouteDirections(routeResponse.geocoded_waypoints[0].place_id)
      setIsFindingPassengers(false)
      setIsPassengerFound(true)
      setButtonText('FOUND A PASSENGER! ACCEPT?')
    })
  }

  const handleAcceptPassengerRequest = () => {
    const passengerLocation = pointCoords[pointCoords.length - 1]

    BackgroundGeolocation.on('location', location => {
      //Send driver location to passenger
      console.log('[DRIVER]: ACCEPT PASSENGER')
      console.log('[DEBUG] BackgroundGeolocation location', location)
      const {latitude, longitude} = location
      // execute long running task
      // eg. ajax post location
      // IMPORTANT: task has to be ended by endTask
      setLatitude(latitude)
      setLongitude(longitude)
      socket.emit('driverLocation', {
        latitude: latitude,
        longitude: longitude,
      })
    })

    // BackgroundGeolocation.on('location', location => {
    //   // handle your locations here
    //   // to perform long running operation on iOS
    //   // you need to create background task
    //   BackgroundGeolocation.startTask(taskKey => {
    //     console.log('[DRIVER]: ACCEPT PASSENGER')
    //     console.log('[DEBUG] BackgroundGeolocation location', location)
    //     const {latitude, longitude} = location
    //     // execute long running task
    //     // eg. ajax post location
    //     // IMPORTANT: task has to be ended by endTask
    //     setLatitude(latitude)
    //     setLongitude(longitude)
    //     socket.emit('driverLocation', {
    //       latitude: latitude,
    //       longitude: longitude,
    //     })
    //     BackgroundGeolocation.endTask(taskKey)
    //   })
    // })

    BackgroundGeolocation.checkStatus(status => {
      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start() //triggers start on start event
      }
    })

    if (Platform.OS === 'ios') {
      Linking.openURL(
        `http://maps.apple.com/?daddr=${passengerLocation.latitude},${passengerLocation.longitude}`,
      )
    } else {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${passengerLocation.latitude},${passengerLocation.longitude}`,
      )
    }
  }

  return latitude === null ? null : (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude === null ? 0 : latitude,
          longitude: longitude === null ? 0 : longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        ref={mapRef}
      >
        <Polyline coordinates={pointCoords} strokeWidth={4} strokeColor="red" />
        {/* Put a marker for destination if there is a route */}
        {/* Destination point is the last coordinate */}
        {pointCoords.length > 1 && (
          <Marker coordinate={pointCoords[pointCoords.length - 1]}>
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
          isPassengerFound ? handleAcceptPassengerRequest : handleFindPassengers
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
