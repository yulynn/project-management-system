import async from './fetch'
// const baseUrl = 'http://localhost:8080/api/project'
const baseUrl = 'https://zbgbth50wc.execute-api.eu-west-2.amazonaws.com/dev/api/project'

export default {
  // {
  //     "realname": "project two",
  //     "state": "begin",
  //     "intro": "this is project two"
  // }
  createProject (params) {
    return async(`${baseUrl}`, params, 'post')
  },
  deleteProject (projectid) {
    return async(`${baseUrl}/${projectid}`, {}, 'delete')
  },
  getAllProject (pageNum = 1, pageSize = 10) {
    return async(`${baseUrl}/all/${pageNum}/${pageSize}`)
  },
  getProjectList (pageNum = 1, pageSize = 10) {
    return async(`${baseUrl}/list/${pageNum}/${pageSize}`)
  },
  getProjectProfile (projectid) {
    return async(`${baseUrl}/profile/${projectid}`)
  },
  // {
  //   "realname": "project one",
  //   "applies": [],
  //   "manager": "TdBpHydyeMEWnfeQa2Kmm6xK5Zb4FK4J",
  //   "developers": [
  //       "xxSiejk6kwx4CKnhyxnWRcMEhXxe3RHm"
  //   ],
  //   "intro": "this is project one",
  //   "id": "EprPHDCehhTpXJmp2ez3eR73QXkxtdjR",
  //   "state": "processing"
  // }
  updateProjectProfile (params) {
    return async(`${baseUrl}/profile`, params, 'put')
  },
  updateProjectState (projectid, state) {
    return async(`${baseUrl}/state/${projectid}/${state}`, {}, 'put')
  },
  distributeProjectToDeveloper (projectid, userid) {
    return async(`${baseUrl}/distribute/${projectid}/${userid}`)
  },
  deleteDeveloperFromProject (projectid, userid) {
    return async(`${baseUrl}/distribute/${projectid}/${userid}`, {}, 'delete')
  },
  applyProject (projectid) {
    return async(`${baseUrl}/apply/${projectid}`)
  },
  getProjectsJoined (pageNum = 1, pageSize = 10) {
    return async(`${baseUrl}/developer/joined/${pageNum}/${pageSize}`)
  }
}
