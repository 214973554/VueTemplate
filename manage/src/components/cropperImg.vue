<template>
	<div class="vue_cropper_main">
		<VueCropper
			ref="cropperRef"
			class="crop_box"
			:img="imgSrc"
			:outputSize="opt.outputSize"
			:autoCrop="opt.autoCrop"
			:autoCropWidth="opt.autoCropWidth"
			:autoCropHeight="opt.autoCropHeight"
			:outputType="opt.outputType"
			:fixed="opt.fixed"
			:maxImgSize="opt.maxImgSize"
			:centerBox="opt.centerBox"
		></VueCropper>
		<div class="crop_btn">
			<span class="exit_btn" @click="closeCrop">取 消</span>
			<span class="sure_btn" @click="subCrop">完 成</span>
		</div>
	</div>
</template>
<script>
	import { VueCropper } from "vue-cropper";
	export default {
		name: "cropperImg",
		props: {
			imgSrc: {
				//base64  或者 blob地址
				type: String,
				required: true,
			},
			getType: {
				//默认裁剪完成后的数据类型  base64，blob,all
				type: String,
				default: "all",
			},
			options: {
				type: Object,
				default: () => {
					return null;
				},
			},
		},
		components: { VueCropper },
		data() {
			return {
				opt: {
					outputSize: 0.8, //裁剪生成图片的质量
					autoCrop: true, //默认生成截图框
					autoCropWidth: 200, //默认生成截图框宽度
					autoCropHeight: 200, //默认生成截图框宽度
					outputType: "png", //默认裁剪后输出的图片类型
					fixed: true, //默认固定截图框宽高比例
					maxImgSize: 1000, //默认限制图片最大宽度和高度
					centerBox: true, //默认截图框被限制在图片里面
				},
			};
		},
		created() {
			this.opt = Object.assign(this.opt, this.option);
		},
		computed: {},
		watch: {},
		mounted() {},
		filters: {},
		activated() {},
		deactivated() {},
		methods: {
			closeCrop() {
				this.$emit("close-crop", false);
			},
			subCrop() {
				this.$refs.cropperRef.startCrop(); //开始截图
				let type = this.opt.outputType;
				let base64 = "",
					blob = "";
				if (this.getType == "blob") {
					// 获取截图的Blob 数据
					this.$refs.cropperRef.getCropBlob((data) => {
						this.$emit("finish-crop", {
							blob: data,
							type,
						});
					});
				} else if (this.getType == "base64") {
					// 获取截图的base64 数据
					this.$refs.cropperRef.getCropData((data) => {
						this.$emit("finish-crop", {
							base64: data,
							type,
						});
					});
				} else {
					this.$refs.cropperRef.getCropBlob((blob) => {
						this.$refs.cropperRef.getCropData((base64) => {
							this.$emit("finish-crop", {
								blob,
								base64,
								type,
							});
						});
					});
				}
			},
		},
	};
</script>
<style lang="less" scoped>
	.vue_cropper_main {
		z-index: 30000;
		position: fixed;
		background: rgba(0, 0, 0, 0.6);
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		.crop_box {
			width: 70%;
			height: 70%;
			padding: 0;
			margin: 8% auto;
		}
		.crop_btn {
			background: transparent;
			width: 100%;
			position: absolute;
			z-index: 5;
			top: 85%;
			display: flex;
			align-items: center;
			justify-content: center;
			left: 0;
			padding: 0 15px;
			& > span {
				padding: 8px 25px;
				line-height: 1;
				color: #fff;
				margin: 0 20px;
				border-radius: 4px;
				font-size: 14px;
			}
			.exit_btn {
				background: #c0c0c0;
			}
			.sure_btn {
				background: #d62d32;
			}
		}
	}
</style>
