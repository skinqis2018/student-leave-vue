<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
        <main-content v-if="!$store.state.common.contentIsNeedRefresh" />
      </div>
    </template>
  </div>
</template>

<script>
  import MainNavbar from './main-navbar'
  import MainSidebar from './main-sidebar'
  import MainContent from './main-content'
  export default {
    provide () {
      return {
        // 刷新
        refresh () {
          this.$store.commit('common/updateContentIsNeedRefresh', true)
          this.$nextTick(() => {
            this.$store.commit('common/updateContentIsNeedRefresh', false)
          })
        }
      }
    },
    data () {
      return {
        loading: true
      }
    },
    components: {
      MainNavbar,
      MainSidebar,
      MainContent
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight },
        set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userName: {
        get () { return this.$store.state.user.name },
        set (val) { this.$store.commit('user/updateName', val) }
      },
      roleList: {
        get () { return this.$store.state.user.roleList },
        set (val) { this.$store.commit('user/updateRoleList', val) }
      },
      unitId: {
        get () { return this.$store.state.user.unitId },
        set (val) { this.$store.commit('user/updateUnitId', val) }
      },
      unitName: {
        get () { return this.$store.state.user.unitName },
        set (val) { this.$store.commit('user/updateUnitName', val) }
      },
      collegeId: {
        get () { return this.$store.state.user.collegeId },
        set (val) { this.$store.commit('user/updateCollegeId', val) }
      },
      collegeName: {
        get () { return this.$store.state.user.collegeName },
        set (val) { this.$store.commit('user/updateCollegeName', val) }
      },
      classId: {
        get () { return this.$store.state.user.classId },
        set (val) { this.$store.commit('user/updateClassId', val) }
      },
      className: {
        get () { return this.$store.state.user.className },
        set (val) { this.$store.commit('user/updateClassName', val) }
      },
      adminunitId: {
        get () { return this.$store.state.user.adminunitId },
        set (val) { this.$store.commit('user/updateAdminunitId', val) }
      },
      adminunitName: {
        get () { return this.$store.state.user.adminunitName },
        set (val) { this.$store.commit('user/updateAdminunitName', val) }
      }
    },
    created () {
      this.getUserInfo()
    },
    mounted () {
      this.resetDocumentClientHeight()
    },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
        }
      },
      // 获取当前管理员信息
      getUserInfo () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/info'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.loading = false
            this.userId = data.user.userId
            this.userName = data.user.username
            this.unitId = data.user.unitId || 0
            this.unitName = data.user.unitName || ''
            this.collegeId = data.user.collegeId || 0
            this.collegeName = data.user.collegeName || ''
            this.classId = data.user.classId || 0
            this.className = data.user.className || ''
            this.adminunitId = data.user.adminunitId || 0
            this.adminunitName = data.user.adminunitName || ''
          }
        })
        this.$http({
          url: this.$http.adornUrl('/generator/leaveorder/selector'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.roleList = data.roleList
        })
      }
    }
  }
</script>
