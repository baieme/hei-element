<template>
  <div class="login">
    <div class="login-content">
      <div class="logo">
        <img src="~@/assets/logo.png" alt="" />
      </div>
      <el-form ref="form" :model="form" :rules = 'formRules'>
        <el-form-item prop='username'>
          <el-input
            v-model="form.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop='password'>
          <el-input
            type = 'password'
            v-model="form.password"
            prefix-icon="el-icon-s-goods"
          ></el-input>
        </el-form-item>
        <el-form-item class="submit">
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      form: {
        username:"admin",
        password:'123456'
      },
      formRules:{
          username:[
              {required:true,message:'请输入用户名',trigger:'blur'},
              { min: 3, max: 8, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password:[
              {required:true,message:'请输入密码',trigger:'blur'},
              { min: 3, max: 8, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
      }
    };
  },
  methods: {
      onSubmit(){
          this.$refs.form.validate(async valid =>{
              if(!valid) return;
              const {data:ref} = await this.$http.post('/login',this.form);
              if(ref.meta.status !== 200){
                  return this.$message.error('登录失败')
              }
              console.log(ref);
              this.$message.success('登录成功')
              //保存token
              sessionStorage.setItem('token',ref.data.token)
              console.log(valid)
              //进入登录页面
              this.$router.push('/home')
                
          })
      },
      //重置
      reset(){
          this.$refs.form.resetFields()
      }
  },
  created(){

  }
};
</script>
<style lang='scss' scoped>
.login {
  width: 100%;
  height: 100%;
  background: url("~@/assets/img/1.jpg") no-repeat;
  background-size: cover;
  .login-content {
    width: 450px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -225px;
    margin-top: -150px;
    background: #fff;
    border-radius: 10px;
    .logo {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      border-radius: 50%;
      padding: 10px;
      border: 1px solid #000;
      box-sizing: border-box;
      background: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .el-form {
      margin-top: 80px;
      padding: 0 40px;
      .submit {
          text-align: center;
      }
    }
  }
}
</style>