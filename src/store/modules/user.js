export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    roleList: [],
    unitId: 0,
    unitName: '',
    collegeId: 0,
    collegeName: '',
    classId: 0,
    className: '',
    adminunitId: 0,
    adminunitName: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateRoleList (state, list) {
      state.roleList = list
    },
    updateUnitId (state, id) {
      state.unitId = id
    },
    updateUnitName (state, name) {
      state.unitName = name
    },
    updateClassId (state, id) {
      state.classId = id
    },
    updateClassName (state, name) {
      state.className = name
    },
    updateCollegeId (state, id) {
      state.collegeId = id
    },
    updateCollegeName (state, name) {
      state.collegeName = name
    },
    updateAdminunitId (state, id) {
      state.adminunitId = id
    },
    updateAdminunitName (state, name) {
      state.adminunitName = name
    }
  }
}
