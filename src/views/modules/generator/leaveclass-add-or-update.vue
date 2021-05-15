<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="所属学院" prop="unitId">
        <el-select v-model="dataForm.unitId" placeholder="请选择" @change="unitChange">
          <el-option
            v-for="item in unitOptions"
            :key="item.unitId"
            :label="item.unitName"
            :value="item.unitId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属专业" prop="collegeId">
        <el-select v-model="dataForm.collegeId" placeholder="请选择" @change="collegeChange">
          <el-option
            v-for="item in collegeOptions"
            :key="item.collegeId"
            :label="item.collegeName"
            :value="item.collegeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级名" prop="className">
        <el-input v-model="dataForm.className" placeholder="班级名"></el-input>
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
          unitName: '',
          collegeId: '',
          collegeName: ''
        },
        dataRule: {
          className: [
            { required: true, message: '班级名不能为空', trigger: 'blur' }
          ],
          unitId: [
            { required: true, message: '学院不能为空', trigger: 'blur' }
          ],
          collegeId: [
            { required: true, message: '专业不能为空', trigger: 'blur' }
          ]
        },
        unitOptions: [],
        collegeOptions: [],
        allCollege: []
      }
    },
    methods: {
      init (id) {
        this.getUnit()
        this.getCollege()
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
                if (data.leaveClass.unitId) {
                  this.unitChange(data.leaveClass.unitId)
                }
                this.dataForm.className = data.leaveClass.className
                this.dataForm.collegeId = data.leaveClass.collegeId
                this.dataForm.collegeName = data.leaveClass.collegeName
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
                'collegeId': this.dataForm.collegeId,
                'collegeName': this.dataForm.collegeName,
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
            this.unitOptions = data.page.list
          }
        })
      },
      getCollege() {
        this.$http({
          url: this.$http.adornUrl(`/generator/leavecollege/list`),
          method: 'get',
          params: this.$http.adornParams({
            page: 1,
            limit: 100
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.allCollege = data.page.list
          }
        })
      },
      unitChange(v) {
        this.dataForm.unitName = this.unitOptions.find(i => i.unitId === v).unitName
        let tempArr = []
        tempArr = this.allCollege.filter(i => i.unitId === v)
        if (tempArr.length === 0 || (tempArr.length ===1 && tempArr[0] === void(0))) {
          this.$message({
            message: '请先添加对应的专业',
            type: 'warning'
          });
          return
        }
        this.collegeOptions = tempArr
      },
      collegeChange(v) {
        this.dataForm.collegeName = this.collegeOptions.find(i => i.collegeId === v).collegeName
      }
    }
  }
</script>
