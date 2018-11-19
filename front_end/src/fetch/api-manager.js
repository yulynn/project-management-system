import async from './fetch'
// const baseUrl = 'http://localhost:8080/api/manager'
const baseUrl = 'https://zbgbth50wc.execute-api.eu-west-2.amazonaws.com/dev/api/manager'

export default {
  getProfile () {
    return async(`${baseUrl}/profile`)
  },
  putProfile (params) {
    return async(`${baseUrl}/profile`, params, 'put')
  },
  getUserList (pageNum = 1, pageSize = 10) {
    return async(`${baseUrl}/developer/${pageNum}/${pageSize}`)
  },
  // get user list by ids
  // {
  //   "ids": []
  // }
  getDeveloperByIds (params) {
    return async(`${baseUrl}/developer`, params, 'post')
  },
  getDeveloperByName (name) {
    return async(`${baseUrl}/developer/name/${name}`)
  },
  getDeveloperById (developerid) {
    return async(`${baseUrl}/developer/profile/${developerid}`)
  },
  // {
  //   "projects_joined": [],
  //   "realname": "zengwei",
  //   "password": "e10adc3949ba59abbe56e057f20f883e",
  //   "skills": [
  //       "html",
  //       "css"
  //   ],
  //   "id": "xxSiejk6kwx4CKnhyxnWRcMEhXxe3RHm",
  //   "email": "zengwei@qq.com"
  // }
  updateDeveloperProfile (params) {
    return async(`${baseUrl}/developer/profile`, params, 'put')
  },
  getDeveloperApplies (projectid, pageNum, pageSize) {
    return async(`${baseUrl}/project/resume/${projectid}/${pageNum}/${pageSize}`)
  },
  // {
  //   "projectid": "EprPHDCehhTpXJmp2ez3eR73QXkxtdjR",
  //   "developerid": "xxSiejk6kwx4CKnhyxnWRcMEhXxe3RHm",
  //   "state": "pass"
  // }
  examineDeveloperApplies (params) {
    return async(`${baseUrl}/project/resume`, params, 'post')
  }
}
