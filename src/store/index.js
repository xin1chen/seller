import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        seller: null
    },
    getters: {
        seller: state => {
            return state.seller;
        }
    },
    mutations: {
        storeseller(state, payload) {
            state.seller = payload.seller;
        }
    },
    actions: {},
    modules: {}
})