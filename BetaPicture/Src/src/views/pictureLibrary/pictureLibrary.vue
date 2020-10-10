<template>
	<div class="PictureLibrary">
		<!-- <el-button type="primary" @click="selectImgOpen">选择图片</el-button>
		<selectImg :dialogImg="dialogImg" @GetFileId="GetFileId" @handleClose="handleClose"></selectImg>-->
		<!-- 添加分类 -->
		<el-dialog title="添加分类" :visible.sync="dialogFormAddType" width="30%">
			<el-col :span="24">
				<el-input v-model="addTypeInput" maxlength="6" show-word-limit></el-input>
			</el-col>
			<div slot="footer" style="margin-top:20px;text-align:center">
				<el-button type="primary" @click="sureCategory">确 定</el-button>
			</div>
		</el-dialog>
		<el-form ref="form" :model="form" label-width="80px">
			<el-form-item label="搜索标签">
				<el-col :span="6">
					<el-input v-model="form.Tags" placeholder="请输入标签关键字">
						<el-button slot="append" icon="el-icon-search" @click="goSearch"></el-button>
					</el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="搜索来源">
				<el-col :span="6">
					<el-input v-model="form.Source" placeholder="请输入图片来源">
						<el-button slot="append" icon="el-icon-search" @click="goSearch"></el-button>
					</el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="图片名称">
				<el-col :span="6">
					<el-input v-model="form.KeyWord" placeholder="请输入图片名称">
						<el-button slot="append" icon="el-icon-search" @click="goSearch"></el-button>
					</el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="时间选择">
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
			</el-form-item>
			<el-form-item label="图片分类">
				<el-button
					v-for="(item, index) in  CategoryArr"
					:key="index + 'arr'"
					:type="item.primary ? 'primary' : ''"
					@click="editType1(item, index)"
					@dblclick.native="editType2(item)"
				>{{item.Name}}</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="addType()">添加</el-button>
				<el-button type="primary" @click="deleteCategoryId()" v-if="showType">取消分类选择</el-button>
			</el-form-item>
		</el-form>
		<el-dialog :visible.sync="dialogVisibleimg" style="text-align:center" width="900px">
			<img :src="dialogImageUrl" alt />
		</el-dialog>
		<div style="margin-top:20px;">
			<div style="float:right">
				<el-button type="danger" @click="deleteAll">批量删除</el-button>
				<el-button type="primary" @click="addPicture">添加图片</el-button>
				<el-button @click="$refs.fileRef.click()">批量导入</el-button>
				<el-button type="text" @click="downloadTemplate">下载模板</el-button>
			</div>
			<el-table
				style="margin-top:20px"
				ref="multipleTable"
				:data="tableData"
				tooltip-effect="dark"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column label="图片名称" width="120">
					<template slot-scope="scope">{{ scope.row.FileName }}</template>
				</el-table-column>
				<el-table-column prop="Source" label="图片来源" width="120"></el-table-column>
				<el-table-column label="尺寸类型" width="120">
					<template slot-scope="scope">
						<span>{{scope.row.Width}} * {{scope.row.Height}}</span>
					</template>
				</el-table-column>
				<el-table-column label="授权等级" width="120">
					<template slot-scope="scope">
						<span v-if="scope.row.RightLevel == 1">免费版本</span>
						<span v-if="scope.row.RightLevel == 2">收费版本</span>
						<span v-if="scope.row.RightLevel == 3">危险版本</span>
					</template>
				</el-table-column>
				<el-table-column prop="CategoryName" label="图片分类"></el-table-column>
				<el-table-column prop="UseCount" label="使用次数"></el-table-column>
				<el-table-column label="小图">
					<template slot-scope="scope">
						<img :src="scope.row.FileUrl" alt style="width:100px" />
					</template>
				</el-table-column>
				<el-table-column prop="Tags" label="标签"></el-table-column>
				<el-table-column prop="address" label="操作">
					<template slot-scope="scope">
						<el-link type="primary" @click="getImg(scope.row.FileUrl,scope.row.Width)">预览</el-link>
						<el-link type="primary" @click="goEdit(scope.row)" style="margin-left:10px">编辑</el-link>
						<el-link type="primary" @click="goupdowm(scope.row.FileUrl)" style="margin-left:10px">下载</el-link>
						<el-link type="primary" @click="handleDelete(scope.row.Id)" style="margin-left:10px">删除</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div class="block" style="text-align:center;margin-top:10px;">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="CurrentPage"
					:page-size="10"
					layout="total, prev, pager, next, jumper"
					:total="total"
				></el-pagination>
			</div>
		</div>
		<el-form ref="fileForm">
			<input
				type="file"
				style="display:none;"
				ref="fileRef"
				@change="bulkImport($event)"
				accept=".xlsx, .xls"
			/>
		</el-form>
	</div>
</template>
<script>
	// import infoUpload from "./component/infoUpload";
	// import selectImg from "./component/selectImg";
	// import { webselectImg } from "betapcui";
	import { changeTimeNoMinutes } from "../../libs/util";
	import bsdk from "beta-jsdk";
	export default {
		name: "login",
		props: {},
		components: {
			// infoUpload,
			// selectImg,
		},
		data() {
			return {
				showType: false,
				dialogWidth: "",
				dialogImg: false,
				DeleteId: [],
				dialogImageUrl: "",
				dialogVisibleimg: false,
				total: 0,
				CurrentPage: 1,
				PageSize: 10,
				fileList: [], //图片
				addEditTitle: "",
				dialogFormAddType: false,
				addTypeInput: "",
				form: {
					Tags: "",
					Source: "",
					KeyWord: "",
					CategoryId: "",
					datePickerVal: ["", ""], //日期选择器
				},
				tableData: [],
				CategoryArr: [],
				multipleSelection: [],
				CategoryId: "",
				rules: {
					CategoryId: [{ required: true, message: "请选择图片分类", trigger: "change" }],
					FileId: [{ required: true, message: "请上传图片", trigger: "blur" }],
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
		inject: [],
		created() {
			bsdk.config({
				//服务器列表
				servers: process.env.SERVERS_ENV,
			});
		},
		computed: {},
		watch: {},
		mounted() {
			this.GetFileLibraryList();
			this.GetCategoryList();
		},
		filters: {},
		activated() {},
		deactivated() {},
		methods: {
			GetFileId(fileid) {
				this.dialogImg = false;
				console.log(fileid, "fileid");
			},
			handleClose() {
				this.dialogImg = false;
			},
			selectImgOpen() {
				this.dialogImg = true;
			},
			deleteAll() {
				if (this.multipleSelection.length >= 1) {
					this.$confirm("此操作将永久删除这些图片, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
						.then(() => {
							this.DeleteId = [];
							for (let i = 0; i < this.multipleSelection.length; i++) {
								this.DeleteId.push(this.multipleSelection[i].Id);
							}
							this.deleteAllID();
						})
						.catch(() => {});
				} else {
					this.$message.error("请先选择至少一条要删除的数据");
				}
			},
			goupdowm(url) {
				window.open(url);
			},
			getImg(url, Width) {
				this.dialogImageUrl = url;
				this.dialogWidth = Width + 40 + "px";
				this.dialogVisibleimg = true;
			},
			handleDelete(id) {
				this.$confirm("此操作将永久删除该图片, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						this.DeleteId = [];
						this.DeleteId.push(id);
						this.deleteAllID();
					})
					.catch(() => {});
			},
			deleteAllID() {
				this.$store
					.dispatch("pictureLibrary/DelFileLibraryInfoById", this.DeleteId)
					.then(res => {
						if (res.State == 0) {
							this.$message({
								type: "success",
								message: "删除成功!",
							});
							this.GetFileLibraryList();
						}
					})
					.catch(error => {
						console.log(error);
					});
			},

			addType() {
				this.addTypeInput = "";
				this.CategoryId = "";
				this.dialogFormAddType = true;
			},

			editType1(item, index) {
				this.CurrentPage = 1;
				this.showType = true;
				this.form.CategoryId = item.CategoryId;
				this.GetFileLibraryList();
				for (let i = 0; i < this.CategoryArr.length; i++) {
					if (i == index) {
						this.CategoryArr[i].primary = true;
					} else {
						this.CategoryArr[i].primary = false;
					}
				}
			},
			editType2(item) {
				this.dialogFormAddType = true;
				this.addTypeInput = item.Name;
				this.CategoryId = item.CategoryId;
			},
			sureCategory() {
				if (this.addTypeInput) {
					this.dialogFormAddType = false;
					this.form.CategoryId = "";
					this.GetFileLibraryList();
					this.AddOrUpdCategoryInfo();
				} else {
					this.$message.error("分类信息不可以为空");
				}
			},
			AddOrUpdCategoryInfo() {
				let par = {
					Name: this.addTypeInput,
					CategoryId: this.CategoryId,
				};

				this.$store
					.dispatch("pictureLibrary/AddOrUpdCategoryInfo", par)
					.then(res => {
						if (res.State == 0) {
							this.$message.success("添加成功");
							this.GetCategoryList();
						}
					})
					.catch(error => {
						console.log(error);
					});
			},
			GetCategoryList() {
				this.$store
					.dispatch("pictureLibrary/GetCategoryList")
					.then(res => {
						if (res.State == 0) {
							this.CategoryArr = res.Data;
						}
					})
					.catch(error => {
						console.log(error);
					});
			},
			deleteCategoryId() {
				this.showType = false;
				for (let i = 0; i < this.CategoryArr.length; i++) {
					this.CategoryArr[i].primary = false;
				}
				this.$message.success("取消成功");
				this.form.CategoryId = "";
				this.CurrentPage = 1;
				this.GetFileLibraryList();
			},
			changeDate() {
				if (this.form.datePickerVal == null) {
					this.form.datePickerVal = ["", ""];
				} else {
					if (this.form.datePickerVal) {
						this.form.datePickerVal[0] = changeTimeNoMinutes(this.form.datePickerVal[0]) + " 00:00:00";
						this.form.datePickerVal[1] = changeTimeNoMinutes(this.form.datePickerVal[1]) + " 23:59:59";
					}
				}
				this.CurrentPage = 1;
				this.GetFileLibraryList();
			},
			goSearch() {
				this.CurrentPage = 1;
				this.GetFileLibraryList();
			},
			GetFileLibraryList() {
				if (this.form.datePickerVal == null) {
					this.form.datePickerVal = ["", ""];
				}
				let par = {
					KeyWord: this.form.KeyWord,
					CategoryId: this.form.CategoryId,
					Tags: this.form.Tags,
					Source: this.form.Source,
					BeginTime: this.form.datePickerVal[0],
					EndTime: this.form.datePickerVal[1],
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
			addPicture() {
				this.$router.push({
					path: `/addEditPictureLibrary`,
				});
			},
			bulkImport(event) {
				let file = this.$refs.fileRef.files[0];
				let formData = new FormData();
				formData.append("file", file);
				formData.append("chunk", "0");
				let config = {
					headers: { "Content-Type": "multipart/form-data" },
				};
				this.$store.dispatch("pictureLibrary/BulkImport", formData, config).then(res => {
					if (res && res.Data) {
						let msg = res.ErrorMessage;
						if (msg) {
							msg = "部分数据导入成功(" + msg + ")";
							this.$message.warning(msg);
						} else {
							msg = "导入成功";
							this.$message.success(msg);
						}
						this.GetFileLibraryList();
						this.GetCategoryList();
					} else {
						this.$message.error("导入失败，分类为空");
					}
					event.target.type = "text";
					event.target.value = "";
					event.target.type = "file";
					event.target.name = "file";
					this.$forceUpdate();
				});
			},
			downloadTemplate() {
				let userAgent = navigator.userAgent;
				if (userAgent.indexOf("Firefox") > -1 || userAgent.indexOf("Chrome") > -1) {
					const aLink = document.createElement("a");
					aLink.download = "图片库批量导入模板.xlsx";
					aLink.target = "_blank";
					aLink.href = `${process.env.VUE_APP_BetaHomeWebAPI}/Beta.HomeWebAPI/api/FileLibrary/FileDownload`;
					aLink.dispatchEvent(new MouseEvent("click", {}));
				} else {
					window.location.href = `${process.env.VUE_APP_BetaHomeWebAPI}/Beta.HomeWebAPI/api/FileLibrary/FileDownload`;
				}
			},
			goEdit(item) {
				this.$router.push({
					path: `/addEditPictureLibrary?Id=${item.Id}`,
				});
			},
			toggleSelection(rows) {
				if (rows) {
					rows.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
					});
				} else {
					this.$refs.multipleTable.clearSelection();
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleSizeChange(val) {
				this.PageSize = val;
				this.GetFileLibraryList();
			},
			handleCurrentChange(val) {
				this.CurrentPage = val;
				this.GetFileLibraryList();
			},
		},
	};
</script>
<style lang="less">
	.PictureLibrary {
		position: relative;
		margin: 30px;
		.el-button {
			margin-bottom: 10px;
		}
	}
</style>
