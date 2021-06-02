import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, {
  createContext,
  useContext,
  useEffect,
  Children,
  cloneElement,
} from 'react'
import {Alert} from 'react-native'
import {decode as atob} from 'base-64'

import {baseUrl} from '../config/baseUrl'
import AppContext from './AppContext'

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
})

const AxiosContext = createContext(null)

const AxiosProvider = props => {
  const {authContext, state} = useContext(AppContext)

  useEffect(() => {
    let accessToken = null

    AsyncStorage.getItem('access_token').then(token => (accessToken = token))

    axiosInstance.defaults.headers.Authorization =
      accessToken && accessToken ? 'Bearer ' + accessToken : null

    axiosInstance.defaults.headers['Content-Type'] = 'application/json'
    axiosInstance.defaults.headers.Accept = 'application/json'

    axiosInstance.interceptors.response.use(
      response => {
        return response
      },
      async error => {
        const originalRequest = error.config

        if (typeof error.response === 'undefined') {
          Alert.alert(
            'A server/network error occured. ' +
              'Looks like CORS might be the problem. ' +
              'Sorry about this - we will get it fixed shortly.',
          )
          return Promise.reject(error)
        }

        if (
          error.response.status === 401 &&
          originalRequest.url === baseUrl + 'token/refresh'
        ) {
          authContext.reset()
          return Promise.reject(error)
        }

        if (
          error.response.data.code === 'token_not_valid' &&
          error.response.status === 401 &&
          error.response.statusText === 'Unauthorized'
        ) {
          const refreshToken = await AsyncStorage.getItem('refresh_token')

          if (refreshToken) {
            const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))

            // exp date in token is expressed in seconds, while now() returns milliseconds:
            const now = Math.ceil(Date.now() / 1000)
            console.log(tokenParts.exp)

            if (tokenParts.exp > now) {
              return axiosInstance
                .post('/token/refresh/', {refresh: refreshToken})
                .then(async response => {
                  await AsyncStorage.setItem(
                    'access_token',
                    response.data.access,
                  )
                  await AsyncStorage.setItem(
                    'refresh_token',
                    response.data.refresh,
                  )

                  axiosInstance.defaults.headers.Authorization =
                    'JWT ' + response.data.access
                  originalRequest.headers.Authorization =
                    'JWT ' + response.data.access

                  return axiosInstance(originalRequest)
                })
                .catch(err => {
                  console.log(err)
                })
            } else {
              console.log('Refresh token is expired', tokenParts.exp, now)
              authContext.reset()
              return Promise.reject(error)
            }
          } else {
            console.log('Refresh token not available.')
            authContext.reset()
            return Promise.reject(error)
          }
        }
        return Promise.reject(error)
      },
    )
  }, [state])

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {console.log('BBBB', axiosInstance)}
      {Children.map(props.children, child => {
        return cloneElement(child, {access: props.access})
      })}
    </AxiosContext.Provider>
  )
}

export {AxiosContext, AxiosProvider}
