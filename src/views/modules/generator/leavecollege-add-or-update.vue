<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="所属学院">
        <el-select v-model="dataForm.unitId" placeholder="请选择" @change="unitChange">
          <el-option
            v-for="item in options"
            :key="item.unitId"
            :label="item.unitName"
            :value="item.unitId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业名" prop="collegeName">
        <el-input v-model="dataForm.collegeName" placeholder="专业名"></el-input>
      </el-form-item>
    
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          collegeId: 0,
          collegeName: '',
          unitId: '',
          unitName: ''
        },
        dataRule: {
          collegeName: [
            { required: true, message: '专业名不能为空', trigger: 'blur' }
          ],
          unitId: [
            { required: true, message: '学院ID不能为空', trigger: 'blur' }
          ],
          unitName: [
            { required: true, message: '学院名不能为空', trigger: 'blur' }
          ]
        },
        options: []
      }
    },
    methods: {
      init (id) {
        this.dataForm.collegeId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.collegeId) {
            this.$http({
              url: this.$http.adornUrl(`/generator/leavecollege/info/${this.dataForm.collegeId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.collegeName = data.leaveCollege.collegeName
                this.dataForm.unitId = data.leaveCollege.unitId
                this.dataForm.unitName = data.leaveCollege.unitName
                this.dataForm.createUserId = data.leaveCollege.createUserId
                this.dataForm.createTime = data.leaveCollege.createTime
              }
            })
          }
          this.getUnit()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/leavecollege/${!this.dataForm.collegeId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'collegeId': this.dataForm.collegeId || undefined,
                'collegeName': this.dataForm.collegeName,
                'unitId': this.dataForm.unitId,
                'unitName': this.dataForm.unitName
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
          }
        })
      },
      getUnit() {
        this.$http({
          url: this.$http.adornUrl(`/generator/leaveunit/list`),
          method: 'get',
          params: this.$http.adornParams({
            page: 1,
            limit: 100
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.options = data.page.list
          }
        })
      },
      unitChange(v) {
        this.dataForm.unitName = this.options.find(i => i.unitId === v).unitName
      }
    }
  }
</script>
