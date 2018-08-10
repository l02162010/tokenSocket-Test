import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ApiInstance from './cfg/api'

Vue.config.productionTip = false
Vue.use(ElementUI);

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
    return response
  },
  error => {
    if (error.response) {
    
      switch (error.response.status) {
        case 401:
          if(store.state.api.isLogin){
            if(!store.state.api.isRefresh){
              let data = {
                refreshToken : store.state.api.token.refreshToken
              }
              store.dispatch('refreshToken', data)
            }else{
              store.commit('logout')
              goHome()
            }
          }else{
            goHome()
          }
          break;
        case 500:
          goHome()
          break;
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response)
  }
)
let goHome = ()=> {
  localStorage.clear();
  router.currentRoute.path !== '/' &&
  router.replace({
    path: '/'
  })
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
