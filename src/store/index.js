import Vue from 'vue'
import Vuex from 'vuex'

import three from './three'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        distance: false,
    },
    mutations: {
        setDrawRuler(state, isDraw) {
            state.distance = isDraw
        },
    },
    actions: {},
    modules: {
        three,
    },
})
