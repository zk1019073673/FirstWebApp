import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
import './assets/icon/iconfont.css'
// import vuex from 'vuex'
import store from './store'

Vue.use(ElementUI)
Vue.use(VueRouter)
// Vue.use(vuex)

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

new Vue({
  el:'#app',
  router,
  store,
  render: h => h(App),
  // created() {
  //   if(localStorage.getItem("isLogin") === null){
  //     localStorage.setItem("isLogin","")
  //   }
  //   this.$store.state.isLogin = localStorage.getItem("isLogin")
  // }
})

