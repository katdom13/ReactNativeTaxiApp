import React, {useContext, useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import {AppContext} from '../contexts/AppContext'
import GenericContainer from '../components/GenericContainer'
import Driver from '../screens/Driver'
import Passenger from '../screens/Passenger'
import Selection from '../screens/Selection'
import Login from '../screens/Login'
import Signup from '../screens/Signup'

const Stack = createStackNavigator()

const AppStack = () => {
  const context = useContext(AppContext)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (context.access) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [context])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <>
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
          </>
        ) : null}
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

export default AppStack
