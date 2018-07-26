import ajaxRest from './ajaxBase'
const CONTROLLER_PREFIX = 'login'
const RESTFUL_API_VER = 'v1.0'

// function login (user, pwd, tokenTs) {
//   let p = new Promise((resolve, reject) => {
//     let params = {
//       url: `/${RESTFUL_API_VER}/${CONTROLLER_PREFIX}/login`,
//       method: 'POST',
//       data: {
//         userName: user,
//         password: pwd,
//         tokenTs: tokenTs
//       },
//       timeout: {client: 5000}
//     }

//     ajaxRest(params).then(data => {
//       resolve(data)
//     }).catch(error => {
//       reject(error)
//     })
//   })
//   return p
// }

function refreshToken () {
  let p = new Promise((resolve, reject) => {
    let params = {
      url: `/${RESTFUL_API_VER}/${CONTROLLER_PREFIX}/refresh/token`,
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

function checkToken (token) {
  let p = new Promise((resolve, reject) => {
    let params = {
      url: `/${RESTFUL_API_VER}/${CONTROLLER_PREFIX}/check/token`,
      method: 'POST',
      data: {
        token: token
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

// function getVerCode (param) {
//   let p = new Promise((resolve, reject) => {
//     let params = {
//       url: `/${RESTFUL_API_VER}/${CONTROLLER_PREFIX}/code/sms`,
//       method: 'POST',
//       data: {
//         phone: param
//       },
//       timeout: {client: 5000}
//     }

//     ajaxRest(params).then(data => {
//       resolve(data)
//     }).catch(error => {
//       reject(error)
//     })
//   })
//   return p
// }

// function loginWithCode (phone, verCode, tokenTs) {
//   let p = new Promise((resolve, reject) => {
//     let params = {
//       url: `/${RESTFUL_API_VER}/${CONTROLLER_PREFIX}/login/sms`,
//       method: 'POST',
//       data: {
//         phone: phone,
//         code: verCode,
//         tokenTs: tokenTs
//       },
//       timeout: {client: 5000}
//     }

//     ajaxRest(params).then(data => {
//       resolve(data)
//     }).catch(error => {
//       reject(error)
//     })
//   })
//   return p
// }

function loginWithPwd (phone, pwd, tokenTs) {
  let p = new Promise((resolve, reject) => {
    let params = {
      url: `/${RESTFUL_API_VER}/${CONTROLLER_PREFIX}/login/phone`,
      method: 'POST',
      data: {
        phone: phone,
        password: pwd,
        tokenTs: tokenTs
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

export default {loginWithCode, loginWithPwd, refreshToken, checkToken, getVerCode}
