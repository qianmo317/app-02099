import axios from 'axios'
import logger from './logger'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    logger.error('Request error:', error)
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    logger.error('Response error:', error?.response?.status, error?.message)
    return Promise.reject(error)
  }
)

export default request
