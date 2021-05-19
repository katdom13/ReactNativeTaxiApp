import React from 'react'
import MapView from 'react-native-maps'
import {StyleSheet} from 'react-native'

const App = () => {
  return (
    <MapView
      style={styles.mapStyle}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
  )
}

const styles = StyleSheet.create({
  mapStyle: {
    flex: 1,
  },
})

export default App
