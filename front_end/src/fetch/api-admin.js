import async from './fetch'
// const baseUrl = 'http://localhost:8080/api/admin'
const baseUrl = 'https://zbgbth50wc.execute-api.eu-west-2.amazonaws.com/dev/api/admin'

export default {
  getProfile () {
    return async(`${baseUrl}/profile`)
  },
  putProfile (params) {
    return async(`${baseUrl}/profile`, params, 'put')
  },
  // {
  //   "realname": "testdeveloper",
  //   "password": "123456",
  //   "email": "zeng@qq.com",
  //   "userType": "developer"
  // }
  newUser (params) {
    return async(`${baseUrl}/user`, params, 'post')
  },
  // {
  //   "id": "XjMR4XQ7aZCe7iBSpbEBmRZXzeX7w4yK",
  //   "userType": "developer"
  // }
  deleteUser (userType, userId) {
    return async(`${baseUrl}/user/${userType}/${userId}`, {}, 'delete')
  },
  // {
  //   "id": "cWwJpnf2k5FeF3wptP87sQ7aaGFs3ShP",
  //   "role": "developer",
  //   "newRole": "manager"
  // }
  putUser (params) {
    return async(`${baseUrl}/user`, params, 'put')
  },
  generateCode (userType = 'developer') {
    return async(`${baseUrl}/code/${userType}`)
  },
  getProjectList (pageNum = 1, pageSize = 10) {
    return async(`${baseUrl}/projects/${pageNum}/${pageSize}`)
  },
  getUserList (pageNum = 1, pageSize = 10) {
    return async(`${baseUrl}/manager/${pageNum}/${pageSize}`)
  },
  getManager (managerid) {
    return async(`${baseUrl}/manager/${managerid}`)
  },
  // {
  //   "realname": "测试用户",
  //   "password": "14e1b600b1fd579f47433b88e8d85291",
  //   "id": "6di2a8kzRGKbFR7JkjSJDkz8akWbHtAB",
  //   "email": "zeng@qq.com",
  //   "projects": []
  // }
  updateManagerProfile (params, managerid) {
    return async(`${baseUrl}/manager/${managerid}`, params, 'put')
  }
}
