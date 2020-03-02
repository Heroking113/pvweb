import axios from 'axios'

let _axios = axios.create({
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json',
  baseURL: '/'
})

_axios.interceptors.response.use(
  response => {
    return response.data
  }
)

export default _axios