import ajaxRest from './ajaxBase'
const USER_CONTROLLER_PREFIX = 'user'
const USER_DEV_CONTROLLER_PREFIX = 'userDevice'
const RESTFUL_API_VER = 'v1.0'
function getUserInfo () {
  let p = new Promise((resolve, reject) => {
    let params = {
      url: `/${RESTFUL_API_VER}/${USER_CONTROLLER_PREFIX}/info`,
      method: 'GET',
      timeout: {client: 5000}
    }
    ajaxRest(params).then(data => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
  return p
}
function getUserInfoByName (username) {
  let p = new Promise((resolve, reject) => {
    let params = {
      url: `/${RESTFUL_API_VER}/${USER_CONTROLLER_PREFIX}/userInfo`,
      method: 'GET',
      data: {
        username: username
      },
      timeout: {client: 5000}
    }
    ajaxRest(params).then(data => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
  return p
}
function createUser (filterParams) {
  let p = new Promise((resolve, reject) => {
    let params = {
      url: `/${RESTFUL_API_VER}/${USER_CONTROLLER_PREFIX}/info`,
      method: 'POST',
      data: {
        ...filterParams
      },
      timeout: {client: 5000}
    }
    ajaxRest(params).then(data => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
  return p
}
function updateUser (userInfo) {
  let p = new Promise((resolve, reject) => {
    let params = {
      url: `/${RESTFUL_API_VER}/${USER_CONTROLLER_PREFIX}/info`,
      method: 'PUT',
      data: {
        ...userInfo
      },
      timeout: {client: 5000}
    }
    ajaxRest(params).then(data => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
  return p
}
function delUser (id) {
  let p = new Promise((resolve, reject) => {
    let params = {
      url: `/${RESTFUL_API_VER}/${USER_CONTROLLER_PREFIX}/info`,
      method: 'DELETE',
      data: {
        ...id
      },
      timeout: {client: 5000}
    }
    ajaxRest(params).then(data => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
  return p
}
function shareDevForUser (devId) {
  let p = new Promise((resolve, reject) => {
    let params = {
      url: `/${RESTFUL_API_VER}/${USER_DEV_CONTROLLER_PREFIX}/info`,
      method: 'POST',
      data: [
        ...devId
      ],
      timeout: {client: 5000}
    }
    ajaxRest(params).then(data => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
  return p
}
export default {getUserInfo, getUserInfoByName, createUser, updateUser, delUser, shareDevForUser}