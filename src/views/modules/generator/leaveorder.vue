<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="info" icon="el-icon-refresh" @click="getDataList()" round>刷新列表</el-button>
        <el-button v-if="isAuth('generator:leaveorder:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        width="150"
        label="申请人">
      </el-table-column>
      <el-table-column
        prop="why"
        header-align="center"
        align="center"
        label="申请原因">
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        width="100"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        width="100"
        label="结束时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="120"
        label="状态">
        <template slot-scope="scope">
					<el-tag v-if="scope.row.status < 2" size="small">待审批</el-tag>
					<el-tag v-else-if="scope.row.status == 2" size="small" type="success">班主任已审批</el-tag>
					<el-tag v-else-if="scope.row.status == 4" size="small" type="success">已通过</el-tag>
					<el-tag v-else-if="scope.row.status == 3 || scope.row.status == 5" size="small" type="danger">已拒绝</el-tag>
					<el-tag v-else-if="scope.row.status == 6" size="small" type="info">已销假</el-tag>
				</template>
      <!-- &&status   0：已创建；1：待审批；2.已审批；3.已拒绝；4：已销假；5：已删除 -->
      <!-- &&status   0：已创建；1：待审批；2.一级已审批；3.已拒绝；4：二级已审批；5：二级已拒绝；6：已销假；7：已删除' -->
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="canipass(scope.row)" @click="pass(scope.row)">通过</el-button>
          <el-button type="text" size="small" v-if="canipass(scope.row)" @click="refuse(scope.row)">拒绝</el-button>
          <el-button type="text" size="small" v-if="isStudent() && (scope.row.status == 2 || scope.row.status == 4)" @click="removeNow(scope.row)">销假</el-button>
          <el-button type="text" size="small" v-if="isStudent() && scope.row.status != 2 && scope.row.status != 4" @click="addOrUpdateHandle(scope.row.orderId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.orderId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './leaveorder-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        duringNum: 0
      }
    },
    components: {
      AddOrUpdate
    },
    computed: {
      roleList: {
        get () { return this.$store.state.user.roleList },
        set (val) { this.$store.commit('user/updateRoleList', val) }
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.getDuringNum()
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/leaveorder/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = [id]
        this.$confirm(`确定删除[id=${id}]的请假单?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/leaveorder/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      pass(item) {
        if (this.isLeader()) {
          let adminunitId = this.$store.state.user.adminunitId
          if (item.unitId == adminunitId) {
            item.status = 4
            this.updateItem(item)
            return
          }
        }
        debugger
        if (this.isHighLvl(item.during)) {
          item.status = 2
          this.updateItem(item)
          return
        }
        item.status = 4
        this.updateItem(item)
      },
      refuse(item) {
        if (this.isLeader()) {
          let adminunitId = this.$store.state.user.adminunitId
          if (item.unitId == adminunitId) {
            item.status = 5
            this.updateItem(item)
            return
          }
        }
        item.status = 3
        this.updateItem(item)
      },
      removeNow(item) {
        item.status = 6
        this.updateItem(item)
      },
      updateItem(item) {
        this.$http({
          url: this.$http.adornUrl(`/generator/leaveorder/update`),
          method: 'post',
          data: this.$http.adornData({
            'orderId': item.orderId,
            'username': item.username,
            'why': item.why,
            'startTime': item.startTime,
            'endTime': item.endTime,
            'status': item.status
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      isStudent() {
        return this.roleList.includes(1)
      },
      isTeacher() {
        return this.roleList.includes(2)
      },
      isLeader() {
        return this.roleList.includes(3)
      },
      isHighLvl(during) {
        return Number(during) > Number(this.duringNum)
      },
      getDuringNum() {
        this.$http({
          url: this.$http.adornUrl('/generator/leaveduring/info/1'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.duringNum = data.leaveDuring.duringValue
          } else {
          }
        })
      },
      canipass(item) {
        if (this.isStudent()) {
          return false
        }
        if (this.isLeader()) {
          let adminunitId = this.$store.state.user.adminunitId
          if (item.unitId == adminunitId && item.status < 4) {
            return true
          }
        }
        if (this.isTeacher()) {
          let classId = this.$store.state.user.classId
          if (item.classId == classId && item.status < 2) {
            return true
          }
        }
        return false
      }
    }
  }
</script>
