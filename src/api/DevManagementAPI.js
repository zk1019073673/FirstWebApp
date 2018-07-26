import ajaxRest from './ajaxBase'
const DEV_CONTROLLER_PREFIX = 'device'
const USER_DEV_CONTROLLER_PREFIX = 'userDevice'
const RESTFUL_API_VER = 'v1.0'
function getDevInfos () {
  let p = new Promise((resolve, reject) => {
    let params = {
      url: `/${RESTFUL_API_VER}/${DEV_CONTROLLER_PREFIX}/info`,
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
function getDevInfosByUserId (userId) {
    let p = new Promise((resolve, reject) => {
      let params = {
        url: `/${RESTFUL_API_VER}/${USER_DEV_CONTROLLER_PREFIX}/ids`,
        method: 'GET',
        data: {
            userId: userId
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
function delUserDevByDeviceId (filterParams) {
  let p = new Promise((resolve, reject) => {
    let params = {
      url: `/${RESTFUL_API_VER}/${USER_DEV_CONTROLLER_PREFIX}/device`,
      method: 'DELETE',
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
function getDevInfoByName (deviceName) {
    let p = new Promise((resolve, reject) => {
      let params = {
        url: `/${RESTFUL_API_VER}/${DEV_CONTROLLER_PREFIX}/deviceInfo`,
        method: 'GET',
        data: {
            deviceName: deviceName
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
function createDev (filterParams) {
    let p = new Promise((resolve, reject) => {
      let params = {
        url: `/${RESTFUL_API_VER}/${DEV_CONTROLLER_PREFIX}/info`,
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
function updateDev (deviceInfo) {
    let p = new Promise((resolve, reject) => {
      let params = {
        url: `/${RESTFUL_API_VER}/${DEV_CONTROLLER_PREFIX}/info`,
        method: 'PUT',
        data: {
          ...deviceInfo
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
function delDev (id) {
    let p = new Promise((resolve, reject) => {
      let params = {
        url: `/${RESTFUL_API_VER}/${DEV_CONTROLLER_PREFIX}/info`,
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
export default {getDevInfos, getDevInfosByUserId, delUserDevByDeviceId, getDevInfoByName, createDev, updateDev, delDev}