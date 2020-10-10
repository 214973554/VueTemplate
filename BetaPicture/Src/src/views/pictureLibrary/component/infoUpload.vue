<template>
	<div class="cropper-component">
		<div class="info-item">
			<div class="btn-box">
				<label class="btn" for="Infouploads">选择图片</label>
				<el-button type="primary" @click="finish('blob')" style="margin-left:20px;" v-if="uploadBtn">
					上传
					<i class="el-icon-upload el-icon--right"></i>
				</el-button>
				<span style="margin-left:10px;line-height: 30px;">
					<!-- <span v-if="poster != 'poster'">建议尺寸175*115</span> -->
				</span>
				<input
					type="file"
					id="Infouploads"
					:value="imgFile"
					style="position:absolute; clip:rect(0 0 0 0);width: 1px;"
					accept="image/png, image/jpeg, image/gif, image/jpg"
					@change="uploadImg($event, 1)"
				/>

				<!-- <input type="button" class="operation-btn" value="+" title="放大" @click="changeScale(1)" />
				<input type="button" class="operation-btn" value="-" title="缩小" @click="changeScale(-1)" />
				<input type="button" class="operation-btn" value="↺" title="左旋转" @click="rotateLeft" />
				<input type="button" class="operation-btn" value="↻" title="右旋转" @click="rotateRight" />
				<input type="button" class="operation-btn" value="↓" title="下载" @click="down('blob')" />-->
			</div>
			<div class="operation-box" v-if="uploadShow">
				<div :class="poster == 'poster' ? 'cropper-poster' : 'cropper'">
					<vueCropper
						ref="cropper"
						:img="option.img"
						:outputSize="option.size"
						:outputType="option.outputType"
						:info="option.info"
						:full="option.full"
						:canMove="option.canMove"
						:canMoveBox="option.canMoveBox"
						:original="option.original"
						:autoCrop="option.autoCrop"
						:autoCropWidth="option.autoCropWidth"
						:autoCropHeight="option.autoCropHeight"
						@realTime="realTime"
						@imgLoad="imgLoad"
						:fixed="false"
						:fixedNumber="numberArr"
						:centerBox="option.centerBox"
						:infoTrue="option.infoTrue"
						:fixedBox="option.fixedBox"
						:enlarge="option.enlarge"
					></vueCropper>
				</div>
			</div>
			<div class="preview-box" v-if="addShow">
				<!-- <div v-if="uploadShow">预览</div> -->
				<!-- <div
					:style="activityViews.div"
					class="preview"
					v-if="activityViews.div && activityViews.div.width != '0px'"
				>
					<img :src="activityViews.url" :style="activityViews.img" />
				</div>-->
				<div class="preview" v-if="!uploadShow">
					<img :src="activityViews.url" :style="infoStyle" v-if="activityViews.url" />
				</div>
			</div>

			<!-- <div class="btn" @click="finish('blob')" style="margin-top:20px;" v-if="uploadBtn">上传图片</div> -->
		</div>
	</div>
</template>

<script>
	import Vue from "vue";
	import bus from "./bus.js";
	//../../node_modules/vue-cropper/src/index
	import VueCropper from "vue-cropper";
	import butil from "beta-util";
	Vue.use(VueCropper);
	//import Api from "@/js/api.js"; //接口url配置文件

	export default {
		name: "activityUpload",
		data() {
			return {
				//剪切图片上传
				IMG: process.env.VUE_APP_IMGApi + "/Beta.FileService/ResDownload.aspx?datatype=stream&fileid=",
				uploadShow: false,
				uploadBtn: false,
				infoStyle: "",
				fileId: "",
				addShow: true,
				crap: false,
				numberArr: [],
				activityViews: {
					url: sessionStorage.getItem("imageUrl") || "",
				},
				Arr1: [71, 16],
				Arr2: [66, 16],

				option: {
					img: "", // 裁剪图片的地址
					info: true, // 裁剪框的大小信息
					outputSize: 1, // 剪切后的图片质量（0.1-1）
					full: false, // 输出原图比例截图 props名full
					outputType: "png", // 裁剪生成额图片的格式
					canMove: true, // 能否拖动图片
					original: false, // 上传图片是否显示原始宽高
					canMoveBox: true, // 能否拖动截图框
					autoCrop: true, // 是否默认生成截图框
					// autoCropWidth: "",
					// autoCropHeight: "",
					autoCropWidth: "",
					autoCropHeight: "",
					fixedBox: true, // 截图框固定大小
					centerBox: false,
					infoTrue: true,
					fixedNumber: [320, 180],
					enlarge: 1,
				},
				fileName: "", // 本机文件地址
				downImg: "#",
				imgFile: "",
				uploadImgRelaPath: "", // 上传后的图片的地址（不带服务器域名）
				isMsgBox: true,
			};
		},
		//props: ["uploadType", "msgVal", "msgImg"],
		props: {
			imgURL: {
				type: String,
				default: "",
			},
			poster: {
				type: String,
				default: "",
			},
		},
		// watch: {
		// 	msgImg: {
		// 		handle(n, o) {
		// 		},
		// 	},
		// },
		watch: {
			imgURL(newData, oldData) {
				console.log(newData, "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
				this.uploadShow = false;
				this.addShow = true;
				this.uploadBtn = false;
				this.activityViews.url = "http:" + this.IMG + newData;
				console.log(this.activityViews, "ggggggg");
			},
			"activityViews.div.width": {
				handler: function(newValue, old) {
					//特别注意，不能用箭头函数，箭头函数，this指向全局
					let v = newValue.split("px")[0];
					// if (Number(v) < 420 && old && old != "0px" && this.isMsgBox) {
					// 	this.isMsgBox = false;
					// 	this.option.autoCropWidth = 420;
					// 	this.option.autoCropHeight = ((420 * this.numberArr[1]) / this.numberArr[0]).toFixed(2);
					// 	this.$refs.cropper.refresh();
					// 	this.$alert("图片建议宽度660px，最底不小于420px").then(() => {
					// 		this.isMsgBox = true;
					// 	});
					// }
				},
				deep: true, //深度监听
			},
		},
		created() {
			this.option.autoCropWidth = 320;
			this.option.autoCropHeight = 180;
			this.numberArr = [1, 1];

			// bus.$on("activityimgURL", msg => {
			//     alert()
			// 	console.log(msg, "acti..........");
			// 	// sessionStorage.setItem("bannerFileId", msg);
			// 	this.uploadShow = false;
			// 	this.addShow = true;
			// 	this.activityViews.url = "http:" + this.IMG + msg;

			// 	console.log(this.activityViews.url, "rrrrrrrrrrrrr");
			// });
			// if (JSON.parse(sessionStorage.getItem("ImgObj")).width == "710") {
			// 	this.numberArr = [71, 16];
			// } else {
			// 	this.numberArr = [66, 16];
			// }
			this.activityViews.url = sessionStorage.getItem("imageUrl");

			// document.getElementById("cropperD").style.height = JSON.parse(sessionStorage.getItem("ImgObj")).height;
			// document.getElementById("cropperD").style.height = JSON.parse(sessionStorage.getItem("ImgObj")).height;

			// if (this.msgVal == 1) {
			// 	this.activityViews = {};
			// }
			// bus.$on("USImgFileId", msg => {
			// 	console.log(msg, "iuuuuu");
			// 	this.activityViews.url = msg;
			// });
			if (sessionStorage.getItem("activityFileId")) {
				this.activityViews.url = "http:" + this.IMG + sessionStorage.getItem("activityFileId");
				console.log(this.activityViews.url, "lll");
			} else {
				this.activityViews.url = sessionStorage.getItem("imageUrl");
			}
			if (this.activityViews.url != "") {
				this.uploadShow = false;
			}
			if (this.activityViews.url == "") {
				this.addShow = false;
			}
			if (sessionStorage.getItem("imageUrl") == "") {
				this.addShow = false;
			}
			// if (sessionStorage.getItem("img") == 1) {

			// 	this.activityViews = {};
			// }
		},
		watch: {
			imgURL(newData, oldData) {
				console.log(newData, "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
				this.uploadShow = false;
				this.addShow = true;
				this.uploadBtn = false;
				this.activityViews.url = "http:" + this.IMG + newData;
				console.log(this.activityViews, "ggggggg");
			},
			"activityViews.div.width": {
				handler: function(newValue, old) {
					//特别注意，不能用箭头函数，箭头函数，this指向全局
					let v = newValue.split("px")[0];
					// if (Number(v) < 420 && old && old != "0px" && this.isMsgBox) {
					// 	this.isMsgBox = false;
					// 	this.option.autoCropWidth = 420;
					// 	this.option.autoCropHeight = ((420 * this.numberArr[1]) / this.numberArr[0]).toFixed(2);
					// 	this.$refs.cropper.refresh();
					// 	this.$alert("图片建议宽度660px，最底不小于420px").then(() => {
					// 		this.isMsgBox = true;
					// 	});
					// }
				},
				deep: true, //深度监听
			},
		},
		mounted() {
			// bus.$on("activityimgURL", msg => {
			// 	console.log(msg, "acti..........");
			// 	// sessionStorage.setItem("bannerFileId", msg);
			// 	this.uploadShow = false;
			// 	this.addShow = true;
			// 	this.activityViews.url = "http:" + this.IMG + msg;

			// 	console.log(this.activityViews.url, "rrrrrrrrrrrrr");
			// });
			this.activityViews.url = sessionStorage.getItem("imageUrl");
			if (sessionStorage.getItem("infoimgURL")) {
				this.uploadShow = false;
				this.addShow = true;
				this.uploadBtn = false;
				this.activityViews.url = "http:" + this.IMG + sessionStorage.getItem("infoimgURL");
			}
			// if (butil.getParams("Id")) {
			// 	if (this.poster == "poster") {
			// 		this.infoStyle = "height:230px;width:300px;";
			// 	} else {
			// 		this.infoStyle = "height:115px;width:165px;";
			// 	}
			// 	// this.infoStyle = "height:375px;width:667px;";
			// }
		},
		methods: {
			setWH(width, height) {
				this.infoStyle = `width:${width}px;height:${height}px;`;
			},
			getWH(width, height) {
				console.log(width, height, "666");
				this.numberArr = [width, height];
				this.option.autoCropWidth = width;
				this.option.autoCropHeight = height;
			},
			convertBase64UrlToBlob(urlData) {
				console.log(urlData, "urlData");
				let arr = urlData.split(","),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				// return new Blob([u8arr], { type: mime });
				return new File([u8arr], "cropperImg.jpg", { type: mime });
			},
			emitimgUrl(data) {},
			// 放大/缩小
			// changeScale(num) {
			// 	num = num || 1;
			// 	this.$refs.cropper.changeScale(num);
			// },
			// // 坐旋转
			// rotateLeft() {
			// 	this.$refs.cropper.rotateLeft();
			// },
			// // 右旋转
			// rotateRight() {
			// 	this.$refs.cropper.rotateRight();
			// },
			// 上传图片（点击上传按钮）
			finish(type) {
				let _this = this;
				let formData = new FormData();
				// 输出
				if (type === "blob") {
					this.$refs.cropper.getCropBlob(data => {
						let tofile = new window.File([data], "cropperImg.jpg", {
							type: "jpg",
						});
						let formData = new FormData();
						formData.append("file", tofile);

						const isLt1MB = tofile.size / 1024 < 1024;
						if (!isLt1MB) {
							this.$message.error("封面图片大小不能超过 1M!");
							return false;
						}
					});
					this.$refs.cropper.getCropData(data => {
						let blobDate = this.convertBase64UrlToBlob(data);
						console.log(blobDate, "pictureLibrary");
						let par = {
							file: blobDate,
						};
						this.$store
							// .dispatch("login/ManagerUploadImage", par)
							.dispatch("pictureLibrary/Upload", par)
							.then(res => {
								if (res.success) {
									this.infoStyle = `width:${this.option.autoCropWidth}px;height:${this.option.autoCropHeight}px;`;
									this.numberArr = [this.option.autoCropWidth, this.option.autoCropHeight];
									this.$message.success("上传成功！");
									this.uploadShow = false;
									this.uploadBtn = false;
									this.fileId = res.fileId;
									console.log(this.fileId, "rtrrtrt");
									//this.$emit("fileId", this.fileId);
									bus.$emit("infoFileId", this.fileId);
									this.$emit("getfileId", this.fileId);
								} else {
									this.$message.error(res.Data[0].Result.message);
								}
							})
							.catch(err => {
								this.$message.error("上传失败！");
							});
					});
				} else {
					this.$refs.cropper.getCropData(data => {
						// this.model = true;
						// this.modelSrc = data;
					});
				}
			},

			// 实时预览函数
			realTime(data) {
				this.activityViews = data;
			},
			// 下载图片
			down(type) {
				let aLink = document.createElement("a");
				aLink.download = "author-img";
				if (type === "blob") {
					this.$refs.cropper.getCropBlob(data => {
						this.downImg = window.URL.createObjectURL(data);
						aLink.href = window.URL.createObjectURL(data);
						aLink.click();
					});
				} else {
					this.$refs.cropper.getCropData(data => {
						this.downImg = data;
						aLink.href = data;
						aLink.click();
					});
				}
			},

			// 选择本地图片
			uploadImg(e, num) {
				this.uploadShow = true;
				let _this = this;
				// 上传图片
				let file = e.target.files[0];
				_this.fileName = file.name;
				console.log(_this.fileName, "fn");
				if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
					alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
					return false;
				}
				let reader = new FileReader();
				reader.onload = e => {
					this.addShow = true;
					let data;
					if (typeof e.target.result === "object") {
						// 把Array Buffer转化为blob 如果是base64不需要
						data = window.URL.createObjectURL(new Blob([e.target.result]));
					} else {
						data = e.target.result;
					}
					if (num === 1) {
						_this.option.img = data;
					} else if (num === 2) {
						_this.example2.img = data;
					}
				};
				this.uploadBtn = true;
				// 转化为base64
				// reader.readAsDataURL(file)
				// 转化为blob
				reader.readAsArrayBuffer(file);
			},
			imgLoad(msg) {},
		},
	};
</script>

<style lang="less" scoped>
	.cropper-component {
		//width: 500px;
		margin: 0 auto;
		position: relative;
		.btn {
			padding: 2px 12px;
			text-align: center;
			border-radius: 4px;
			background-color: #387ef6;
			color: #fff;
			cursor: pointer;
			display: inline-block;
		}
		.btn-box {
			margin: 0 0 20px 0;

			.operation-btn {
				width: 30px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				background-color: #fff;
				border: 1px solid #eaeaea;
				cursor: pointer;
				display: inline-block;
				font-size: 20px;
				color: #333;
				padding: 0;
				margin: 0 10px;
			}
		}
		.info-item {
			.operation-box {
				display: inline-block;
				.cropper {
					width: 800px;
					height: 1000px;
				}
				// .cropper-poster {
				// 	width: 300px;
				// 	height: 460px;
				// }
			}
			.preview-box {
				top: 60px;
				right: 10px;
				.preview {
					// width: 165px;
					// height: 115px;
					// //border-radius: 50%;
					// border: 1px solid #ccc;
					// background-color: #ccc;
					//margin: 5px;
					overflow: hidden;
					img {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
</style>
