export default {
    namespace: 'three',
    namespaced: true,
    state: {
        piecewiseFun: null,
        lookupTable: null,
        threeInfo: {
            actor: null,
            renderer: null,
            renderWindow: null,
            piecewiseFun: null,
            lookupTable: null,
            mapper: null,
            widgetManager: null,
            range: null,
            volumes: null,
            genericRenderWindow: null,
        },
    },
    mutations: {
        set3DInfo(state, p) {
            state.threeInfo = p
        },
        setPiecewiseFun(state, p) {
            state.piecewiseFun = p
        },
        setLookupTable(state, l) {
            state.lookupTable = l
        },
    },
}
