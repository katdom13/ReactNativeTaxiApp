import React, {useEffect, useMemo, useReducer} from 'react'
import 'react-native-gesture-handler'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import GenericContainer from './components/GenericContainer'
import Driver from './screens/Driver'
import Passenger from './screens/Passenger'
import Selection from './screens/Selection'
import Login from './screens/Login'
import Signup from './screens/Signup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppContext from './contexts/AppContext'

const Stack = createStackNavigator()

const App = () => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      return action
    },
    {isAuthenticated: false},
    () => {
      const bootStrapAsync = async () => {
        let token = null
        try {
          token = await AsyncStorage.getItem('access_token')
        } catch (err) {
          console.log(err)
        }

        // return token ? {isAuthenticated: true} : {isAuthenticated: false}
        dispatch({isAuthenticated: token ? true : false})
      }

      return bootStrapAsync()
    },
  )

  useEffect(async () => {
    await AsyncStorage.removeItem('access_token')
  }, [])

  useEffect(() => {
    console.log('AAA', state.isAuthenticated)
  }, [state])

  const authContext = useMemo(() => {
    return {
      login: async () => dispatch({isAuthenticated: true}),
    }
  }, [])

  return (
    <AppContext.Provider value={authContext}>
      <NavigationContainer>
        {state.isAuthenticated === false ? (
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
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
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
        )}
      </NavigationContainer>
    </AppContext.Provider>
  )
}

export default App
