import axios from 'axios'
import Qs from 'qs'
import {DEF_BASEURL} from '../js/globalData' 
const DEF_REST_BASEURL = DEF_BASEURL
const DEF_REST_PREFIX = '/api'
const REST_BASEURL = getBaseURL()
const REST_PREFIX = getRestPrefix()
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
function ajaxRest ({url, method, data = {},
  timeout = {server: 5000, client: 5000},
  pathPrefix = REST_PREFIX,
  responseType = 'json'}) {
  let p = new Promise(async (resolve, reject) => {
    let config = {
      url: `${pathPrefix}${url}`,
      baseURL: REST_BASEURL,
      method: method,
      paramsSerializer: function (params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      },
      timeout: timeout.client,
      responseType: responseType
    }
    if (method === 'GET') {
      config.params = data
    } else {
      config.data = data 
    }
    axios.request(config).then(data => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
  return p
}
function getBaseURL () {
  let baseUrl = DEF_REST_BASEURL
  return baseUrl
}
function getRestPrefix () {
  let prefix = DEF_REST_PREFIX
  return prefix
}
export default ajaxRest