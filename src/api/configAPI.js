import ajaxRest from './ajaxBase'
const USER_CONTROLLER_PREFIX = 'user'
const RESTFUL_API_VER = 'v1.0'

function mofifyPwd (deviceInfo) {
    let p = new Promise((resolve, reject) => {
      let params = {
        url: `/${RESTFUL_API_VER}/${USER_CONTROLLER_PREFIX}/info`,
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
export default {mofifyPwd}