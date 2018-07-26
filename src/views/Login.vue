<template>

  <div class="login-bg">
    <el-form label-position="left" label-width="0px" class="login-container" ref="login" :model="loginInfo" :rules="rulesLogin">
      <h3 class="title">用 户 登 陆</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="loginInfo.account" ref="account" auto-complete="off" placeholder="请输入您的账号">
          <Icon class="el-icon-ali-zhanghu" slot="prepend" ></Icon>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginInfo.password" ref="password" auto-complete="off" placeholder="请输入您的密码">
          <Icon class="el-icon-ali-mima" slot="prepend" ></Icon>
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginInfo.isRemember" class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="handleLogin" v-loading="isLoading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
  
</template>

<script>
import axios from 'axios'
import {mapState} from 'vuex';
import { BASE_URL } from '../js/globalData'
import loginAPI from '../api/loginAPI'
import * as tokenPrc from '../js/tokenProcess'
const LOGIN_PREFIX = 'login'
const LOGIN_SUFFIX = 'info'
const DEF_TOKEN_TS = (2 * 7 * 24 * 60) // 2 weeks
export default {
  data () {
    return {
      isLoading: false,
      loginInfo: {
        account: '',
        password: '',
        isRemember: true,
      },
      defTokenTs: DEF_TOKEN_TS,
      rulesLogin: {
        account: [
          { required: true, message: '请输入您的账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入您的密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.isLoading = true
      if(this.$refs.account.value === '' || this.$refs.password.value === ''){
        this.isLoading = false
        this.$message({
          message: '账号或密码不能为空哦！',
          type: 'warning',
          center: true
        });
        return
      } 
      let tokenTs = this.loginInfo.isRemember ? this.defTokenTs : 0
      // alert(tokenTs)
      let params = {
					username: this.$refs.account.value,
          password: this.$refs.password.value,
          tokenTs: tokenTs
      }
      loginAPI.login(params)
      .then ((response) => {
        if(response.data !== null){
          // alert(this.loginInfo.isRemember)
          console.log(response.data.map.Bearer)
          tokenPrc.setToken(response.data.map.Bearer) // 设置token
          if (this.loginInfo.isRemember) tokenPrc.rememberToken(response.data.map.Bearer) // 存储token
          let result = response.data.map.userInfoList
          if (result !== null) {
            this.$message({
              message: '登陆成功！',
              type: 'success',
              center: true
            });
            this.$store.dispatch('saveUserInfo')
            // alert(this.userInfo.id+","+this.userInfo.username+","+this.userInfo.type+","+this.userInfo.loginTs)
            this.isLoading = false
            this.$router.push({ path: '/Device' });
          } else {
            this.$message({
              message: '账号或密码不正确哦！',
              type: 'error',
              center: true
            });
            this.isLoading = false
          }
        }
      })
      .catch ((error) => {
        this.$message({
          message: '登陆失败！',
          type: 'error',
          center: true
        });
        this.loginInfo.account = ''
        this.loginInfo.password = ''
        this.isLoading = false
      })
    }
  },
  mounted() {
    let userId = this.userInfo.id
    // alert("登陆："+userId);
    let token = localStorage.getItem("homeworkToken")
    if (token !== null) {
      this.$router.push('./Device')
      return
    }
  },
  computed:{
		//这里的三点叫做 : 扩展运算符
		...mapState({
			userInfo: state => state.user.userInfo
		}),
	}
}

</script>

<style lang="scss">
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
      font-size:32px;
      font-weight: bold;
      font-family: 'Courier New', "Microsoft YaHei","微软雅黑",sans-serif
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
    .tip {
      color: red
    }
  }
  .login-bg {
    width:100%;
    height:100%;
    background-size:cover;
    overflow: hidden;
    background-image: url(../assets/images/login.png);
    background-position:center center;
    box-shadow: 0 0px 3px rgba(0,0,0,.5);
    text-align: right;
  }
</style>