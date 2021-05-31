import axios from 'axios'
import {baseUrl} from './baseUrl'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Alert} from 'react-native'
import {decode as atob} from 'base-64'

let accessToken = null

AsyncStorage.getItem('access_token').then(token => {
  if (token) {
    accessToken = token
  }
})

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    Authorization: accessToken ? 'Bearer ' + accessToken : null,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// axiosInstance.interceptors.response.use(
//   response => {
//     return response
//   },
//   async function (error) {
//     const originalRequest = error.config

//     if (typeof error.response === 'undefined') {
//       Alert.alert(
//         'A server/network error occurred. ' +
//           'Looks like CORS might be the problem. ' +
//           'Sorry about this - we will get it fixed shortly.',
//       )
//       return Promise.reject(error)
//     }

//     if (
//       error.response.status === 401 &&
//       originalRequest.url === baseUrl + 'token/refresh/'
//     ) {
//       return Promise.reject(error)
//     }

//     if (
//       error.response.data.code === 'token_not_valid' &&
//       error.response.status === 401 &&
//       error.response.statusText === 'Unauthorized'
//     ) {
//       const refreshToken = await AsyncStorage.getItem('refresh_token')

//       if (refreshToken) {
//         const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))

//         // exp date in token is expressed in seconds, while now() returns milliseconds:
//         const now = Math.ceil(Date.now() / 1000)
//         console.log(tokenParts.exp)

//         if (tokenParts.exp > now) {
//           return axiosInstance
//             .post('/token/refresh/', {refresh: refreshToken})
//             .then(response => {
//               localStorage.setItem('access_token', response.data.access)
//               localStorage.setItem('refresh_token', response.data.refresh)

//               axiosInstance.defaults.headers.Authorization =
//                 'JWT ' + response.data.access
//               originalRequest.headers.Authorization =
//                 'JWT ' + response.data.access

//               return axiosInstance(originalRequest)
//             })
//             .catch(err => {
//               console.log(err)
//             })
//         } else {
//           console.log('Refresh token is expired', tokenParts.exp, now)
//           window.location.href = '/login/'
//         }
//       } else {
//         console.log('Refresh token not available.')
//         window.location.href = '/login/'
//       }
//     }

//     // specific error handling done elsewhere
//     return Promise.reject(error)
//   },
// )

export default axiosInstance
