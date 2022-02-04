import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/reset.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/fonts/iconfont.css'
import axios from 'axios'
Vue.use(ElementUI)
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
// 除了登录的接口外，其他的每一个接口请求都需要携带token，
axios.interceptors.request.use(function(config){
  if(config.url !== '/login'){
    config.headers.Authorization = window.sessionStorage.getItem('token')
  }
  return config
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
