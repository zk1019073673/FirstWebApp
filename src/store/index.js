import Vuex from 'vuex'
import Vue from 'vue'
import global_store from './globalStore'
import user from './userInfo'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        global: global_store,
        user: user
    }
})