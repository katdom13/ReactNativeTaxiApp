import React, {useState} from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import 'react-native-gesture-handler'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import GenericContainer from './components/GenericContainer'
import colors from './config/colors'
import Driver from './screens/Driver'
import Passenger from './screens/Passenger'
import Selection from './screens/Selection'
import Login from './screens/Login'
import Signup from './screens/Signup'

const Stack = createStackNavigator()

const App = () => {
  // const [isDriver, setIsDriver] = useState(false)
  // const [isPassenger, setIsPassenger] = useState(false)

  // if (isDriver) {
  //   return <GenericContainer children={<Driver />} />
  // }

  // if (isPassenger) {
  //   return <GenericContainer children={<Passenger />} />
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Selection"
          component={Selection}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Driver"
          children={() => <GenericContainer children={<Driver />} />}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Passenger"
          children={() => <GenericContainer children={<Passenger />} />}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
