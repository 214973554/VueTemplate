<template>
	<el-dialog
		:title="formDig.titleDig"
		:visible.sync="isShowDig"
		destroy-on-close
		:close-on-click-modal="false"
		:before-close="closeDig"
		width="500px"
	>
		<el-form
			ref="form"
			:model="info"
			label-width="70px"
			class="form_dig_css"
		>
			<el-form-item label="名称" required>
				<el-input
					v-model.trim="info.CreatorName"
					maxlength="8"
					placeholder="请输入名称"
					show-word-limit
				></el-input>
			</el-form-item>
			<el-form-item label="头像" required>
				<el-upload
					list-type="picture-card"
					accept=".jpg, .jpeg, .png"
					action="string"
					:show-file-list="false"
					:http-request="uploadFiles"
					:before-upload="handleBefore"
				>
					<img
						:src="info.CreatorPhoto"
						@error="imgError"
						alt
						v-if="info.CreatorPhoto"
						class="user_pic"
					/>
					<i class="el-icon-plus" v-else></i>
					<div slot="tip" class="el-upload__tip">
						只能上传jpg/png文件，最大5M，图片建议尺寸200*200
					</div>
				</el-upload>
			</el-form-item>
			<el-form-item label="简介" required>
				<el-input
					type="textarea"
					placeholder="请输入简介"
					v-model.trim="info.CreatorDesc"
					resize="none"
					:rows="4"
					maxlength="100"
					show-word-limit
				/>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="closeDig">取 消</el-button>
			<el-button type="primary" @click="sureDig">确 定</el-button>
		</span>
		<cropperImg
			v-if="isShopCrop"
			@close-crop="closeCrop"
			@finish-crop="finishCrop"
			:imgSrc="userPicBase64"
		></cropperImg>
	</el-dialog>
</template>
<script>
	// 添加修改圈主信息
	import cropperImg from "_c/cropperImg"; //图片裁剪
	export default {
		name: "addUserDig",
		props: {
			isShowDig: {
				type: Boolean,
				default: false,
			},
			formDig: {
				type: Object,
				required: true,
			},
		},
		components: { cropperImg },
		data() {
			return {
				info: null,

				isShopCrop: false, //是否显示裁剪框
				userPicBase64: "", //裁剪前头像base64
				imgData: "", //裁剪后头像base64
			};
		},
		created() {
			let obj = this.formDig.info;
			if (obj) {
				this.info = { ...this.formDig.info };
			} else {
				this.info = {
					MomentsCreatorId: "",
					CreatorName: "",
					CreatorDesc: "",
					CreatorPhoto: "",
				};
			}
		},
		computed: {},
		watch: {},
		mounted() {},
		filters: {},
		activated() {},
		deactivated() {},
		methods: {
			//关闭弹框
			closeDig() {
				this.$emit("update:isShowDig", false);
			},
			// 确定弹框按钮事件
			sureDig() {
				if (this.info.CreatorPhoto.length <= 0) {
					this.$message.error("头像上传失败");
				} else if (this.info.CreatorName.length <= 0) {
					this.$message.error("请填写入名称");
				} else if (this.info.CreatorDesc.length <= 0) {
					this.$message.error("请填写简介");
				} else {
					this.addUserInfo();
				}
			},
			//上传文件之前
			handleBefore(file) {
				const isLt5M = file.size / 1024 / 1024 < 5;
				if (!isLt5M) {
					this.$message.error("图片大小不能超过5MB!");
				}
				return isLt5M;
			},
			//上传图片请求
			uploadFiles(par) {
				let _this = this;
				let file = par.file;
				let reader = new FileReader(); // 这里使用FileReader() 来得到图片地址
				reader.readAsDataURL(file);
				reader.onload = (e) => {
					_this.userPicBase64 = e.target.result;
					_this.isShopCrop = true;
				};
			},
			//关闭裁剪框
			closeCrop() {
				this.isShopCrop = false;
			},
			//完成截图
			finishCrop(res) {
				// this.info.CreatorPhoto = res.base64;
				this.imgData = res.base64;
				let par = {
					files: res.blob,
				};
				debugger;
				this.$store
					.dispatch("publicApi/PostImg", par)
					.then((res) => {
						let data = res.Data || [];
						if (data.length > 0) {
							this.$message({
								message: "头像上传成功",
								type: "success",
							});
							this.info.CreatorPhoto = data[0].Result.remoteUrl || "";
						} else {
							this.$message.error("头像上传失败");
						}
						this.isShopCrop = false;
					})
					.catch((error) => {
						this.isShopCrop = false;
						this.$message.error("头像上传失败");
						console.error(error);
					});
			},
			//添加圈主信息
			addUserInfo() {
				let par = {
					CreatorName: this.info.CreatorName,
					CreatorPhoto: this.info.CreatorPhoto,
					CreatorDesc: this.info.CreatorDesc,
					MomentsCreatorId: this.info.MomentsCreatorId || "",
				};
				this.$store
					.dispatch("wxMoments/EditMomentInfo", par)
					.then((res) => {
						this.$message({
							message: "保存成功",
							type: "success",
						});
						this.$emit("edit-moments", false);
					})
					.catch((error) => {
						let errMsg = error.ErrorMessage || "";
						if (errMsg.indexOf("已存在") > -1) {
							this.$message.error("圈主名称 " + errMsg);
						} else {
							this.$message.error("保存圈主信息失败！");
						}
					});
			},
			//图片加载失败后处理
			imgError(e) {
				if (this.imgData) {
					e.target.src = this.imgData;
				}
			},
		},
	};
</script>
<style lang="less" scoped>
	.form_dig_css {
		& /deep/ .el-form-item {
			padding-right: 15px;
		}
		& /deep/ .el-upload--picture-card {
			width: 120px;
			height: 120px;
			position: relative;
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			.user_pic {
				width: 100%;
				height: 100%;
			}
		}
		& /deep/ .el-input__count {
			line-height: 1.2;
			right: 2px;
		}
	}
</style>
