<template>
	<div class="user_list_main_css">
		<div class="search_box">
			<div class="search_item_box">
				<label>创建日期</label>
				<el-date-picker
					v-model="dateArr"
					type="daterange"
					range-separator="~"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					class="date_ipt"
					value-format="yyyy-MM-dd"
					clearable
				>
				</el-date-picker>
				<label>圈主名称</label>
				<el-select
					v-model="momId"
					placeholder="请选择圈主"
					class="select_ipt"
					clearable
				>
					<el-option
						v-for="item in momentList"
						:key="'mk' + item.MomentsCreatorId"
						:label="item.CreatorName"
						:value="item.MomentsCreatorId"
					>
					</el-option>
				</el-select>
				<label>关键词搜索</label>
				<el-input
					class="keyword_ipt"
					v-model.trim="keywordStr"
					placeholder="请输入搜索内容"
					clearable
				></el-input>
			</div>
			<el-button
				type="primary"
				icon="el-icon-search"
				@click="pageClick(1)"
				>搜索</el-button
			>
			<el-button type="danger" @click="addInfo">添加内容</el-button>
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
				prop="ContentDesc"
				label="描述"
				align="center"
			></el-table-column>
			<el-table-column
				prop="CreatorName"
				label="圈主"
				align="center"
				width="150"
			></el-table-column>
			<el-table-column
				prop="ShareCount"
				label="转发量"
				align="center"
				width="80"
			></el-table-column>
			<el-table-column
				prop="PublishDate"
				label="更新时间"
				align="center"
				width="150"
			></el-table-column>
			<el-table-column label="置顶" align="center" width="100">
				<template slot-scope="scope">
					<el-switch
						@change="isTopChange(scope.row)"
						v-model="scope.row.IsTop"
						active-color="#ff4949"
					></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="发布" align="center" width="100">
				<template slot-scope="scope">
					<el-switch
						@change="isShowChange(scope.row)"
						v-model="scope.row.IsPublish"
						active-color="#13ce66"
					></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="150">
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
			:page-size="pageSize"
			@current-change="pageClick"
			@prev-click="pageClick"
			@next-click="pageClick"
		></el-pagination>
		<addInfoDig
			v-if="isShowDig"
			:formDig="formDig"
			:isShowDig.sync="isShowDig"
			:momentList="momentList"
			@edit-moments="editMoments"
		></addInfoDig>
	</div>
</template>
<script>
	import addInfoDig from "./addInfoDig";
	export default {
		name: "infoList",
		props: {},
		components: { addInfoDig },
		data() {
			return {
				tabLoad: true, //列表加载状态
				tabData: [], //列表数据
				formDig: {
					titleDig: "添加内容",
				},
				momentList: [], //圈主名称列表
				isShowDig: false, //是否显示添加/修改信息弹框
				pageIndex: 1, //页码
				pageSize: 20, //条数
				totalNum: 0, //总数量

				dateArr: [], //日期数组
				momId: "", //当前选择的圈主ID
				keywordStr: "", //关键词搜索
			};
		},
		created() {
			this.getInfoList();
			this.getUserList(); //获取圈主名称列表
		},
		computed: {},
		watch: {},
		mounted() {},
		filters: {},
		activated() {},
		deactivated() {},
		methods: {
			//翻页点击事件
			pageClick(idx = 1) {
				this.pageIndex = idx;
				this.getInfoList();
			},
			//获取圈主列表
			getInfoList() {
				let beginDate = "";
				let endDate = "";
				if (this.dateArr.length > 1) {
					beginDate = this.dateArr[0] + " 00:00:00";
					endDate = this.dateArr[1] + " 23:59:59";
				}
				let par = {
					PagingInfo: {
						CurrentPage: this.pageIndex,
						PageSize: this.pageSize,
					},
					CreateDateBegin: beginDate,
					CreateDateEnd: endDate,
					MomentsCreatorId: this.momId || "",
					ContentDesc: this.keywordStr || "",
				};
				this.$store
					.dispatch("wxMoments/GetInfoList", par)
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
			//获取圈主下拉列表
			getUserList() {
				this.$store
					.dispatch("wxMoments/GetUserMomentsAll")
					.then((res) => {
						let data = res.Data || [];
						if (res.State == 0 && data.length > 0) {
							this.momentList = data;
						} else {
							this.$message.error("暂无圈主，请先添加圈主！！！");
						}
					})
					.catch((err) => {
						this.$message.error("暂无圈主，请先添加圈主！！！");
						console.error(err);
					});
			},
			//添加内容
			addInfo() {
				if (this.momentList.length <= 0) {
					this.$message.error("暂无圈主，请先添加圈主！！！");
					return false;
				}
				this.formDig = {
					titleDig: "添加内容",
					cId: "",
				};
				this.isShowDig = true;
			},
			//编辑内容
			editInfo(item) {
				this.formDig = {
					titleDig: "内容修改",
					cId: item.MomentsContentId,
				};
				this.isShowDig = true;
			},
			//添加、编辑完成后回调事件
			editMoments() {
				this.tabLoad = true;
				this.pageIndex = 1;
				this.getInfoList();
				this.isShowDig = false;
			},
			//是否置顶  打开、关闭显示状态
			isTopChange(item = null) {
				if (!item) return false;
				let par = {
					momentsContentId: item.MomentsContentId,
					isTop: item.IsTop,
				};
				this.$store
					.dispatch("wxMoments/UpdateIsTop", par)
					.then((res) => {
						this.$message({
							message: "置顶操作成功",
							type: "success",
						});
					})
					.catch((err) => {
						item.IsTop = !item.IsTop;
						this.$message.error(err.ErrorMessage || "置顶操作失败");
						console.error(err);
					});
			},
			//是否显示
			isShowChange(item) {
				if (!item) return false;
				let par = {
					momentsContentId: item.MomentsContentId,
					isPublish: item.IsPublish,
				};
				this.$store
					.dispatch("wxMoments/UpdateIsPublish", par)
					.then((res) => {
						this.$message({
							message: "发布操作成功",
							type: "success",
						});
					})
					.catch((err) => {
						item.IsPublish = !item.IsPublish;
						this.$message.error(err.ErrorMessage || "发布操作失败");
						console.error(err);
					});
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
			justify-content: flex-start;
			padding: 0 15px 0 0;
			font-size: 14px;
			& > .search_item_box {
				// flex-grow: 1;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				overflow: hidden;
				margin-right: 20px;
				& > label {
					flex-shrink: 0;
					padding-right: 5px;
				}
				& /deep/ .el-range-separator {
					width: 1.2em;
					padding: 0;
					text-align: center;
				}
				.date_ipt {
					flex-shrink: 0;
					width: 220px;
					margin-right: 15px;
				}
				.select_ipt {
					flex-shrink: 0;
					width: 150px;
					margin-right: 15px;
				}
				.keyword_ipt {
					flex-shrink: 0;
					width: 150px;
				}
			}
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
					padding: 6px 0;
				}
				.cell {
					line-height: 1.6;
					.txtOverflow2();
				}
			}
		}
		& /deep/ .page_temp_css {
			text-align: center;
			padding-top: 15px;
		}
	}
</style>
