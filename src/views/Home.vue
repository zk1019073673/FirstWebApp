<template>
	<el-row class="container">
		<el-row class="header">
				<el-col class="logo">{{appName}}</el-col>
				<el-col class="logout">
					<el-dropdown>
						<span class="el-dropdown-link">
							<img src="../assets/images/logo.jpg"/>
							<span class="personal-center-text">个人中心</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>{{username}}</el-dropdown-item>
							<el-dropdown-item>{{userType == '1' ? '管理员':'用 户'}}</el-dropdown-item>
							<el-dropdown-item><a @click="logout">退出登录</a></el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-col>
				
				<!-- <el-col :span="6" class="logout"><a @click="logout">退出登录</a></el-col> -->
		</el-row>
		<el-col class="main">
			<aside class='menu-expanded'>
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" router>
					<template v-for="(item) in $router.options.routes">
						<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path">{{child.name}}</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<!-- <el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb> -->
					</el-col>
					<el-col class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
import axios from 'axios'
import {mapState} from 'vuex';
import * as tokenPrc from '../js/tokenProcess'
import { BASE_URL,ADMIN_TYPE } from '../js/globalData'
const USER_PREFIX = 'login'
const USER_SUFFIX = 'info'
export default {
	data() {
		return {
			appName:'Homework',
			username: '',
			userType: ''
		}
	},
	methods: {
		logout() {
			this.$confirm('是否退出登录 ?', '请确认', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
			.then(() => {
				tokenPrc.clearToken()
				// alert(this.userInfo.id)
				this.$router.push({ path: '/' });
				this.$message({
					type: 'success',
					message: '已退出登录!'
				});
			})
			.catch(() => {
				this.$message({
					type: 'info',
					message: '欢迎继续使用'
				});          
			});
		},
		getUserInfo() {
			this.username = this.userInfo.username
			this.userType = this.userInfo.type === 'admin' ? '1' : '2'
			// alert("username:"+this.username+" ,userType:"+this.userType)
		}
	},
	mounted() {
		this.getUserInfo()
	},
	computed:{
		//这里的三点叫做 : 扩展运算符
		...mapState({
			userInfo: state => state.user.userInfo
		}),
	}
}
</script>

<style scoped lang="scss">
	@import '~scss_vars';
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			width: 100%;
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.logo {
				width: 70%;
				font-size: 24px;
				padding-left: 20px;
			}
			.logout {
				flex: 1;
				width: 30%;
				padding-left: 410px;
				.personal-center-text {
					color: #fff;
				}
				img {
					width: 40px;
					padding-right: 5px;
					vertical-align:middle;
					display:inline-block;
					float: none;
				}
			}
		}
		.main {
			display: flex;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}
				}
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				flex:1;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>