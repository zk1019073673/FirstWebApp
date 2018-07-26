import ajaxRest from './ajaxBase'
const LOGIN_CONTROLLER_PREFIX = 'login'
const RESTFUL_API_VER = 'v1.0'

function login (filterParams) {
    let p = new Promise((resolve, reject) => {
      let params = {
        url: `/${RESTFUL_API_VER}/${LOGIN_CONTROLLER_PREFIX}/info`,
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

export default {login}