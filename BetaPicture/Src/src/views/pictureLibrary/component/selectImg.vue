<template>
	<div class="selectImg">
		<el-dialog title="选一选" :visible.sync="MyDialogImg" :before-close="handleClose" width="1100px">
			<el-form ref="form" :model="form" label-width="0">
				<el-form-item>
					<el-col :span="2">搜索标签:</el-col>
					<el-col :span="9">
						<el-input v-model="form.Tags" placeholder="请输入标签关键字">
							<el-button slot="append" icon="el-icon-search" @click="GetFileLibraryList"></el-button>
						</el-input>
					</el-col>
					<el-col :span="2">&nbsp;</el-col>
					<el-col :span="2" style="margin-left:20px">搜索来源:</el-col>
					<el-col :span="9">
						<el-input v-model="form.Source" placeholder="请输入图片来源">
							<el-button slot="append" icon="el-icon-search" @click="GetFileLibraryList"></el-button>
						</el-input>
					</el-col>
				</el-form-item>
				<el-form-item>
					<el-col :span="2">图片名称:</el-col>
					<el-col :span="9">
						<el-input v-model="form.KeyWord" placeholder="请输入图片名称">
							<el-button slot="append" icon="el-icon-search" @click="GetFileLibraryList"></el-button>
						</el-input>
					</el-col>
					<el-col :span="2">&nbsp;</el-col>
					<el-col :span="2" style="margin-left:20px">时间选择:</el-col>
					<el-col :span="9">
						<el-date-picker
							@change="changeDate"
							v-model="form.datePickerVal"
							type="daterange"
							align="right"
							unlink-panels
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:picker-options="pickerOptions"
						></el-date-picker>
					</el-col>
				</el-form-item>

				<el-form-item>
					<el-col :span="2">图片分类:</el-col>
					<el-select v-model="form.CategoryId" @change="changeType" placeholder="请选择图片分类" clearable>
						<el-option
							v-for="item in CategoryArr"
							:key="item.CategoryId + 'CategoryArr'"
							:label="item.Name"
							:value="item.CategoryId"
						></el-option>
					</el-select>
					<el-button type="primary" style="margin-left:20px;" @click="addType">添加图片</el-button>
				</el-form-item>
			</el-form>
			<div style="background:#e8eded">
				<el-card shadow="hover" v-for="(item, index) in tableData" :key="index" class="card">
					<div class="img-info">
						<div class="info-content" @click="changeImg(item.FileId,item.Id)">
							<div class="info">
								<span>图片标签：</span>
								<span>{{item.Tags ? item.Tags : "-"}}</span>
							</div>
							<div class="info" style="top:20px">
								<span>图片来源：</span>
								<span>{{item.Source ? item.Source : "-"}}</span>
							</div>
							<div class="info" style="top:40px">
								<span>使用次数：</span>
								<span>{{item.UseCount ? item.UseCount : "-"}}</span>
							</div>
						</div>

						<img :src="item.FileUrl" alt style="width:200px;" @click="changeImg(item.FileId,item.Id)" />
					</div>

					<ul class="bottom-content">
						<li>
							<span>图片名称：</span>
							<span>{{item.FileName ? item.FileName : "-"}}</span>
						</li>
					</ul>
					<el-link
						type="danger"
						@click="editType(item.Id)"
						style="position:absolute;bottom:10px;right:22px;"
					>编辑</el-link>
				</el-card>
			</div>
			<div class="block" style="text-align:center;margin-top:10px;">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="CurrentPage"
					:page-size="PageSize"
					layout="total, prev, pager, next, jumper"
					:total="total"
				></el-pagination>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props: ["dialogImg"],
		data() {
			return {
				showType: false,
				MyDialogImg: false,
				CategoryArr: [],
				tableData: [],
				CurrentPage: 1,
				PageSize: 8,
				total: 0,
				form: {
					Tags: "",
					Source: "",
					KeyWord: "",
					CategoryId: "",
					datePickerVal: ["", ""], //日期选择器
				},
				pickerOptions: {
					shortcuts: [
						{
							text: "最近一周",
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit("pick", [start, end]);
							},
						},
						{
							text: "最近一个月",
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
								picker.$emit("pick", [start, end]);
							},
						},
						{
							text: "最近三个月",
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
								picker.$emit("pick", [start, end]);
							},
						},
					],
				},
			};
		},
		watch: {
			dialogImg(newdata) {
				this.MyDialogImg = newdata;
			},
		},
		created() {},
		mounted() {
			this.GetFileLibraryList();
			this.GetCategoryList();
		},
		methods: {
			GetCategoryList() {
				this.$store
					.dispatch("pictureLibrary/GetCategoryList")
					.then(res => {
						if (res.State == 0) {
							this.CategoryArr = res.Data;
							console.log(this.CategoryArr, "CategoryArr");
						}
					})
					.catch(error => {
						console.log(error);
					});
			},
			GetFileLibraryList() {
				let par = {
					KeyWord: this.form.KeyWord,
					CategoryId: this.form.CategoryId,
					Tags: this.form.Tags,
					Source: this.form.Source,
					BeginTime: this.form.datePickerVal ? this.form.datePickerVal[0] : "",
					EndTime: this.form.datePickerVal ? this.form.datePickerVal[1] : "",
					PageIndex: this.CurrentPage,
					PageSize: this.PageSize,
					SortColumnName: "CreateTime",
					OrderBy: 1,
				};
				this.$store
					.dispatch("pictureLibrary/GetFileLibraryList", par)
					.then(res => {
						if (res.State == 0) {
							this.tableData = res.Data;
							this.total = res.Page.Records;
						}
					})
					.catch(error => {
						console.log(error);
					});
			},
			UpdFileLibraryUseCountById(Id) {
				let par = {
					Id: Id,
				};
				this.$store
					.dispatch("pictureLibrary/UpdFileLibraryUseCountById", par)
					.then(res => {})
					.catch(error => {
						console.log(error);
					});
			},
			editType(Id) {
				let url = "https://50.test.betawm.com/Beta.HomePC/addEditPictureLibrary?Id=" + Id;
				window.open(url);
			},
			addType() {
				let url = "https://50.test.betawm.com/Beta.HomePC/addEditPictureLibrary";
				window.open(url);
			},
			changeType(index) {
				this.CurrentPage = 1;
				if (index) {
					let item = this.CategoryArr[index - 1];
					console.log(item, "item");
					this.showType = true;
					this.form.CategoryId = item.CategoryId;
					this.GetFileLibraryList();
					for (var i = 0; i < this.CategoryArr.length; i++) {
						if (i == index) {
							this.CategoryArr[i].primary = true;
						} else {
							this.CategoryArr[i].primary = false;
						}
					}
				} else {
					this.form.CategoryId = "";
					this.GetFileLibraryList();
				}
			},
			deleteCategoryId() {
				this.showType = false;
				for (var i = 0; i < this.CategoryArr.length; i++) {
					this.CategoryArr[i].primary = false;
				}
				this.form.CategoryId = "";
				this.GetFileLibraryList();
			},
			changeImg(FileId, Id) {
				this.MyDialogImg = false;
				this.$emit("get-fileId", FileId);
				this.$emit("handle-close", false);
				this.UpdFileLibraryUseCountById(Id);
			},
			handleClose() {
				this.$emit("handle-close", false);
			},

			handleSizeChange(val) {
				this.PageSize = val;
				this.GetFileLibraryList();
			},
			handleCurrentChange(val) {
				this.CurrentPage = val;
				this.GetFileLibraryList();
			},

			changeDate() {
				console.log(this.form.datePickerVal, "datePickerVal");
				if (this.form.datePickerVal == null) {
					this.form.datePickerVal = ["", ""];
				} else {
					if (this.form.datePickerVal) {
						this.form.datePickerVal[0] = this.changeTimeNoMinutes(this.form.datePickerVal[0]) + " 00:00:00";
						this.form.datePickerVal[1] = this.changeTimeNoMinutes(this.form.datePickerVal[1]) + " 23:59:59";
					}
				}

				this.CurrentPage = 1;
				this.GetFileLibraryList();
			},
			changeTimeNoMinutes(value) {
				let d = new Date(value);
				let times = d.getFullYear() + "-" + this.zero(d.getMonth() + 1) + "-" + this.zero(d.getDate());
				return times;
			},
			zero(value) {
				if (value < 10) {
					return "0" + value;
				} else {
					return value;
				}
			},
		},
	};
</script>

<style lang="less">
	.selectImg {
		.el-button + .el-button {
			margin-bottom: 10px;
		}
		.el-input--small .el-input__inner {
			height: 32px;
			line-height: 32px;
		}
		.bottom-content {
			line-height: 30px;
			li {
				max-width: 180px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		.card {
			position: relative;
			display: inline-block;
			width: 240px;
			height: 260px;
			overflow: hidden;
			background: #fff;
			margin-left: 20px;
			margin-top: 30px;
		}
		.img-info {
			width: 200px;
			height: 200px;
			overflow: hidden;
			display: inline-block;
		}
		.info-content {
			width: 200px;
			height: 200px;
			opacity: 1;
			position: absolute;
		}
		.info-content:hover {
			background: url(./mask.png);
		}
		.info-content:hover .info {
			display: inline;
		}
		// .mask {
		// 	width: 200px;
		// 	height: 200px;
		// 	opacity: 0.5;
		// 	position: absolute;
		// 	z-index: 10;
		// }
		.info {
			position: absolute;
			line-height: 30px;
			max-width: 200px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: #fff;
			display: none;
		}
	}
</style>
