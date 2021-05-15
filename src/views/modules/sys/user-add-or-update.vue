<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item v-if="isStudent()" label="学号" prop="studentNo">
        <el-input v-model="dataForm.studentNo" placeholder="学号"></el-input>
      </el-form-item>
      <el-form-item v-if="isStudent()" label="宿舍号" prop="roomNo">
        <el-input v-model="dataForm.roomNo" placeholder="宿舍号"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="isLeader()" label="所管理学院" prop="adminunitId">
        <el-select v-model="dataForm.adminunitId" placeholder="任职主任的学院" @change="setAdminunitName">
          <el-option
            v-for="item in unitOptions"
            :key="item.unitId" 
            :label="item.unitName"
            :value="item.unitId">
          </el-option>
        </el-select>
        <el-tooltip effect="dark" content="任职系主任的学院" placement="right">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="isTeacher()" :label="`${preText}学院`" prop="unitId">
        <el-select v-model="dataForm.unitId" placeholder="请选择" @change="getCollege">
          <el-option
            v-for="item in unitOptions"
            :key="item.unitId" 
            :label="item.unitName"
            :value="item.unitId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isTeacher()" :label="`${preText}专业`" prop="collegeId">
        <el-select v-model="dataForm.collegeId" placeholder="请选择" @change="getClasses">
          <el-option
            v-for="item in collegeOptions"
            :key="item.collegeId"
            :label="item.collegeName"
            :value="item.collegeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isTeacher()" :label="`${preText}班级`" prop="classId">
        <el-select v-model="dataForm.classId" placeholder="请选择" @change="setClassName">
          <el-option
            v-for="item in classOptions"
            :key="item.classId"
            :label="item.className"
            :value="item.classId">
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
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        roleList: [],
        dataForm: {
          id: 0,
          userName: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: 'email@email.com',
          name: '',
          studentNo: '',
          roomNo: '',
          mobile: '',
          roleIdList: [],
          status: 1,
          unitId: '',
          unitName: '',
          collegeId: '',
          collegeName: '',
          classId: '',
          className: '',
          adminunitId: '',
          adminunitName: '',
        },
        dataRule: {
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ]
        },
        unitOptions: [],
        collegeOptions: [],
        classOptions: []
      }
    },
    computed: {
      preText() {
        return this.roleList.includes(2) ? '任教' : '所属'
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.roleList = data && data.code === 0 ? data.list : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.user.username
                this.dataForm.salt = data.user.salt
                this.dataForm.email = data.user.email
                this.dataForm.name = data.user.name
                this.dataForm.studentNo = data.user.studentNo
                this.dataForm.roomNo = data.user.roomNo
                this.dataForm.mobile = data.user.mobile
                this.dataForm.roleIdList = data.user.roleIdList
                this.dataForm.status = data.user.status
                this.dataForm.unitId = data.user.unitId
                this.dataForm.unitName = data.user.unitName
                this.dataForm.collegeId = data.user.collegeId
                this.dataForm.collegeName = data.user.collegeName
                this.dataForm.classId = data.user.classId
                this.dataForm.className = data.user.className
                this.dataForm.adminunitId = data.user.adminunitId
                this.dataForm.adminunitName = data.user.adminunitName
              }
            })
          }
        })
        this.getUnits()
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.id || undefined,
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'name': this.dataForm.name,
                'studentNo': this.dataForm.studentNo,
                'roomNo': this.dataForm.roomNo,
                'mobile': this.dataForm.mobile,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList,
                'unitId': this.dataForm.unitId,
                'unitName': this.dataForm.unitName,
                'collegeId': this.dataForm.collegeId,
                'collegeName': this.dataForm.collegeName,
                'classId': this.dataForm.classId,
                'className': this.dataForm.className,
                'adminunitId': this.dataForm.adminunitId,
                'adminunitName': this.dataForm.adminunitName
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
      getUnits() {
        this.$http({
          url: this.$http.adornUrl(`/generator/leaveunit/list`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.unitOptions = data.page.list
          }
        })
      },
      getCollege(unitId) {
        let currentUnit = this.unitOptions.find(i => i.unitId === unitId)
        this.dataForm.unitName = currentUnit ? currentUnit.unitName : null
        this.collegeOptions = []
        this.dataForm.collegeId = ''
        this.classOptions = []
        this.dataForm.classId = ''
        this.$http({
          url: this.$http.adornUrl(`/generator/leavecollege/list`),
          method: 'get',
          params: this.$http.adornParams({
            unitId: Number(unitId)
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.collegeOptions = data.page.list
          }
        })
      },
      getClasses(collegeId) {
        let currentCollege = this.collegeOptions.find(i => i.collegeId === collegeId)
        this.dataForm.collegeName = currentCollege ? currentCollege.collegeName : null
        this.classOptions = []
        this.dataForm.classId = ''
        this.$http({
          url: this.$http.adornUrl(`/generator/leaveclass/list`),
          method: 'get',
          params: this.$http.adornParams({
            collegeId: Number(collegeId)
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.classOptions = data.page.list
          }
        })
      },
      setClassName(classid) {
        let currentclass = this.classOptions.find(i => i.classId === classid)
        this.dataForm.className = currentclass ? currentclass.className : null
      },
      setAdminunitName(unitId) {
        let currentunit = this.unitOptions.find(i => i.unitId === unitId)
        this.dataForm.adminunitName = currentunit ? currentunit.unitName : null
      },
      isLeader() {
        return this.dataForm.roleIdList.includes(3)
      },
      isTeacher() {
        return this.dataForm.roleIdList.includes(2) || this.dataForm.roleIdList.includes(1)
      },
      isStudent() {
        return this.dataForm.roleIdList.includes(1)
      }
    }
  }
</script>
