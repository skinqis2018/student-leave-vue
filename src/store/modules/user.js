export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    roleId: 0
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateRoleId (state, id) {
      state.roleId = id
    }
  }
}
