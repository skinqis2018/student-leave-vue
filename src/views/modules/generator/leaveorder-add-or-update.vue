<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="申请原因" prop="why">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="申请原因"
        v-model="dataForm.why">   
      </el-input>
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime">
      <el-date-picker
        v-model="dataForm.startTime"
        type="datetime"
        placeholder="开始时间"
        value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-date-picker
        v-model="dataForm.endTime"
        type="datetime"
        placeholder="结束时间"
        value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
const DAYTIME = 86400000;
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          orderId: 0,
          username: '',
          why: '',
          startTime: '',
          endTime: '',
          status: '',
        },
        dataRule: {
          why: [
            { required: true, message: '申请原因不能为空', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '结束时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      },
      classId: {
        get () { return this.$store.state.user.classId }
      },
      unitId: {
        get () { return this.$store.state.user.unitId }
      }
    },
    methods: {
      init (id) {
        this.dataForm.orderId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.orderId) {
            this.$http({
              url: this.$http.adornUrl(`/generator/leaveorder/info/${this.dataForm.orderId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.why = data.leaveOrder.why
                this.dataForm.startTime = data.leaveOrder.startTime
                this.dataForm.endTime = data.leaveOrder.endTime
                this.dataForm.status = data.leaveOrder.status
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let during = 0;
            let start = new Date(this.dataForm.startTime)
            let end = new Date(this.dataForm.endTime)
            during = Math.ceil((end - start) / DAYTIME)
            this.$http({
              url: this.$http.adornUrl(`/generator/leaveorder/${!this.dataForm.orderId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'orderId': this.dataForm.orderId || undefined,
                'username': this.userName,
                'unitId': this.unitId,
                'classId': this.classId,
                'why': this.dataForm.why,
                'startTime': this.dataForm.startTime,
                'endTime': this.dataForm.endTime,
                'during': during,
                'status': 1
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
      
      }
    }
  }
</script>
