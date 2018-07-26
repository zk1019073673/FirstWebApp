<template>
	<section>
		<div v-if="this.showContent">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<el-form-item>
					<el-input type="text" v-model="searchUser" ref="searchUser" placeholder="请输入用户姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="info" @click="handleSearch">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="danger">删除</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>
		<!--列表-->
		<el-table class="table_body" :data="userData.slice((userInfoCurrentPage-1)*userInfoPagesize,userInfoCurrentPage*userInfoPagesize)" style="width: 100%" v-loading="loading" stripe border>
			<!-- <el-table-column type="selection" width="55" align='center'>
			</el-table-column> -->
			<el-table-column prop="id" label="ID" width="180" align='center'>
			</el-table-column>
			<el-table-column prop="username" label="姓名" width="180" align='center'>
			</el-table-column>
			<el-table-column prop="phone" label="手机号" width="180" align='center'>
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="180" align='center'>
			</el-table-column>
			<el-table-column prop="type" label="用户类型" :formatter="formatterUserType" width="180" align='center'>
			</el-table-column>
			<el-table-column label="操作" align='center'>
				<template slot-scope="scope">
					<el-button
						size="small"
						@click="handleCheck(scope.$index, scope.row)">查 看</el-button>
					<el-button
						type="success"
						size="small"
						@click="handleShare(scope.$index, scope.row)">分配设备</el-button>
					<el-button
						type="primary"
						size="small"
						@click="handleEdit(scope.$index, scope.row)">编 辑</el-button>
					<el-button
						type="danger"
						size="small"
						@click="handleDelete(scope.$index, scope.row)">删 除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--查看为每个用户分配的设备-->
		<el-dialog :title="userDeviceShared" v-model="checkDeviceFormVisible" style="width:100%" center v-loading="loadingData">
			<el-table 
				:data="userDeviceData.slice((userDeviceCurrentPage-1)*userDevicePagesize,userDeviceCurrentPage*userDevicePagesize)" 
				style="width: 100%" 
				stripe 
				border
				empty-text="未分配设备！"
				>
				<el-table-column prop="id" label="设备ID" width="110" align='center'>
				</el-table-column>
				<el-table-column prop="deviceName" label="设备名称" width="180" align='center'>
				</el-table-column>
				<el-table-column prop="location" label="设备位置" width="180" align='center'>
				</el-table-column>
				<el-table-column prop="deviceType" label="设备类型" :formatter="formatterDevType" width="180" align='center'>
				</el-table-column>
				<el-table-column prop="status" label="设备状态" :formatter="formatterDevStatus" width="150" align='center'>
				</el-table-column>
				<el-table-column label="操作" align='center'>
					<template slot-scope="scope">
						<el-button
							type="warning"
							size="small"
							@click="DeleteDevForUser(scope.$index, scope.row)">解除关联</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-dialog-block" >
				<el-pagination
					@size-change="handleUserDeviceSizeChange"
					@current-change="handleUserDeviceCurrentChange"
					background
					layout="prev, pager, next"
					:page-size="userDevicePagesize"
					:current-page="userDeviceCurrentPage"
					:total="userDeviceTotalCount">
				</el-pagination>
			</div>
		</el-dialog>

		<!--新增或编辑界面-->
		<el-dialog :title="titleMap[dialogStatus]" v-model="addFormVisible" class="addUser">
			<el-form label-width="80px">
				<el-form-item label="姓名" prop="name" >
					<el-input v-model="username" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item label="登陆密码" prop="password" >
					<el-input v-model="password" placeholder="请输入用户登陆密码"></el-input>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input v-model="phone" type="phone" placeholder="请输入手机号"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input type="email" v-model="email" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item label="用户类型">
					<el-select v-model="typeValue" placeholder="请选择用户类型">
						<el-option
							v-for="item in typeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveUser">保 存</el-button>
			</div>
		</el-dialog>

		<!--分配界面-->
		<el-dialog :title="shareDevice" v-model="shareFormVisible" style="width:100%" center v-loading="loadingData">
			<el-table 
				ref="multipleTable"
				:data="deviceData.slice((currentPage-1)*pagesize,currentPage*pagesize)" 
				style="width: 100%" 
				stripe 
				border
				empty-text="暂无可分配设备！"
				@selection-change="handleSelectionChange"
				>
				<el-table-column type="selection" prop="select" width="50" align='center'>
				</el-table-column>
				<el-table-column prop="id" label="设备ID" width="180" align='center'>
				</el-table-column>
				<el-table-column prop="deviceName" label="设备名称" width="180" align='center'>
				</el-table-column>
				<el-table-column prop="location" label="设备位置" width="180" align='center'>
				</el-table-column>
				<el-table-column prop="deviceType" label="设备类型" :formatter="formatterDevType" width="180" align='center'>
				</el-table-column>
				<el-table-column prop="status" label="设备状态" :formatter="formatterDevStatus" width="150" align='center'>
				</el-table-column>
			</el-table>
			<div class="pagination-dialog-block" >
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					background
					layout="prev, pager, next"
					:page-size="pagesize"
					:current-page="currentPage"
					:total="userInfoTotalCount">
				</el-pagination>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="shareFormVisible = false">取 消</el-button>

				<el-badge>
					<el-button type="success" @click="confirmShare">分 配</el-button>
				</el-badge>
			</div>
		</el-dialog>
		<div class="pagination-block" >
			<el-pagination
				@size-change="handleUserInfoSizeChange"
				@current-change="handleUserInfoCurrentChange"
				background
				layout="prev, pager, next"
				:page-size="userInfoPagesize"
				:current-page="userInfoCurrentPage"
				:total="userInfoTotalCount">
			</el-pagination>
		</div>
		</div>
		<div v-if="!this.showContent">
			<el-card shadow="always" class="non-operation-card">
				您没有操作权限
			</el-card>
		</div>
	</section>
</template>

<script>
import axios from 'axios'
import {mapState} from 'vuex';
import UserManagement from '../api/UserManagementAPI'
import { BASE_URL,ADMIN_TYPE,USER_TYPE,ADMIN_USER,GENERAL_USER,
		ADD_TITLE,EDIT_TITLE,CHP_DEVICE,ENV_DEVICE,ON_LINE,OFF_LINE,SEARCH_CONDITION } from '../js/globalData'
import UserManagementAPI from '../api/UserManagementAPI'
import DevManagementAPI from '../api/DevManagementAPI';
const USER_PREFIX = 'user'
const DEV_PREFIX = 'device'
const SUFFIX = 'info'
const UDEV_PREFIX = 'userDevice'
const U_SUFFIX = 'userInfo'
const UDEV_SUFFIX = 'ids'
export default {
	data() {
		return{
			addFormVisible: false,//新增界面是否显示
			shareFormVisible: false,
			checkDeviceFormVisible: false,
			selectItems: -1,
			userData: [],
			deviceData: [],
			userDeviceData: [],
			loading: true,
			loadingData: false,
			pagesize: 10,
			currentPage: 1,
			totalCount: 0,
			totalUserDeviceCount: 0,
			userType: -1,
			userId: -1,
			id: -1,
			shareDevice: '',
			userDeviceShared: '',
			username: '',
			searchUser: '',
			showContent: false,
			userInfoPagesize: 15,
			userInfoCurrentPage: 1,
			userInfoTotalCount: 0,
			userDevicePagesize: 10,
			userDeviceCurrentPage: 1,
			userDeviceTotalCount: 0,
			deviceIds: [],
			titleMap: {
				handleAdd: `${ADD_TITLE}`,
				handleEdit: `${EDIT_TITLE}`
			},
			dialogStatus: "",
			typeOptions: [
				{
				value: `${ADMIN_TYPE}`,
				label: `${ADMIN_USER}`}, 
				{
				value: `${USER_TYPE}`,
				label: `${GENERAL_USER}`}
			],
			typeValue: "",
		}
	},
	methods: {
		handleSearch() {
			this.loading = true
			if(this.searchUser === ''){
				this.$message({
					message: `${SEARCH_CONDITION}`,
					center: true
				});
				this.getUserInfos()
				this.loading = false
				return
			}
			UserManagementAPI.getUserInfoByName(this.searchUser)
			.then((response) => {	
				this.$message({
					message: response === null ? '查询失败！' : '查询完成！共'+response.data.totalCount+"个用户！",
					type: response === null ? 'error':'success',
					center: true
				});
				if(response !== null) {
					this.userData = response.data.data
					this.loading = false
				}
			})
			.catch((error) => {
				this.$message({
					message: '查询失败！',
					type: 'error',
					center: true
				})
				this.loading = false
			})
		},
		handleAdd() {
			this.userId = -1
			this.username = ''
			this.password = ''
			this.phone = ''
			this.email = ''
			this.typeValue = ''
			this.addFormVisible = true;
			this.dialogStatus = 'handleAdd'
		},
		handleEdit(index, row) {
			this.id = row.id
			this.username = row.username
			this.password = row.password
			this.phone = row.phone
			this.email = row.email
			this.typeValue = row.type === 1 ? `${ADMIN_USER}`:`${GENERAL_USER}`
			this.addFormVisible = true;
			this.dialogStatus = 'handleEdit'
		},
		saveUser() {
			if (this.dialogStatus === 'handleAdd') {
			let params = {
				"username":this.username,
				"password":this.password,
				"phone":this.phone,
				"email":this.email,
				"type":this.typeValue
			}
			UserManagementAPI.createUser(params)
			.then ((response) => {
				console.log("response:"+response)
				this.$message({
					message: response === null ? '新增用户失败！' : '已新增用户 '+ params.username,
					type: response === null ? 'error':'success',
					center: true
				});
				if(response !== null){
					this.addFormVisible = false
					this.getUserInfos()
				}
			})
			.catch ((error) => {
				this.$message({
					message: '新增用户失败！',
					type: 'error',
					center: true
				})
			}) 
			} else if (this.dialogStatus === 'handleEdit') {
				
				let params = {
					"id": this.id,
					"username": this.username,
					"password": this.password,
					"phone": this.phone,
					"email": this.email,
					"type": this.typeValue === `${ADMIN_USER}` ? 1 : this.typeValue === `${GENERAL_USER}` ? 2 : this.typeValue === `${ADMIN_TYPE}` ? 1 : 2
				}
				// console.log(params)
				UserManagementAPI.updateUser(params)
				.then ((response) => {
					this.$message({
						message: response.data.result ? '已编辑' : '修改用户失败！',
						type: response.data.result ? 'success':'error',
						center: true
					});
					if (response.data.result) {
						this.addFormVisible = false
						this.getUserInfos()
					}
				})
				.catch ((error) => {
					this.$message({
						message: '修改用户失败！',
						type: 'error',
						center: true
					})
				})
			}
		},
		handleCheck(index, row) {
			this.userDeviceShared = '查看用户 ' + row.username + ' 所关联的设备'
			this.username = row.username
			this.loadingData = true
			this.userId = row.id
			DevManagementAPI.getDevInfosByUserId(this.userId)
			.then((response) => {
				this.userDeviceData = response.data.data
				this.loadingData = false
				this.checkDeviceFormVisible = true
				this.userDeviceTotalCount = this.userDeviceData.length
			})
			.catch((error) => {
				console.log(error)
			})
		},
		DeleteDevForUser(index, row) {
			this.$msgbox({
				title: '请确认',
				message: '确认解除用户 '+this.username+ " 与设备 "+row.deviceName+' 的关联吗 ?',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose: (action, instance, done) => {
					if (action === 'confirm') {
						instance.confirmButtonLoading = true;
						instance.confirmButtonText = '正在解除...';
						let params = {
							"deviceId":row.id,
							"userId":this.userId
						}
						DevManagementAPI.delUserDevByDeviceId(params)
						.then((response) => {
							let result = response.data.result
							this.$message({
								message: result ? '已为用户 '+ this.username + ' 解除设备 '+row.deviceName+' 的关联！':'解除设备 '+row.deviceName+' 失败！',
								type: result ? 'success':'error',
								center: true
							});
							done();
							this.getDeviceInfosByUserId()
						})
						.catch((error) => {
							console.log(error)
						})
						instance.confirmButtonLoading = false;
					} else {
						done();
					}
          		}
			});
		},
		handleDelete(index, row) {
			if(row.username === 'admin') {
				this.$alert('超级管理员不能被删除！', '禁止', {
					confirmButtonText: '确定',
					callback: action => {
						this.$message({
						type: 'error',
						message: "删除失败！"
						});
					}
				});
				return
			}
			this.$msgbox({
				title: '请确认',
				message: '确认删除 '+row.username+' 吗 ?',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose: (action, instance, done) => {
					if (action === 'confirm') {
						instance.confirmButtonLoading = true;
						instance.confirmButtonText = '删除中...';
						let param = {"id":row.id}
						UserManagementAPI.delUser(param)
						.then((response) => {
							let result = response.data.result
							this.$message({
								message: result ? '删除用户 '+row.username+' 成功！':'删除用户 '+row.username+' 失败！',
								type: result ? 'success':'error',
								center: true
							});
							done();
							this.getUserInfos()
						})
						.catch((error) => {
							this.$message({
								message: '删除用户 '+row.username+' 失败！',
								type: error,
								center: true
							});
						})
						instance.confirmButtonLoading = false;
					} else {
						done();
					}
          		}
			});
		},
		confirmShare() {
			let params = this.deviceIds
			if (params.length === 0) {
				this.$message({
					message: '请选择设备！',
					type: 'warning',
					center: true
				});
				return
			}
			UserManagementAPI.shareDevForUser(this.deviceIds)
			.then((response) => {
				if (response.data !== null) {
					let idsLength = response.data.deviceIds.length
					this.$message({
						message: '已为 '+this.username+' 分配 '+idsLength+' 个设备！',
						type: 'success',
						center: true
					});
					this.shareFormVisible = false;
				} else {
					this.$message({
						message: '分配设备失败！',
						type: 'error',
						center: true
					});
				}
			})
			.catch((error) => {
				console.log(error)
				this.$message({
					message: '分配设备失败！',
					type: 'error',
					center: true
				});
			})
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.selectItems = this.multipleSelection.length
			let ids = [];
			for (let i=0;i<this.multipleSelection.length;i++) {
				ids.push({"userId":this.userId,"deviceId":this.multipleSelection[i].id});
			}
			this.deviceIds = ids;
      	},
		handleSizeChange: function (size) {
        	this.pagesize = size;
		},
		handleUserInfoSizeChange: function (size) {
			this.userInfoPagesize = size;
		},
		handleUserDeviceSizeChange: function (size) {
			this.userDevicePagesize = size;
		},
		handleCurrentChange: function (currentPage) {
			this.currentPage = currentPage;
		},
		handleUserInfoCurrentChange: function (currentPage) {
			this.userInfoCurrentPage = currentPage;
		},
		handleUserDeviceCurrentChange: function (currentPage) {
			this.userDeviceCurrentPage = currentPage;
		},
		formatterUserType(row, column) {
			switch(row.type){
                case 1:
                return '* 管理员';
                break;
                case 2:
                return `${GENERAL_USER}`;
                break;

                default:
                return '未 知';
            }
		},
		formatterDevStatus(row, column) {
            switch(row.status){
                case 0:
                return `${ON_LINE}`;
                break;
                case 1:
                return `${OFF_LINE}`;
                break;

                default:
                return '未 知';
            }
        },
		formatterDevType(row, column) {
			switch(row.deviceType){
                case 1:
                return `${CHP_DEVICE}`;
                break;
                case 2:
                return `${ENV_DEVICE}`;
                break;

                default:
                return '未 知';
            }
		},
		toggleSelection(rows) {
			rows.forEach(row => {
				this.$refs.multipleTable.toggleRowSelection(row);
				// alert(this.$refs.multipleTable.toggleRowSelection(row))
			});
		},
		handleShare(index,row) {
			this.shareDevice = '分配设备 - ' + row.username  
			this.loadingData = true
			this.userId = row.id
			this.username = row.username
			DevManagementAPI.getDevInfos()
			.then((response) => {
				this.deviceData = response.data.data
				this.totalCount = response.data.totalCount
				if (response !== null) {
					DevManagementAPI.getDevInfosByUserId(this.userId)
					.then((response) => {
						this.userDeviceData = response.data.data
						this.loading = false
					})
					.then(() => {
						// this.toggleSelection(this.deviceData);
						for (let i=0;i<this.userDeviceData.length;i++) {
							for (let j=0;j<this.deviceData.length;j++) {
								if (this.userDeviceData[i].id === this.deviceData[j].id) {
									this.deviceData.splice(j, 1);
								}
							}
						}
						this.shareFormVisible = true;
						this.loadingData = false
						this.userInfoTotalCount = this.deviceData.length
					})
					.catch((error) => {
						console.log(error)
					})
				}
			})
			.catch((error) => {
				console.log(error);
			})
		},
		getDeviceInfos() {
			DevManagementAPI.getDevInfos()
			.then((response) => {
				this.deviceData = response.data.data
				// alert("deviceAPI:"+this.deviceData.length)
				this.totalCount = response.data.totalCount
				console.log(this.deviceData)
			})
			.catch(function (error) {
				console.log(error);
			})
		},
		getDeviceInfosByUserId() {
			// let params = {"userId":this.userId}
			DevManagementAPI.getDevInfosByUserId(this.userId)
			.then((response) => {
				this.userDeviceData = response.data.data
				this.loading = false
			})
			.catch((error) => {
				this.$message({
					message: '获取设备信息失败！',
					type: 'error',
					center: true
				})
			})
		},
		getUserInfos () {
			UserManagement.getUserInfo()
			.then((response) => {
				this.userData = response.data.data
				this.userInfoTotalCount = response.data.totalCount
				this.loading = false
			})
			.catch((error) => {
				this.$message({
					message: '获取用户信息失败！',
					type: 'error',
					center: true
				})
				this.loading = false
			})
		}
	},
	mounted () {
		this.userType = this.userInfo.type
		// alert(this.userType)
		this.showContent = this.userType === 'admin'
		this.getUserInfos()
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

<style scoped>
	.el-input {
		width:80%;
	};
	.addUser {
		width: 50%;
		margin:0 auto;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.pagination-block {
		position: absolute;
		display: flex;
		justify-content: center;
	}
	.pagination-dialog-block {
		padding-top: 20px;
		display: flex;
		justify-content: center;
		align-items: center
	}
	.non-operation-card {
		margin:0 auto;
		width: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		
	}
</style>