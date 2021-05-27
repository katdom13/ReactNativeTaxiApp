import {useEffect, useRef, useState} from 'react'
import Geolocation from '@react-native-community/geolocation'
import PolyLine from '@mapbox/polyline'

import {googleAPIKey} from '../config/googleAPIKey'

const useGenericMapInfo = () => {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [error, setError] = useState(null)
  const [pointCoords, setPointCoords] = useState([])
  const mapRef = useRef(null)

  useEffect(() => {
    let watchId = Geolocation.watchPosition(
      position => {
        setLatitude(position.coords.latitude)
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

    return () => {
      Geolocation.clearWatch(watchId)
    }
  }, [])

  // Output any changes to error
  useEffect(() => {
    if (error != null) {
      console.error(error)
    }
  }, [error])

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
      let fetchedData = null
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

          // The data is to be returned
          fetchedData = data
        })
      return fetchedData
    } catch (err) {
      console.error(err)
    }
  }

  return {latitude, longitude, pointCoords, mapRef, getRouteDirections}
}

export default useGenericMapInfo
