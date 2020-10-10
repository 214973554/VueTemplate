<template>
	<el-dialog
		:title="formDig.titleDig"
		:visible.sync="isShowDig"
		destroy-on-close
		:close-on-click-modal="false"
		:before-close="closeDig"
		width="600px"
		top="7vh"
		class="add_info_dig_main"
	>
		<el-form
			ref="form"
			:model="info"
			label-width="85px"
			class="form_dig_css"
			v-if="info"
		>
			<el-form-item label="圈主" required>
				<el-select
					v-model="info.MomentsCreatorId"
					placeholder="请选择圈主"
				>
					<el-option
						v-for="item in userList"
						:key="'mk' + item.MomentsCreatorId"
						:label="item.CreatorName"
						:value="item.MomentsCreatorId"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="描述" required>
				<el-input
					type="textarea"
					placeholder="请输入描述内容"
					v-model.trim="info.ContentDesc"
					resize="none"
					:rows="4"
					maxlength="300"
					show-word-limit
				/>
			</el-form-item>
			<el-form-item label="图片/视频" required>
				<el-radio-group v-model="info.AttacheType" @change="changeType">
					<el-radio :label="4">无</el-radio>
					<el-radio :label="1">图片</el-radio>
					<el-radio :label="2">视频</el-radio>
					<el-radio :label="3">链接</el-radio>
				</el-radio-group>
				<div class="imgs_list" v-if="info.AttacheType == 1">
					<el-upload
						class="imgsArr_upload"
						action="string"
						accept=".jpg, .jpeg, .png"
						list-type="picture-card"
						:show-file-list="false"
						:auto-upload="true"
						:limit="9"
						:multiple="true"
						:http-request="uploadImgsArr"
						:before-upload="befImgsArr"
						:on-exceed="limitNum_img"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<vuedraggable
						element="ul"
						v-model="imgArrUrl"
						v-bind="dragOptions"
						:sort="true"
						filter=".undraggable"
						class="drag_img_boxs"
						draggable=".dragstyle"
					>
						<li
							v-for="(item, index) in imgArrUrl"
							:key="'imgs' + index"
							class="dragstyle"
							title="可拖动排序"
						>
							<i
								class="dragstyle el-icon-close"
								@click="delImg(index)"
							></i>
							<img
								title="可拖动排序"
								:src="item.AttachUrl"
								alt=""
								@error="imgError"
							/>
						</li>
					</vuedraggable>
				</div>
				<el-upload
					v-if="info.AttacheType == 2"
					class="upload_video_btn"
					accept=".mp4"
					action="string"
					:limit="1"
					:on-exceed="limitNum"
					:before-upload="videoBefore"
					:http-request="uploadVideo"
					:file-list="videoFileList"
				>
					<el-button type="primary">上传视频</el-button>
					<div slot="tip" class="video_tip">
						仅支持MP4格式，且上传时长为15秒以内的视频，不能超过500M
					</div>
				</el-upload>
				<el-input
					class="link_url_ipt"
					v-if="info.AttacheType == 3"
					v-model.trim="linkUrl"
					placeholder="请输入链接地址(支持微信、头条、易企秀、美篇链接)"
					type="textarea"
					resize="none"
					:rows="2"
					show-word-limit
				></el-input>
			</el-form-item>

			<el-form-item
				label="文章标题"
				v-if="info.AttacheType == 3"
				required
			>
				<el-input
					v-model.trim="info.LinkTitle"
					placeholder="请输入文章标题(30个字以内)"
					maxlength="30"
					show-word-limit
				></el-input>
			</el-form-item>
			<el-form-item
				label="封面图"
				v-if="info.AttacheType == 2 || info.AttacheType == 3"
				required
			>
				<el-upload
					list-type="picture-card"
					accept=".jpg, .jpeg, .png"
					action="string"
					:show-file-list="false"
					:http-request="uploadFiles"
					:before-upload="handleBefore"
					class="upload_cover_img"
				>
					<img
						:src="coverImgUrl"
						@error="imgError"
						alt
						v-if="coverImgUrl"
						class="cover_img"
					/>
					<i class="el-icon-plus" v-else></i>
					<div slot="tip" class="img_tip">
						只能上传jpg/png文件，最大5M，图片建议尺寸200*200
					</div>
				</el-upload>
			</el-form-item>
			<el-form-item label="默认发布">
				<el-switch
					v-model="info.IsPublish"
					active-color="#13ce66"
				></el-switch>
			</el-form-item>
			<el-form-item label="置顶">
				<el-switch
					v-model="info.IsTop"
					active-color="#ff4949"
				></el-switch>
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
			:imgSrc="imgData"
		></cropperImg>
	</el-dialog>
</template>
<script>
	// 添加修改内容
	import TcVod from "vod-js-sdk-v6";
	import cropperImg from "_c/cropperImg"; //图片裁剪
	import vuedraggable from "vuedraggable"; //拖拽排序
	export default {
		name: "addInfoDig",
		props: {
			isShowDig: {
				type: Boolean,
				default: false,
			},
			formDig: {
				type: Object,
				required: true,
			},
			momentList: {
				type: Array,
				required: true,
			},
		},
		components: { cropperImg, vuedraggable },
		data() {
			return {
				info: null,
				userList: [], //下拉圈主列表
				updateInfo: null, //编辑时 获取的对象

				uploadTcVod: null, //腾讯云点播对象
				videoImgFiles: "", //视频封面图
				videoFiles: "", //视频文件
				videoFileList: [], //视频文件会写
				videoName: "", //视频文件名称

				isShopCrop: false, //是否显示裁剪框
				imgData: "", //裁剪前/后头像base64
				linkUrl: "", //链接地址
				coverImgUrl: "", //封面图地址  视频  链接

				imgArrUrl: [], //图片  视频   连接 数组地址
				isMsg: true, //是否有超出数量提示
				dragOptions: {
					//拖动参数
					animation: 200,
					ghostClass: "ghost",
				},
			};
		},
		created() {
			this.userList = [...this.momentList];
			this.getContentInfo();
		},
		computed: {},
		watch: {},
		mounted() {
			this.GetSignature(); //获取签名
		},
		filters: {},
		activated() {},
		deactivated() {},
		methods: {
			//获取内容信息
			getContentInfo() {
				let cId = this.formDig.cId || "";
				if (cId.length <= 0) {
					//添加
					this.info = {
						MomentsCreatorId: "", //圈主名称id
						MomentsContentId: "", //内容id
						ContentDesc: "", //描述
						IsPublish: true, //是否发布
						IsTop: false, //是否置顶
						AttacheType: 4, //内容类型  1--图片  2--视频 3--链接 4--纯文本
						VedioCoverUrl: "", //视频封面图
						VedioFileId: "", //视频文件ID
						LinkCoverUrl: "", //链接封面图
						LinkTitle: "", //链接标题
					};
				} else {
					//修改--获取信息
					let par = { momentsContentId: cId };
					this.$store
						.dispatch("wxMoments/GetContentInfo", par)
						.then((res) => {
							let data = res.Data || null;
							if (data) {
								this.updateInfo = data;
								this.setUpdateInfo();
							}
						})
						.catch((err) => {
							this.$message.error(
								err.ErrorMessage || `获取修改信息失败！`
							);
							console.error(err);
						});
				}
			},
			//设置编辑信息
			setUpdateInfo() {
				let data = this.updateInfo || null;
				let cInfo = data?.MomentsContent || null;
				if (cInfo) {
					this.info = {
						MomentsCreatorId: cInfo.MomentsCreatorId, //圈主名称id
						MomentsContentId: cInfo.MomentsContentId, //内容id
						ContentDesc: cInfo.ContentDesc, //描述
						IsPublish: cInfo.IsPublish, //是否发布
						IsTop: cInfo.IsTop, //是否置顶
						AttacheType: cInfo.AttacheType, //内容类型  1--图片  2--视频 3--链接 4--纯文本
						VedioCoverUrl: cInfo.VedioCoverUrl, //视频封面图
						VedioFileId: cInfo.VedioFileId, //视频文件ID
						LinkCoverUrl: cInfo.LinkCoverUrl, //链接封面图
						LinkTitle: cInfo.LinkTitle, //链接标题
					};
				}
				let cArr = data?.MomentsContentAttachs || [];
				if (cArr) {
					if (cInfo.AttacheType == 2) {
						this.coverImgUrl = cInfo.VedioCoverUrl || ""; //封面图地址  视频  链接
						this.videoFileList = [
							{
								name: cArr[0].MomentsContentAttachId + ".mp4",
								url: cArr[0].AttachUrl,
							},
						];
					} else if (cInfo.AttacheType == 3) {
						this.linkUrl = cArr[0].AttachUrl || ""; //链接地址
						this.coverImgUrl = cInfo.LinkCoverUrl || ""; //封面图地址  视频  链接
					}
					this.imgArrUrl.push(...cArr);
				}
			},

			//类型切换事件
			changeType(val) {
				this.info.VedioCoverUrl = ""; //视频封面图
				this.info.VedioFileId = ""; //视频文件ID
				this.info.LinkCoverUrl = ""; //链接封面图
				this.info.LinkTitle = ""; //链接标题
				this.coverImgUrl = ""; //封面图
				this.linkUrl = ""; //连接地址
				this.imgArrUrl = []; //图片  视频  连接对象地址

				this.videoImgFiles = ""; //视频封面图
				this.videoFiles = ""; //视频文件
				this.videoFileList = []; //视频文件会写
				let updateInfoType =
					this.updateInfo?.MomentsContent?.AttacheType || ""; //修改对象的类型
				if (updateInfoType == val) this.setUpdateInfo();
			},
			//删除图片
			delImg(index) {
				this.imgArrUrl.splice(index, 1);
				console.log(this.imgArrUrl);
			},
			//弹窗关闭事件
			closeDig() {
				this.$emit("update:isShowDig", false);
			},
			//弹框确定事件
			sureDig() {
				console.log(this.imgArrUrl);
				console.log(this.info);
				if (this.checkFrom()) return false;
				let par = {
					MomentsContent: {
						MomentsCreatorId: this.info.MomentsCreatorId, //圈主名称id
						MomentsContentId: this.info.MomentsContentId, //内容id -- 编辑是不为空
						ContentDesc: this.info.ContentDesc, //描述
						IsPublish: this.info.IsPublish, //是否发布
						IsTop: this.info.IsTop, //是否置顶
						AttacheType: this.info.AttacheType, //内容类型  1--图片  2--视频 3--链接 4--纯文本
						VedioCoverUrl: this.info.VedioCoverUrl, //视频封面图
						VedioFileId: this.info.VedioFileId, //视频文件ID
						LinkCoverUrl: this.info.LinkCoverUrl, //链接封面图
						LinkTitle: this.info.LinkTitle, //链接标题
					},
					MomentsContentAttachs: [...this.imgArrUrl],
				};
				this.$store
					.dispatch("wxMoments/SaveMomentsInfo", par)
					.then((res) => {
						this.$message({
							message: "内容保存成功",
							type: "success",
						});
						this.$emit("edit-moments");
					})
					.catch((err) => {
						this.$message.error(err.ErrorMessage || `信息保存失败`);
						console.error(err);
					});
			},
			//表单验证拦截
			checkFrom() {
				if (!this.info.MomentsCreatorId) {
					this.$message.error(`请选择圈主`);
				} else if (this.info.ContentDesc.length <= 0) {
					this.$message.error(`请输入描述内容`);
				} else if (this.info.AttacheType == 4) {
					this.info.VedioCoverUrl = ""; //视频封面图
					this.info.VedioFileId = ""; //视频文件ID
					this.info.LinkCoverUrl = ""; //链接封面图
					this.info.LinkTitle = ""; //链接标题
					this.imgArrUrl = [];
					return false;
				} else if (this.info.AttacheType == 1) {
					this.info.VedioCoverUrl = ""; //视频封面图
					this.info.VedioFileId = ""; //视频文件ID
					this.info.LinkCoverUrl = ""; //链接封面图
					this.info.LinkTitle = ""; //链接标题
					if (this.imgArrUrl.length <= 0)
						this.$message.error(`请上传图片`);
					else {
						return false;
					}
				} else if (this.info.AttacheType == 2) {
					this.info.LinkCoverUrl = ""; //链接封面图
					this.info.LinkTitle = ""; //链接标题
					if (this.imgArrUrl.length <= 0) {
						this.$message.error(`请上传视频`);
					} else if (this.coverImgUrl.length <= 0) {
						this.$message.error(`请上传视频封面图`);
					} else {
						return false;
					}
				} else if (this.info.AttacheType == 3) {
					this.info.VedioCoverUrl = ""; //视频封面图
					this.info.VedioFileId = ""; //视频文件ID

					let reg = /^(https:\/\/|http:\/\/)/;
					if (this.linkUrl.length <= 0) {
						this.$message.error(`请输入连接地址`);
					} else if (!reg.test(this.linkUrl)) {
						this.$message.error(`请输入正确的链接地址`);
					} else if (this.coverImgUrl.length <= 0) {
						this.$message.error(`请上传封面图`);
					} else {
						this.imgArrUrl.push({ AttachUrl: this.linkUrl });
						return false;
					}
				} else return false;
				return true;
			},
			/** 上传9宫格图片列表 begin*/
			befImgsArr() {
				if (this.imgArrUrl.length >= 9) {
					if (this.isMsg) {
						this.isMsg = false;
						this.$message.error(`最多仅可上传9张图片`);
						setTimeout(() => {
							this.isMsg = true;
						}, 1500);
					}
					return false;
				}
				return true;
			},
			limitNum_img(files, fileList) {
				let fArr = Object.values(files);
				fArr.map((item) => {
					this.uploadImgsArr({ file: item });
				});
			},
			uploadImgsArr(par) {
				if (this.imgArrUrl.length >= 9) {
					this.$message.error(`最多仅可上传9张图片`);
					return false;
				}
				let file = par.file;
				this.uploadImgsToServer(file, file.name);
			},
			//上传到服务器
			uploadImgsToServer(file, fName) {
				//上传图片
				this.$store
					.dispatch("publicApi/PostImg", { files: file })
					.then((res) => {
						let data = res.Data || [];
						if (
							data.length > 0 &&
							data[0].Result.remoteUrl?.length > 0
						) {
							if (this.imgArrUrl.length < 9) {
								let imgUrl = data[0].Result.remoteUrl || "";
								if (imgUrl.length > 0)
									this.imgArrUrl.push({
										AttachUrl: imgUrl,
									});
							} else {
								this.$message.error(`最多仅可上传9张图片`);
							}
						} else {
							this.$message.error(`${fName}图片上传失败`);
						}
					})
					.catch((error) => {
						this.$message.error(`${fName}图片上传失败`);
						console.error(error);
					});
			},
			/** 上传9宫格图片列表 end*/

			/**上传视频 begin */
			limitNum() {
				this.$message.error("您已上传了一支视频");
			},
			videoBefore(file) {
				const is500M = file.size / 1024 / 1024 <= 500;
				if (!is500M) {
					this.$message.error(
						"视频时长仅限15秒以内，且大小不能超过500M！"
					);
				}
				return is500M;
			},
			//获取云点播签名
			GetSignature() {
				this.$store
					.dispatch("wxMoments/GetSignature")
					.then((res) => {
						let signStr = res.Data || "";
						this.uploadTcVod = new TcVod({
							getSignature: () => {
								return signStr;
							},
						});
					})
					.catch((err) => {
						console.error(err);
					});
			},
			uploadVideo(files) {
				this.videoFiles = files.file; //视频文件
				this.videoName = files.name;
				this.uploadVideoFile();
			},
			//上传视频  封面到腾讯点播
			uploadVideoFile() {
				if (!this.uploadTcVod) {
					this.$message.error("视频和封面图上传失败！");
					return false;
				} else if (this.videoImgFiles && this.videoFiles) {
					this.isShopCrop = false;
					this.isLoadFile = true; //正在上传文件

					let uploader = this.uploadTcVod.upload({
						mediaFile: this.videoFiles, // 媒体文件（视频或音频或图片），类型为 File
						coverFile: this.videoImgFiles, //视频封面 类型为 File
						mediaName: this.videoName,
					});
					uploader.done().then((res) => {
						this.info.VedioFileId = res.fileId || "";
						this.info.VedioCoverUrl = res.cover.url || "";
						this.coverImgUrl = res.cover.url;
						let vUrl = res.video.url || "";
						if (vUrl.length > 0) {
							this.imgArrUrl.push({ AttachUrl: vUrl });
						}
						this.isLoadFile = false; //正在上传文件 结束
					});
				}
			},
			/**上传视频 end */
			/**上传封面图 begin */
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
				let file = par.file;
				let reader = new FileReader(); // 这里使用FileReader() 来得到图片地址
				reader.readAsDataURL(file);
				reader.onload = (e) => {
					this.imgData = e.target.result;
					this.isShopCrop = true; //显示截图框
				};
			},

			//关闭裁剪框
			closeCrop() {
				this.isShopCrop = false;
			},
			//封面图完成截图 后上传图片
			finishCrop(obj) {
				if (this.info.AttacheType == 2) {
					//视频的封面图
					let arr = obj.base64.split(","),
						mime = arr[0].match(/:(.*?);/)[1],
						bstr = atob(arr[1]),
						n = bstr.length,
						u8arr = new Uint8Array(n);
					while (n--) {
						u8arr[n] = bstr.charCodeAt(n);
					}
					let fName = "coverImg." + mime.split("/")[1];
					let file = new File([u8arr], fName, { type: mime });

					this.videoImgFiles = file;
					console.log(this.videoImgFiles, "this.videoImgFiles");
					console.log(this.videoFiles, "this.videoFiles");
					this.uploadVideoFile();
					if (!this.videoFiles) {
						this.isShopCrop = false;
						this.coverImgUrl = obj.base64;
					}
					return false;
				}
				//上传连接封面
				this.$store
					.dispatch("publicApi/PostImg", {
						files: obj.blob,
					})
					.then((res) => {
						let data = res.Data || [];
						if (data.length > 0) {
							let linkImg = data[0].Result?.remoteUrl || "";
							if (linkImg) {
								this.info.LinkCoverUrl = linkImg;
								this.coverImgUrl = linkImg;
							}
						} else {
							this.$message.error("封面图上传失败");
						}
						this.isShopCrop = false;
					})
					.catch((error) => {
						this.isShopCrop = false;
						this.$message.error("封面图上传失败");
						console.error(error);
					});
			},
			//图片加载失败后处理
			imgError(e) {
				e.target.src = e.target.src;
			},
			/**上传封面图 end */
		},
	};
</script>
<style lang="less" scoped>
	.add_info_dig_main {
		& /deep/ .el-dialog {
			margin-bottom: 25px;
		}
	}
	.form_dig_css {
		max-height: 650px;
		overflow-y: auto;
		& /deep/ .el-form-item {
			padding-right: 15px;
		}

		& /deep/ .upload_cover_img {
			display: flex;
			align-items: center;
			padding-top: 10px;
			.el-upload--picture-card {
				width: 100px;
				height: 100px;
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
			.img_tip {
				padding-left: 10px;
				font-size: 11px;
			}
		}

		& /deep/ .el-input__count {
			line-height: 1.2;
			right: 2px;
		}
		.imgs_list {
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			width: 100%;
			padding-top: 10px;
			// & /deep/ .imgsArr_upload {
			// 	position: relative;
			// 	&::after {
			// 		content: "";
			// 		position: absolute;
			// 		width: 100%;
			// 		left: 0;
			// 		bottom: 0;
			// 	}
			// }
			.drag_img_boxs {
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				flex-wrap: wrap;
				flex-grow: 1;
				padding: 0 0 0 15px;
				width: calc(100% - 100px);
				& > li {
					width: 70px;
					height: 70px;
					border: 1px solid #efefef;
					// overflow: hidden;
					margin: 0 0 6px 6px;
					position: relative;
					cursor: pointer;
					& > img {
						object-fit: cover;
						width: 100%;
						height: 100%;
					}
					& > .el-icon-close {
						position: absolute;
						color: #fff;
						background: rgba(0, 0, 0, 0.6);
						border-radius: 20px;
						font-size: 16px;
						right: -5px;
						top: -5px;
					}
				}
			}
		}
		.upload_video_btn {
			padding: 5px 0 0;
			& /deep/ .el-upload {
				float: left;
			}
			.video_tip {
				font-size: 11px;
				padding-left: 90px;
			}
			& /deep/.el-upload-list {
				width: 95%;
			}
		}
		.link_url_ipt {
			padding: 8px 0 0;
		}
	}
</style>
