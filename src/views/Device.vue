<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<el-form-item>
					<el-input type="text" v-model="searchDevice" ref="searchDevice" placeholder="请输入设备名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="info" @click="handleSearch">查询</el-button>
				</el-form-item>
				<el-form-item v-if="this.showContent">
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="danger">删除</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>
		<!--列表-->
		<el-table 
			:data="deviceData.slice((currentPage-1)*pagesize,currentPage*pagesize)" 
			style="width: 100%" v-loading="loading" stripe border>
			<!-- <el-table-column type="selection" width="55" align='center'>
			</el-table-column> -->
			<el-table-column prop="id" label="设备ID" width="180" align='center'>
			</el-table-column>
			<el-table-column prop="deviceName" label="设备名称" width="180" align='center'>
			</el-table-column>
			<el-table-column prop="location" label="设备位置" width="180" align='center'>
			</el-table-column>
			<el-table-column prop="deviceType" label="设备类型" :formatter="formatterDevType" width="180" align='center'>
			</el-table-column>
			<el-table-column prop="status" label="设备状态" :formatter="formatterDevStatus" width="180" align='center'>
			</el-table-column>
			<el-table-column label="操作" align='center' v-if="this.showContent">
				<template slot-scope="scope">
					<el-button
						type="primary"
						size="small"
						@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button
						type="danger"
						size="small"
						@click.native.prevent="deleteRow(scope.$index, deviceData)"
						@click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" align='center' v-if="!this.showContent">
				<template slot-scope="scope">
					<el-card shadow="always" class="operation-card">
						无可用操作
					</el-card>
				</template>
			</el-table-column>
		</el-table>

		<!--新增界面-->
		<el-dialog :title="titleMap[dialogStatus]" v-model="addFormVisible" class="addDevice">
			<el-form label-width="80px">
				<el-form-item label="设备名称" prop="name" >
					<el-input v-model="deviceName" placeholder="请输入设备名称"></el-input>
				</el-form-item>
				<el-form-item label="设备位置">
					<el-input v-model="location" placeholder="请输入设备位置"></el-input>
				</el-form-item>
				<el-form-item label="设备类型">
					<el-select v-model="typeValue" placeholder="请选择设备类型">
						<el-option
							v-for="item in typeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="设备状态">
					<el-select v-model="statusValue" placeholder="请选择设备状态">
						<el-option
							v-for="item in statusOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleSave">保 存</el-button>
			</div>
		</el-dialog>
		<div class="pagination-block" >
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				background
				layout="prev, pager, next"
				:page-size="pagesize"
				:current-page="currentPage"
				:total="totalCount">
			</el-pagination>
		</div>
	</section>
	
</template>

<script>
import axios from 'axios'
import {mapState} from 'vuex';
import { BASE_URL,ADMIN_TYPE,CHP_DEVICE,ENV_DEVICE,ON_LINE,OFF_LINE,SEARCH_CONDITION } from '../js/globalData'
import DevManagementAPI from '../api/DevManagementAPI';
const DEV_PREFIX = 'device'
const INFO_SUFFIX = 'info'
const DEV_SUFFIX = 'deviceInfo'
const UDEV_PREFIX = 'userDevice'
const UDEV_SUFFIX = 'ids'
export default {
	data() {
		return{
			addFormVisible: false, //新增界面是否显示
			deviceData: [],
			deviceId:'',
			loading: true,
			pagesize: 15,
			currentPage: 1,
			totalCount: 0,
			searchDevice: '',
			userType: -1,
			userId: -1,
			showContent: false,
			titleMap: {
				handleAdd: "新 增",
				handleEdit: "编 辑"
			},
			dialogStatus: "",
			typeOptions: [
				{
				value: '1',
				label: `${CHP_DEVICE}`
				},
				{
				value: '2',
				label: `${ENV_DEVICE}`
				}
			],
			typeValue: "",
			statusOptions: [
				{
				value: '0',
				label: `${ON_LINE}`}, 
				{
				value: '1',
				label: `${OFF_LINE}`}
			],
			statusValue: "",
		}
	},
	methods: {
		handleSizeChange: function (size) {
        	this.pagesize = size;
		},
		handleCurrentChange: function(currentPage){
			this.currentPage = currentPage;
		},
		//状态改成汉字
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
		//显示新增界面
		handleAdd() {
			this.deviceId = ''
			this.deviceName = ''
			this.location = ''
			this.typeValue = ''
			this.statusValue = ''
			this.addFormVisible = true;
			this.dialogStatus = 'handleAdd'
		},
		handleEdit(index, row) {
			this.deviceId = row.id
			this.deviceName = row.deviceName
			this.location = row.location
			this.typeValue = row.deviceType === 1 ? `${CHP_DEVICE}` : `${ENV_DEVICE}`
			this.statusValue = row.status === 0 ? `${ON_LINE}` : `${OFF_LINE}`
			this.addFormVisible = true;
			this.dialogStatus = 'handleEdit'
		},
		handleSearch() {
			this.loading = true
			if(this.searchDevice === ''){
				this.$message({
					message: `${SEARCH_CONDITION}`,
					center: true
				});
				this.getDeviceInfos()
				this.loading = false
				return
			}
			// let params = {"deviceName":this.searchDevice}
			DevManagementAPI.getDevInfoByName(this.searchDevice)
			.then((response) => {	
				this.$message({
					message: response === null ? '查询失败！' : '查询完成！共'+response.data.totalCount+"个设备！",
					type: response === null ? 'error':'success',
					center: true
				});
				if(response !== null) {
					this.deviceData = response.data.data
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
		
		handleSave() {
			if (this.dialogStatus === 'handleAdd') {
				let params = {
					"deviceName":this.deviceName,
					"location":this.location,
					"deviceType":this.typeValue,
					"status":this.statusValue
				}
				DevManagementAPI.createDev(params)
				.then ((response) => {
					console.log("response:"+response)
					this.$message({
						message: response === null ? '新增设备失败' : '已新增设备 '+ params.deviceName,
						type: response === null ? 'error':'success',
						center: true
					});
					if(response !== null){
						this.addFormVisible = false
						this.getDeviceInfos()
					}
				})
				.catch ((error) => {
					this.$message({
						message: '新增设备失败',
						type: 'error',
						center: true
					})
				})
			} else if (this.dialogStatus === 'handleEdit') {
				let params = {
					"id":this.deviceId,
					"deviceName":this.deviceName,
					"location":this.location,
					"deviceType":this.typeValue === `${CHP_DEVICE}` ? 1 : this.typeValue === `${ENV_DEVICE}` ? 2 : this.typeValue === '1' ? 1 : 2,
					"status":this.typeValue === `${ON_LINE}` ? 0 : this.typeValue === `${OFF_LINE}` ? 1 : this.typeValue === '0' ? 0 : 1
				}
				DevManagementAPI.updateDev(params)
				.then ((response) => {
					this.$message({
						message: response.data.result ? '已编辑' : '修改设备失败！',
						type: response.data.result ? 'success':'error',
						center: true
					});
					if (response.data.result) {
						this.addFormVisible = false
						this.getDeviceInfos()
					}
				})
				.catch ((error) => {
					this.$message({
						message: '修改设备失败！',
						type: 'error',
						center: true
					})
				})
			}
		},
		handleDelete(index, row) {
			this.$msgbox({
				title: '请确认',
				message: '确认删除 '+row.deviceName+' 吗 ?',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose: (action, instance, done) => {
					if (action === 'confirm') {
						instance.confirmButtonLoading = true;
						instance.confirmButtonText = '删除中...';
						let param = {"id":row.id}
						DevManagementAPI.delDev(param)
						.then((response) => {
							let result = response.data.result
							this.$message({
								message: result ? '删除设备 '+row.deviceName+' 成功！':'删除设备 '+row.deviceName+' 失败！',
								type: result ? 'success':'error',
								center: true
							});
							done();
							this.getDeviceInfos()
						})

						.catch(function (error) {
							console.log(error)
						})
						instance.confirmButtonLoading = false;
					} else {
						done();
					}
          		}
			});
		},
		getDeviceInfos() {
			DevManagementAPI.getDevInfos()
			.then((response) => {
				this.deviceData = response.data.data
				this.loading = false
				this.totalCount = response.data.totalCount
				console.log(this.deviceData)
			})
			.catch(function (error) {
				console.log(error);
			})
		},
		getDeviceInfosByUserId() {
			DevManagementAPI.getDevInfosByUserId(this.userId)
			.then((response) => {
				this.deviceData = response.data.data
				this.loading = false
				this.totalCount = response.data.totalCount
			})
			.catch((error) => {
				// this.$message({
				// 	message: '获取设备信息失败！',
				// 	type: 'error',
				// 	center: true
				// })
				console.log(error);
			})
		}
	},
	mounted() {
		// this.$store.commit('switch_state')
		// this.$store.dispatch('switch_state')
		// alert("show : " + this.$store.getters.not_show)
		// alert("show : " + this.$store.state.global.show)
		// alert("show : " + this.show)
		this.userType = this.userInfo.type === 'admin' ? '1' : '2'
		this.userId = this.userInfo.id
		// alert(this.userId+this.userType)
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
		this.showContent = this.userType === '1'
		if (this.userType !== 'admin') {
			this.getDeviceInfosByUserId()
		} else {
			this.getDeviceInfos()
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
	.addDevice {
		width: 50%;
		margin:0 auto;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.pagination-block {
		position: absolute;
		padding-top: 20px;
		padding-left: 650px
	}
	.operation-card {
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 150px;
		height: 40px
	}
</style>