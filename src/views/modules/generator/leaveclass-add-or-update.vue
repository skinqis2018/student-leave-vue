<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="班级名" prop="className">
      <el-input v-model="dataForm.className" placeholder="班级名"></el-input>
    </el-form-item>
    <el-form-item label="院系" prop="className">
      <el-select v-model="dataForm.unitId" placeholder="请选择" @change="changeHandle">
        <el-option
          v-for="item in options"
          :key="item.unitId"
          :label="item.unitName"
          :value="item.unitId">
        </el-option>
      </el-select>
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
          classId: 0,
          className: '',
          unitId: '',
          unitName: ''
        },
        dataRule: {
          className: [
            { required: true, message: '班级名不能为空', trigger: 'blur' }
          ]
        },
        options: []
      }
    },
    created() {
      this.$http({
        url: this.$http.adornUrl(`/generator/leaveunit/list`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.options = data.page.list
        }
      })
    },
    methods: {
      init (id) {
        this.dataForm.classId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.classId) {
            this.$http({
              url: this.$http.adornUrl(`/generator/leaveclass/info/${this.dataForm.classId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.className = data.leaveClass.className
                this.dataForm.unitId = data.leaveClass.unitId
                this.dataForm.unitName = data.leaveClass.unitName
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/leaveclass/${!this.dataForm.classId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'classId': this.dataForm.classId || undefined,
                'className': this.dataForm.className,
                'unitId': this.dataForm.unitId,
                'unitName': this.dataForm.unitName,
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
      changeHandle(v) {
        this.dataForm.unitName = this.options.find(i => i.unitId === v).unitName
      }
    }
  }
</script>
