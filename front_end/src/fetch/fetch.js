import axios from 'axios'

// cors
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.timeout = 20000

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('x-access-token')
    if (token) {
      // jwt token
      config.headers.common['x-access-token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default async (url = '', params = {}, method = 'get', isUpload = false) => {
  method = method.toLowerCase()
  if (method === 'get') {
    let paramArr = []
    for (let [key, value] of Object.entries(params)) {
      paramArr.push(key + '=' + value)
    }
    if (paramArr.length > 0) {
      url += '?' + paramArr.join('&').replace(/#/g, '%23')
    }
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(
          response => {
            resolve(response.data)
          },
          err => {
            reject(err)
          }
        )
        .catch(error => {
          reject(error)
        })
    })
  } else if (method === 'post') {
    let config = {}
    if (isUpload) {
      config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    }
    return new Promise((resolve, reject) => {
      axios
        .post(url, params, config)
        .then(
          response => {
            resolve(response.data)
          },
          err => {
            reject(err)
          }
        )
        .catch(error => {
          reject(error)
        })
    })
  } else if (method === 'put') {
    return new Promise((resolve, reject) => {
      axios
        .put(url, params)
        .then(
          response => {
            resolve(response.data)
          },
          err => {
            reject(err)
          }
        )
        .catch(error => {
          reject(error)
        })
    })
  } else if (method === 'delete') {
    return new Promise((resolve, reject) => {
      axios
        .delete(url)
        .then(
          response => {
            resolve(response.data)
          },
          err => {
            reject(err)
          }
        )
        .catch(error => {
          reject(error)
        })
    })
  } else {
    let error = 'parameter error'
    return Promise.reject(error)
  }
}
