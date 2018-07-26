<template>
	<section>
		<div v-if="this.showContent">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增群组</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table
			:data="deviceData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
			style="width: 100%"
			v-loading="loading">
			<el-table-column type="expand" align='center'>
				<template slot-scope="props">
					<el-form label-position="center" inline class="demo-table-expand">
					<el-form-item label="设备名称">
						<span>{{ props.row.deviceName }}</span>
					</el-form-item>
					<el-form-item label="所属群组">
						<span>{{ props.row.location }}</span>
					</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column
				align='center'
				label="群组 ID"
				prop="id">
			</el-table-column>
			<el-table-column
				align='center'
				label="群组名称"
				prop="deviceName">
			</el-table-column>
			<el-table-column
				align='center'
				label="群组描述"
				prop="deviceType">
			</el-table-column>
			<el-table-column label="操作" align='center'>
				<template slot-scope="scope">
				<el-button
					type="primary"
					size="small"
					@click="handleEdit(scope.$index, scope.row)">编 辑</el-button>
				<el-button
					type="danger"
					size="small"
					@click.native.prevent="deleteRow(scope.$index, deviceData)"
					@click="handleDelete(scope.$index, scope.row)">删 除</el-button>
				</template>
			</el-table-column>
  		</el-table>
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
		</div>
		<div v-if="!this.showContent">
			<el-card shadow="always" class="non-operation-card">
				您没有操作权限
			</el-card>
		</div>
	</section>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .non-operation-card {
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 100px;
	width: 150px;
	height: 40px
  }
</style>

<script>
import axios from 'axios'
import {mapState} from 'vuex';
import { BASE_URL,ADMIN_TYPE } from '../js/globalData'
const DEV_PREFIX = 'device'
const SUFFIX = 'info'
export default {
    data() {
		return {
			loading: true,
			deviceData: [],
			userType: '',
			showContent: false,
			pagesize: 10,
			currentPage: 1,
			totalCount: 0,
		}
	},
	methods: {
		handleSizeChange: function (size) {
        	this.pagesize = size;
		},
		handleCurrentChange: function(currentPage){
			this.currentPage = currentPage;
		},
		getDeviceInfos() {
			const url = `${BASE_URL}/${DEV_PREFIX}/${SUFFIX}`
			axios.get(url)
			.then((response) => {
				this.deviceData = response.data.data
				this.totalCount = response.data.totalCount
				this.loading = false
				console.log(this.deviceData)
			})
			.catch(function (error) {
				console.log(error);
			})
		}
	},
	mounted() {
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
		this.userType = this.userInfo.type
		this.showContent = this.userType === 'admin'
		this.getDeviceInfos()
	},
	computed:{
		//这里的三点叫做 : 扩展运算符
		...mapState({
			userInfo: state => state.user.userInfo
		}),
	}
}
</script>

