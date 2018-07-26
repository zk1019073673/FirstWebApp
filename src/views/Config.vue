<template>
    <el-form :model="modifyPass" status-icon :rules="rules" ref="modifyPass" label-width="100px" class="modifyForm">
        <el-form-item label="旧密码" prop="oldPass">
            <el-input type="password" v-model="modifyPass.oldPass" @blur="checkOldPass()"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
            <el-input type="password" v-model="modifyPass.newPass"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
            <el-input type="password" v-model="modifyPass.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="confirmModify('modifyPass')">确认修改</el-button>
            <el-button @click="resetModify('modifyPass')">重 置</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import axios from 'axios'
import {mapState} from 'vuex';
import UserManagementAPI from '../api/UserManagementAPI'
import { BASE_URL,ADMIN_TYPE } from '../js/globalData'
import configAPI from '../api/configAPI'
import * as tokenPrc from '../js/tokenProcess'
const USER_PREFIX = 'user'
const INFO_SUFFIX = 'info'
export default {
    data() {
        let validateOldPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入旧密码'));
            } else if (value !== this.password) {
                callback(new Error('密码输入错误!'));
            } else {
                callback();
            }
        };
        let validateNewPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'));
            } else if (value === this.modifyPass.oldPass) {
                callback(new Error('新旧密码不能相同!'));
            } else {
                callback();
            }
        };
        let validateCheckPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.modifyPass.newPass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            userType: '',
            username: '',
            password: '',
            id: -1,
            phone: '',
            email: '',
            modifyPass: {
                oldPass: '',
                newPass: '',
                checkPass: ''
            },
            rules: {
                oldPass: [
                    { required: true, validator: validateOldPass, trigger: 'blur' },
                    { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, validator: validateNewPass, trigger: 'blur' },
                    { min: 3, max: 6, message: '长度在 3 到 6 个字符',  trigger: 'blur' }
                ],
                checkPass: [
                    { required: true, validator: validateCheckPass, trigger: 'blur' },
                    { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        checkOldPass() {
            UserManagementAPI.getUserInfoByName(this.username)
            .then((response) => {
                if (response !== null) {
                    let oldPwd = response.data.data[0].password
                    // alert(oldPwd)
                    this.password = oldPwd
                }
            })
            .catch((error) => {
                this.$message({
                    message: '旧密码验证失败！',
                    type: 'error',
                    center: true
                })
            })
        },
        confirmModify(mofidyPass) {
            let params = {
                "id":this.id,
                "username":this.username,
                "password":this.modifyPass.newPass,
                "type":this.userType,
                "phone":this.phone,
                "email":this.email
            }
            this.$refs[mofidyPass].validate((valid) => {
                if (valid) {
                    configAPI.mofifyPwd(params)
                    .then ((response) => {
                        this.$message({
                            message: response.data.result ? '密码修改成功,请重新登陆！' : '密码修改失败！',
                            type: response.data.result ? 'success':'error',
                            center: true
                        });
                        if(response.data.result) {
                            tokenPrc.clearToken()
                            setTimeout(() => {
                                this.$router.push({ path: '/' });
                            }, 1500);
                        }
                    })
                    .catch ((error) => {
                        this.$message({
                            message: '密码修改失败！',
                            type: 'error',
                            center: true
                        })
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetModify(mofidyPass) {
            this.$refs[mofidyPass].resetFields();
        },

    },
    mounted() {
        this.userType = this.userInfo.type === 'admin' ? '1' : '2'
        this.id = this.userInfo.id
        this.username = this.userInfo.username
        this.phone = this.userInfo.phone
        this.email = this.userInfo.email
        // alert(this.userInfo.id+","+this.userInfo.username+","+this.userInfo.type+","+this.userInfo.loginTs+","+this.userInfo.phone+","+this.userInfo.email)
        let token = localStorage.getItem("homeworkToken")
		if (token === null) {
            this.$message({
				message: '您还没有登录，请先登录！',
				type: 'warning',
				center: true
			})
			this.$router.push({ path: '/' });
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
<style>
    .modifyForm{
        padding-top :20px;
        width: 25%
    }
</style>
