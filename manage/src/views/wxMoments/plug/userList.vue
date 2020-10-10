<template>
	<div class="user_list_main_css">
		<div class="search_box">
			<el-button type="danger" @click="addInfo">添加圈主</el-button>
		</div>
		<el-table
			v-loading="tabLoad"
			:data="tabData"
			stripe
			class="tab_box_css"
		>
			<el-table-column
				type="index"
				label="序号"
				width="50"
			></el-table-column>
			<el-table-column
				prop="CreatorName"
				label="名称"
				align="center"
				width="180"
			></el-table-column>
			<el-table-column
				prop="CreatorPhoto"
				label="头像"
				align="center"
				width="80"
			>
				<template slot-scope="scope">
					<img
						:src="scope.row.CreatorPhoto"
						alt
						class="row_user_img"
					/>
				</template>
			</el-table-column>
			<el-table-column
				prop="CreatorDesc"
				label="简介"
				align="center"
			></el-table-column>
			<el-table-column
				prop="CreateDate"
				label="创建时间"
				align="center"
				width="150"
			></el-table-column>
			<el-table-column
				prop="IsShow"
				label="显示状态"
				align="center"
				width="100"
			>
				<template slot-scope="scope">
					<el-switch
						@change="switchChange(scope.row)"
						v-model="scope.row.IsShow"
						active-color="#13ce66"
					></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="100">
				<template slot-scope="scope">
					<el-button type="primary" @click="editInfo(scope.row)"
						>编辑</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			v-if="totalNum > 0"
			class="page_temp_css"
			background
			layout="prev, pager, next"
			:total="totalNum"
			@current-change="pageClick"
			@prev-click="pageClick"
			@next-click="pageClick"
		></el-pagination>
		<addUserDig
			v-if="isShowDig"
			:formDig="formDig"
			:isShowDig.sync="isShowDig"
			@edit-moments="editMoments"
		></addUserDig>
	</div>
</template>
<script>
	import addUserDig from "./addUserDig";
	export default {
		name: "userList",
		props: {},
		components: { addUserDig },
		data() {
			return {
				tabLoad: true,
				tabData: [],
				formDig: {
					titleDig: "添加圈主信息",
				},
				isShowDig: false,
				pageIndex: 1, //页码
				pageSize: 20, //条数
				totalNum: 0, //总数量
			};
		},
		created() {
			this.getMomentList();
		},
		computed: {},
		watch: {},
		mounted() {},
		filters: {},
		activated() {},
		deactivated() {},
		methods: {
			//翻页点击事件
			pageClick(idx) {
				this.pageIndex = idx;
				this.getMomentList();
			},
			//获取圈主列表
			getMomentList() {
				let par = {
					PagingInfo: {
						CurrentPage: this.pageIndex,
						PageSize: this.pageSize,
					},
				};
				this.$store
					.dispatch("wxMoments/GetMomentsList", par)
					.then((res) => {
						let data = res.Data || [];
						if (res.State == 0 && data.length > 0) {
							this.tabData = data;
							this.totalNum = res.Page.Records;
						}
						this.tabLoad = false;
					})
					.catch((err) => {
						console.error(err);
					});
			},
			//打开、关闭显示状态
			switchChange(item) {
				console.log(item, "type");
				let par = {
					isShow: item.IsShow,
					momentsCreatorId: item.MomentsCreatorId,
				};
				this.$store
					.dispatch("wxMoments/UpdateIsShow", par)
					.then((res) => {})
					.catch((err) => {
						item.IsShow = !item.IsShow;
						this.$message.error(err.ErrorMessage || "");
					});
			},
			//添加按钮
			addInfo() {
				this.formDig = {
					titleDig: "添加圈主信息",
					info: null,
				};
				this.isShowDig = true;
			},
			//编辑按钮
			editInfo(item) {
				this.formDig = {
					titleDig: "圈主信息修改",
					info: { ...item },
				};
				this.isShowDig = true;
			},
			//添加、编辑完成后回调事件
			editMoments() {
				this.tabLoad = true;
				this.pageIndex = 1;
				this.getMomentList();
				this.isShowDig = false;
			},
		},
	};
</script>
<style lang="less" scoped>
	.user_list_main_css {
		position: relative;
		width: 100%;
		min-width: 750px;
		overflow: hidden;
		.search_box {
			position: relative;
			overflow: hidden;
			width: 100%;
			margin-bottom: 15px;
			display: flex;
			justify-content: flex-end;
			padding: 0 15px;
		}

		.tab_box_css {
			border-top: 1px solid #ebeef5;
			width: 100%;
			.row_user_img {
				width: 40px;
				height: 40px;
				border-radius: 40px;
				object-fit: cover;
				display: block;
				margin: auto;
			}
			& /deep/ .el-table__body-wrapper {
				max-height: calc(100vh - 220px);
				overflow-y: auto;
			}
			& /deep/ .el-table__row {
				& > td {
					padding: 4px 0;
				}
				.cell {
					line-height: 1.6;
				}
			}
		}
		& /deep/ .page_temp_css {
			text-align: center;
			padding-top: 15px;
		}
	}
</style>
