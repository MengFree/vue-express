import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    userId: false,
}

const mutations = {
    LOGIN(state, userId) {
        state.userId = userId
    },
}
const actions = {
    login({ commit }) {
        commit('LOGIN')
    }
}
const getters = {
    userId: state => {
        return state.userId;
    }
}
export default new Vuex.Store({
    state,
    actions,
    mutations
})