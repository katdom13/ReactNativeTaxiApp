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
import {View, ActivityIndicator} from 'react-native'
import colors from './config/colors'
import {AxiosProvider} from './contexts/AxiosContext'

const Stack = createStackNavigator()

const App = () => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RELOAD':
          return {
            ...prevState,
            access_token: action.access_token,
            refresh_token: action.refresh_token,
            isLoading: false,
          }
        case 'LOGIN':
          return {
            ...prevState,
            access_token: action.access_token,
            refresh_token: action.refresh_token,
          }
        case 'RESET':
          return {
            ...prevState,
            access_token: '',
          }
      }
    },
    {
      access_token: '',
      refresh_token: '',
      isLoading: true,
    },
  )

  // useEffect(async () => {
  //   await AsyncStorage.removeItem('access_token')
  //   await AsyncStorage.removeItem('refresh_token')
  // }, [])

  useEffect(() => {
    const bootstrapAsync = async () => {
      let access = ''
      let refresh = ''

      try {
        access = await AsyncStorage.getItem('access_token')
        refresh = await AsyncStorage.getItem('refresh_token')
      } catch (err) {
        console.error(err)
      }

      dispatch({type: 'RELOAD', access_token: access, refresh_token: refresh})
    }

    bootstrapAsync()
  }, [])

  useEffect(() => {
    console.log('AAA', state)
  }, [state])

  const authContext = useMemo(() => ({
    login: async data => {
      dispatch({
        type: 'LOGIN',
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      })
    },
    reset: async () => {
      dispatch({
        type: 'RESET',
      })
    },
  }))

  return state.isLoading ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator
        animating={state.isLoading}
        color={colors.primary}
        size="large"
      />
    </View>
  ) : (
    <AppContext.Provider value={{authContext, state}}>
      <AxiosProvider>
        <NavigationContainer>
          {state.access_token ? (
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
          ) : (
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
          )}
        </NavigationContainer>
      </AxiosProvider>
    </AppContext.Provider>
  )
}

export default App
