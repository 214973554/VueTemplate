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
		//获取角标设置数据
		InitAppTabTypeBadge: function (context, data) {
			return new Promise((resolve, reject) => {
				console.log(resolve);
				getData(`/Beta.HomeWebAPI/Api/AppTabType/GetAppTabTypeBadge`, data, "get")
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						console.log(err);
						reject(err);
					});
			});
		},
		//保存角标设置
		Save: function (context, data) {
			return new Promise((resolve, reject) => {
				console.log(resolve);
				getData(`/Beta.HomeWebAPI/Api/AppTabType/UpdateBadge`, data, "post")
					.then(res => {
						resolve(res);
					})
					.catch(err => {
						console.log(err);
						reject(err);
					});
			});
		}
	}
};
