import {Base64} from 'js-base64'
export const TOKEN_STG_KEY = 'homeworkToken'
export function rememberToken (token) {
  localStorage.setItem(TOKEN_STG_KEY, token)
}
export function getToken () {
  let token = null
  token = sessionStorage.getItem(TOKEN_STG_KEY)
  if (token == null) {
    token = localStorage.getItem(TOKEN_STG_KEY)
    if (token) {
      sessionStorage.setItem(TOKEN_STG_KEY, token)
    }
  }
  return token
}
export function setToken (token) {
  sessionStorage.setItem(TOKEN_STG_KEY, token)
}
export function checkToken () {
  let p = new Promise((resolve, reject) => {
    authAPI.checkToken(getToken()).then(() => {
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
  return p
}
export function clearToken () {
  localStorage.removeItem(TOKEN_STG_KEY)
  sessionStorage.removeItem(TOKEN_STG_KEY)
}
export function getAuthenFromToken () {
  let tokenStr = getToken()
  return `Bearer ${tokenStr}`
}
export function getExpFromToken () {
  let exp = null
  let tokenStr = getToken()
  if (tokenStr != null) {
    let thokenSubStr = tokenStr.split('.')[1]
    let payloadStr = Base64.decode(thokenSubStr)
    let tokenObj = JSON.parse(payloadStr)
    exp = tokenObj.exp
  }
  return exp
}
export function getUserInfoFromToken () {
  const ADMIN_TYPE = 'admin'
  const USER_TYPE = 'user'
  let user = null
  let token = getToken()
  if (token != null) {
    let payloadBStr = token.split('.')[1]
    if (payloadBStr != null) {
      let payloadStr = Base64.decode(payloadBStr)
      let payload = JSON.parse(payloadStr)
      console.log(payload)
      user = {
        id: payload.id,
        username: payload.username,
        type: payload.role === '1' ? ADMIN_TYPE : USER_TYPE,
        loginTs: payload.loginTs,
        phone: payload.phone,
        email: payload.email
      }
      // alert("user:"+user.phone+user.email)
    }
  }
  return user
}