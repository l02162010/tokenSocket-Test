import store from '@/store'
import {ApiInstance , config} from './api'
import router from '../router'

const REFRESH_TOKEN_URL = config.baseURL + '/auth/rest/token/refresh'

let api_store = store.state.api

let interceptors = function(){

  // request 攔截 
  ApiInstance.interceptors.request.use(
    req => {
      if (store.state.api.token.accessToken && store.state.api.isLogin) {
        req.headers.Authorization = `Bearer ${store.state.api.token.accessToken}`
      }
      return req
    },
    err => {
      return Promise.reject(err)
    },
  )
  
  // response 攔截 
  ApiInstance.interceptors.response.use(
    response => {
        if(response.config.url == REFRESH_TOKEN_URL){
          store.commit('updateToken', response.data);
        }
      return response
    },
    (error) => {
      if(error.response){
        if (error.response.status == 401 && error.response.data.message == 'Token expired') {
          //error message 是token過期, 有refreshToken, 已登入, 沒有refresh過
          if(api_store.token.refreshToken && api_store.isLogin && !api_store.isRefresh){
            let data = {
              refreshToken : api_store.token.refreshToken
            }
            store.dispatch('refreshToken', data)
          }else{
            goHome()
          }
        }else{
          goHome()
        }
      }
      // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
      return Promise.reject(error.response)
    }
  )
}

let goHome = ()=> {
  localStorage.clear();
  router.currentRoute.path !== '/' &&
  router.replace({
    path: '/'
  })
}
  

export default interceptors
