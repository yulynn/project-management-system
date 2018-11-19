import async from './fetch'
import apiDeveloper from './api-developer'
import apiManager from './api-manager'
import apiAdmin from './api-admin'
import apiProject from './api-project'

// const baseUrl = 'http://localhost:8080'
const baseUrl = 'https://zbgbth50wc.execute-api.eu-west-2.amazonaws.com/dev'

export default {
  signin (email, password, role) {
    return async(
      `${baseUrl}/login/` + role, {
        email: email,
        password: password
      },
      'post'
    )
  },
  // {
  //   "realname": "zengwei",
  //   "email": "zengwei@qq.com",
  //   "password": "123456"
  // }
  signup (params, role) {
    return async(`${baseUrl}/registe/` + role, params, 'post')
  },
  updatePwd (password, user, role) {
    user.password = password
    return async(
      `${baseUrl}/api/` + role + `/profile`, user,
      'put'
    )
  },
  // {
  //   "from": "441535867@qq.com",
  //   "to": "441535867@qq.com",
  //   "subject": "testtest",
  //   "text": "testtest"
  // }
  sendmail (params) {
    params.from = '441535867@qq.com'
    console.log(params)
    return async(
      `${baseUrl}/api/project/sendmail`, params, 'post')
  },
  developer: {
    ...apiDeveloper
  },
  manager: {
    ...apiManager
  },
  admin: {
    ...apiAdmin
  },
  project: {
    ...apiProject
  }
}
