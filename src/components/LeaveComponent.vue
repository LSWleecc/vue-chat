<template>
  <div class="leave">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" class="demo-ruleForm">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="ruleForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="开始" prop="startData">
        <el-date-picker
          class="chooseData"
          v-model="ruleForm.startTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          @change="getStartTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束" prop="endData">
        <el-date-picker
          class="chooseData"
          v-model="ruleForm.endTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          @change="getEndTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/javascript">
  export default {
    data(){
      var checkUsername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('名字不能为空'));
        }else{
          callback()
        }
      };
      var validateStartData = (rule, value, callback) => {
        if(!this.ruleForm.startTime){
          callback(new Error('请输开始时间'));
        }else{
          callback()
        }
      };
      var validateEndData = (rule, value, callback) => {
        if (!this.ruleForm.endTime) {
          callback(new Error('请输入结束时间'));
        }else if(this.endTime < this.startTime){
          callback(new Error('结束时间不能小于开始时间'));
        } else {
          callback();
        }
      };
      var validateRemark = (rule , value ,callback) => {
        if(!this.ruleForm.desc){
          callback(new Error('请说明理由'))
        }else{
          callback()
        }
      }
      return {
        ruleForm: {
          username: '',
          desc: '',
          startTime: '',
          endTime: ''
        },
        rules: {
          username: [
            { validator: checkUsername, trigger: 'blur' }
          ],
          startData: [
            {  validator: validateStartData, trigger: 'change' }
          ],
          endData: [
            {  validator: validateEndData, trigger: 'change' }
          ],
          remark: [
            { validator: validateRemark, trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      getStartTime(){
        this.startTime = new Date(this.ruleForm.startTime).getTime()
      },
      getEndTime(){
        this.endTime = new Date(this.ruleForm.endTime).getTime()
      },
      submitForm(formName) {
        const {username , desc , startTime , endTime } = this.ruleForm
        this.$refs[formName].validate((valid) => {
          if(valid){
            alert(username + desc + startTime + endTime)
          }
        });
      },
    }
  }
</script>
<style lang="scss"  scoped>
  .leave {
    .chooseData {
      width: 100%;
    }
  }
</style>
<style lang="scss">
  .leave {
    .chooseData[data-v-7e68b194] {
      .el-input__prefix {
        display: none;
      }
      .el-input__inner {
        padding-left: 10px;
      }
    }
  }
</style>
