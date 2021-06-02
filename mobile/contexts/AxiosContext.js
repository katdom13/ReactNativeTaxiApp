import axios from 'axios'
import React, {
  createContext,
  useContext,
  useEffect,
  Children,
  cloneElement,
} from 'react'
import {baseUrl} from '../config/baseUrl'

import {AppContext} from './AppContext'

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
})

const AxiosContext = createContext(null)

const AxiosProvider = props => {
  const {contextData} = useContext(AppContext)

  useEffect(() => {
    axiosInstance.defaults.headers.Authorization =
      contextData && contextData.access_token
        ? 'Bearer ' + contextData.access_token
        : null
    axiosInstance.defaults.headers['Content-Type'] = 'application/json'
    axiosInstance.defaults.headers.Accept = 'application/json'
    axiosInstance.interceptors.response.use(
      response => {
        return response
      },
      error => {
        return Promise.reject(error)
      },
    )
  }, [contextData])

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {Children.map(props.children, child => {
        return cloneElement(child, {access: props.access})
      })}
    </AxiosContext.Provider>
  )
}

export {AxiosContext, AxiosProvider}
