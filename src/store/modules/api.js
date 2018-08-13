import qs from 'query-string'
import {ApiInstance} from '../../cfg/api'

export default {
  state: {
    isRefresh: false,
    isLogin: false,
    token : {
      accessToken:"",
      refreshToken:""
    }
  },
  getters: {
    token: (state) => state.token
  },
  mutations: {
    updateToken(state, token){
      if(token.accessToken){
        localStorage.setItem('accessToken', token.accessToken);
        state.token.accessToken = token.accessToken
      }
      if(token.refreshToken){
        localStorage.setItem('refreshToken', token.refreshToken);
        state.token.refreshToken = token.refreshToken
      }
      state.isRefresh = false
      state.isLogin = true
      localStorage.setItem('isLogin', true);
      localStorage.setItem('isRefresh', false);
    },
    initialiseStore(state) {
			if(localStorage.getItem('accessToken')) {
        state.token.accessToken = localStorage.getItem('accessToken')
      }
      if(localStorage.getItem('refreshToken')) {
        state.token.refreshToken = localStorage.getItem('refreshToken')
      }
      if(typeof localStorage.getItem('isLogin') == 'string'){
        state.isLogin = !!localStorage.getItem('isLogin')
      }
      if(typeof localStorage.getItem('isRefresh') == 'string'){
        state.isLogin = !!localStorage.getItem('isRefresh')
      }
    },
    doRefresh(state) {
      localStorage.setItem('isRefresh', true);
      state.isRefresh = true
    },
    logout(state) {
      localStorage.setItem('isLogin', false);
      state.isLogin = false
    }
  },
  actions: {
    doLogin: async (store, data) => await apiInit(store, "post", "auth/rest/token", data),
    refreshToken: async (store, data) => {
      store.commit('doRefresh')
      await apiInit(store, "post", "auth/rest/token/refresh", data)
    },
    getDeviceId: async (store) => await apiInit(store, "get", "api/rest/device/e50d6085-2aba-48e9-b1c3-73c673e414be"),
  }
}

async function apiInit({state, commit}, method, url, data) {  
  try{
    switch(method) {
      case 'get':
        var res = await ApiInstance[method](`${url}${data ? '?' : ''}${qs.stringify(data)}`)
        break;
      case 'post':
        var res = await ApiInstance[method](url, data);
        break;
    }
  } catch(e){
    handleError(e ,state)
  }
  return res
}

function handleError (err,state) {
  if(err){
    switch(err.status){
      case 400 :
        alert('請輸入帳號密碼');
        break;
      case 401 :
        alert('帳號不存在或密碼錯誤');
        break;
      case 500:
        alert('伺服器錯誤');
        break;
    }
  }
}