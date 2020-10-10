<template>
	<div class="addEditPictureLibrary">
		<div class="title">{{title}}</div>
		<el-form ref="form" :rules="rules" :model="formAddEdit" label-width="80px">
			<el-form-item label="图片名称">
				<el-col :span="6">
					<el-input v-model="formAddEdit.FileName" placeholder="请输入图片名称" maxlength="10" show-word-limit></el-input>
				</el-col>
				<el-col :span="2" style="text-align:right;margin-right:20px;">上传图片</el-col>
				<el-col :span="6">
					<infoUpload
						style="position: absolute;"
						@getfileId="getfileId"
						:imgURL="formAddEdit.FileId"
						ref="infoUpload"
					></infoUpload>
				</el-col>
			</el-form-item>
			<!-- <el-form-item label="上传图片" prop="FileId">
				<el-col :span="8">
					<infoUpload @getfileId="getfileId" :imgURL="formAddEdit.FileId" ref="infoUpload"></infoUpload>
				</el-col>
			</el-form-item>-->
			<el-form-item label="图片分类" prop="CategoryId">
				<el-col :span="6">
					<el-select v-model="formAddEdit.CategoryId" placeholder="请选择图片分类">
						<el-option
							v-for="item in CategoryArr"
							:key="item.CategoryId + 'CategoryArr'"
							:label="item.Name"
							:value="item.CategoryId"
						></el-option>
					</el-select>
				</el-col>
			</el-form-item>
			<el-form-item label="图片来源">
				<el-col :span="6">
					<el-input v-model="formAddEdit.Source" placeholder="请输入图片来源" maxlength="10" show-word-limit></el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="尺寸类型" required>
				<el-col :span="3">
					宽度（px）
					<el-input-number v-model="formAddEdit.Width" :max="800" :min="0" @change="changeWH"></el-input-number>
				</el-col>
				<el-col :span="3">
					高度（px）
					<el-input-number v-model="formAddEdit.Height" :max="1000" :min="0" @change="changeWH"></el-input-number>
				</el-col>
			</el-form-item>
			<el-form-item label="图片授权">
				<el-col :span="6">
					<el-select v-model="formAddEdit.RightLevel" placeholder="请输入图片来源">
						<el-option
							v-for="(item, index) in RightLevel"
							:key="index + 'RightLevel'"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-col>
			</el-form-item>
			<el-form-item label="图片标签">
				<el-col :span="6">
					<el-input v-model="formAddEdit.Tags" placeholder="请输入图片标签" maxlength="20" show-word-limit></el-input>
				</el-col>
			</el-form-item>
		</el-form>

		<div slot="footer" style="margin-left:10%">
			<el-button @click="goBack">返 回</el-button>
			<el-button type="primary" @click="submit">确 定</el-button>
		</div>
	</div>
</template>

<script>
	import infoUpload from "./component/infoUpload";
	export default {
		name: "addEditPictureLibrary",
		components: { infoUpload },
		data() {
			return {
				RightLevel: [
					{
						label: "免费版权",
						value: 1,
					},
					{
						label: "收费版权",
						value: 2,
					},
					{
						label: "危险版权",
						value: 3,
					},
				],
				title: "添加图片",
				formAddEdit: {
					FileName: "",
					CategoryId: "",
					Source: "",
					Width: 320,
					Height: 180,
					Tags: "",
					RightLevel: "",
					FileId: "",
				},
				rules: {
					CategoryId: [{ required: true, message: "请选择图片分类", trigger: "change" }],
					FileId: [{ required: true, message: "请上传图片", trigger: "blur" }],
				},
				CategoryArr: [],
			};
		},
		mounted() {
			if (this.$route.query.Id) {
				this.title = "编辑图片";
				this.GetFileLibraryInfoById();
			}
			this.GetCategoryList();
		},
		methods: {
			goBack() {
				window.history.go(-1);
			},
			GetFileLibraryInfoById() {
				let par = {
					id: this.$route.query.Id,
				};
				this.$store
					.dispatch("pictureLibrary/GetFileLibraryInfoById", par)
					.then(res => {
						if (res.State == 0) {
							this.formAddEdit = res.Data;
							this.$refs.infoUpload.setWH(this.formAddEdit.Width, this.formAddEdit.Height);
							this.$refs.infoUpload.getWH(this.formAddEdit.Width, this.formAddEdit.Height);
							console.log(this.formAddEdit, "formAddEdit");
						}
					})
					.catch(error => {
						console.log(error);
					});
			},
			changeWH() {
				console.log(this.formAddEdit.Width, this.formAddEdit.Height, "width");
				this.$refs.infoUpload.getWH(this.formAddEdit.Width, this.formAddEdit.Height);
			},

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
			getfileId(FileId) {
				this.formAddEdit.FileId = FileId;
				console.log(this.formAddEdit.FileId, "this.formAddEdit.FileId");
			},
			submit() {
				this.$refs["form"].validate(valid => {
					if (valid) {
						this.AddOrUpdFileLibraryInfo();
						console.log(this.formAddEdit, "formAddEdit");
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			AddOrUpdFileLibraryInfo() {
				let par = {
					FileName: this.formAddEdit.FileName,
					CategoryId: this.formAddEdit.CategoryId,
					Source: this.formAddEdit.Source,
					Width: this.formAddEdit.Width,
					Height: this.formAddEdit.Height,
					Tags: this.formAddEdit.Tags,
					RightLevel: this.formAddEdit.RightLevel,
					FileId: this.formAddEdit.FileId,
				};
				if (this.$route.query.Id) {
					par.Id = this.$route.query.Id;
				}
				this.$store
					.dispatch("pictureLibrary/AddOrUpdFileLibraryInfo", par)
					.then(res => {
						if (res.State == 0) {
							this.$message.success("操作成功");
							setTimeout(() => {
								this.$router.push({
									path: `/pictureLibrary`,
								});
							}, 500);

							// this.dialogAddEditPicture = false;
							// this.GetFileLibraryList();
						}
					})
					.catch(error => {
						console.log(error);
					});
			},
		},
	};
</script>
<style lang="less" scoped>
	.addEditPictureLibrary {
		padding: 50px;
		.title {
			font-size: 22px;
			line-height: 60px;
			font-weight: 700;
		}
	}
</style>
