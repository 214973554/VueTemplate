/**
 * axios.js使用须知：
 * 	1.getData和requstUrl方法具体使用请参考axios.js
 * 
 * 	2.请求的api接口可以是 /Beta. 和 Beta.开头的虚拟路径地址
 * 				也可以是以 http://、https:// 和 // 开头的全路径地址
 * 
 * 	3.getData和requstUrl的最后一个参数为请求方式，默认是 post，同时还支持：get，formdata，query 共四种
 * 		其中formdata--post形式的表单提交   query--post形式的地址拼接参数提交（类似post形式的get）
 *
 * */
import {
	getData,
	requstUrl
} from "@/axios/axios.js";
export default {
	namespaced: true,
	state: {
	},
	getters: {
	},
	mutations: {
	},
	actions: {
		//获取圈主列表
		GetMomentsList(context, payload) {
			return new Promise((resolve, reject) => {
				getData(`/Beta.InfoWebAPI/api/MomentsCreator/GetListByPager`, payload, "post")
					.then((res) => {
						if (res.State === 0) {
							resolve(res);
						} else {
							reject(res);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		//保存圈主
		EditMomentInfo(context, payload) {
			return new Promise((resolve, reject) => {
				getData(`/Beta.InfoWebAPI/api/MomentsCreator/Save`, payload, "post")
					.then((res) => {
						if (res.State === 0) {
							resolve(res);
						} else {
							reject(res);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		//修改圈主是否显示
		UpdateIsShow(context, payload) {
			return new Promise((resolve, reject) => {
				getData(`/Beta.InfoWebAPI/api/MomentsCreator/UpdateIsShow`, payload, "get")
					.then((res) => {
						if (res.State === 0) {
							resolve(res);
						} else {
							reject(res);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		//获取圈主内容列表
		GetInfoList(context, payload) {
			return new Promise((resolve, reject) => {
				getData(`/Beta.InfoWebAPI/api/MomentsContent/GetListByPager`, payload, "post")
					.then((res) => {
						if (res.State === 0) {
							resolve(res);
						} else {
							reject(res);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		//获取内容信息
		GetContentInfo(context, payload) {
			return new Promise((resolve, reject) => {
				getData(`/Beta.InfoWebAPI/api/MomentsContent/GetById`, payload, "get")
					.then((res) => {
						if (res.State === 0) {
							resolve(res);
						} else {
							reject(res);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		//获取圈主下拉列表
		GetUserMomentsAll(context, payload) {
			return new Promise((resolve, reject) => {
				getData(`/Beta.InfoWebAPI/api/MomentsCreator/GetAll`, payload, "get")
					.then((res) => {
						if (res.State === 0) {
							resolve(res);
						} else {
							reject(res);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		//添加、编辑圈主内容信息
		SaveMomentsInfo(context, payload) {
			return new Promise((resolve, reject) => {
				getData(`/Beta.InfoWebAPI/api/MomentsContent/Save`, payload, "post")
					.then((res) => {
						if (res.State === 0) {
							resolve(res);
						} else {
							reject(res);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		//获取云点播签名
		GetSignature(context, payload) {
			return new Promise((resolve, reject) => {
				getData(`/Beta.HomeWebAPI/Api/ShortVideoLibrary/GetSignature`, payload, "get")
					.then((res) => {
						if (res.State === 0) {
							resolve(res);
						} else {
							reject(res);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		//添加、编辑圈主内容信息
		SaveMomentsInfo(context, payload) {
			return new Promise((resolve, reject) => {
				getData(`/Beta.InfoWebAPI/api/MomentsContent/Save`, payload, "post")
					.then((res) => {
						if (res.State === 0) {
							resolve(res);
						} else {
							reject(res);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		//圈主内容是否置顶
		UpdateIsTop(context, payload) {
			return new Promise((resolve, reject) => {
				getData(`/Beta.InfoWebAPI/api/MomentsContent/UpdateIsTop`, payload, "get")
					.then((res) => {
						if (res.State === 0) {
							resolve(res);
						} else {
							reject(res);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		//圈主内容是否显示
		UpdateIsPublish(context, payload) {
			return new Promise((resolve, reject) => {
				getData(`/Beta.InfoWebAPI/api/MomentsContent/UpdateIsPublish`, payload, "get")
					.then((res) => {
						if (res.State === 0) {
							resolve(res);
						} else {
							reject(res);
						}
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
	}
};
