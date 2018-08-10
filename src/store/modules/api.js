import qs from 'query-string'
import ApiInstance from '../../cfg/api'

export default {
  state: {
    token: {
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
        ApiInstance.defaults.headers.common['Authorization'] = "Bearer " + token.accessToken;
      }
      if(token.refreshToken){
        localStorage.setItem('refreshToken', token.refreshToken);
        state.token.refreshToken = token.refreshToken
      }      
    },
    initialiseStore(state) {
			if(localStorage.getItem('accessToken')) {
        state.token.accessToken = localStorage.getItem('accessToken')
      }
      if(localStorage.getItem('refreshToken')) {
        state.token.refreshToken = localStorage.getItem('refreshToken')
      }
		}
  },
  actions: {
    doLogin: async (store, data) => await apiInit(store, "post", "auth/rest/token", data),
    refreshToken: async (store, data) => await apiInit(store, "post", "auth/rest/token/refresh", data),
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