import async from './fetch'
// const baseUrl = 'http://localhost:8080/api/developer'
const baseUrl = 'https://zbgbth50wc.execute-api.eu-west-2.amazonaws.com/dev/api/developer'

export default {
  getProfile () {
    return async(`${baseUrl}/profile`)
  },
  putProfile (params) {
    return async(`${baseUrl}/profile`, params, 'put')
  },
  applyProject (projectid) {
    return async(`${baseUrl}/project/apply/${projectid}`)
  },
  getProjectJoinedList (pageNum = 1, pageSize = 10) {
    return async(`${baseUrl}/project/joined/${pageNum}/${pageSize}`)
  },
  getProject (projectid) {
    return async(`${baseUrl}/project/${projectid}`)
  }
}
