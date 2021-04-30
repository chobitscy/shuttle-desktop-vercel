const state = () => ({
    collapse: true
});

const getters = {
    getCollapse: (state) => {
        return state.collapse;
    }
};

const mutations = {
    setCollapse(state) {
        state.collapse = !state.collapse;
    },
};

export default {
    state,
    getters,
    mutations
}