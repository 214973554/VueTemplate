import axios from "axios";
//处理 测试环境和生产环境下的url
const setBaseUrl = url => {
	if (process.env.NODE_ENV == 'dev') {
		return '/'
	}
	if (url.indexOf("/") > 0) {
		url = "/" + url;
	}
	let urlArr = url.split("/");
	let baseName = urlArr[1];
	baseName = baseName.replace(/\./g, "");

	let baseUrl = process.env["VUE_APP_" + baseName];
	console.log(baseUrl, 'baseUrl')
	return baseUrl;
};
let instance = axios.create({
	timeout: 20000,
	baseURL: process.env.VUE_APP_BetaHomeWebAPI,
});
axios.defaults.headers.post["Content-Type"] = "application/json;utf-8";
//请求拦截器
instance.interceptors.request.use(
	config => {
		config.baseURL = setBaseUrl(config.url);
		if (config.method === "formdata") {
			config.headers.post["Content-Type"] = "multipart/form-data";
			config.method = "post";
			let fPar = new FormData();
			for (let key in config.params) {
				fPar.append(key, config.params[key]);
			}
			config.data = fPar;
			config.params = "";
		} else if (config.method === "post") {
			config.data = config.params; //序列化后的post请求方式
			config.params = "";
		}
		config.headers["Cache-Control"] = "no-cache";
		//config.headers["Authorization"] = localStorage.getItem("Authorization");
		// config.headers["Authorization"] = butil.getParams("ency");
		return config;
	},
	err => {
		return Promise.reject(err);
	}
);

//响应拦截器
instance.interceptors.response.use(
	res => {
		if (res.status === 200) {
			return res.data;
			// if (res.data.State === 0) {
			// 	return res.data;
			// }
		}
		return addErrorLog(res);
	},
	err => {
		return addErrorLog(err);
	}
);
const addErrorLog = res => {
	// Notification({
	// 	title: res.status,
	// 	type: "error",
	// 	message: res,
	// });
	return Promise.reject(res.data);
};
const $axios = option => {
	let parDef = {
		url: "",
		data: {},
		method: "post"
	};
	let par = Object.assign(parDef, option);
	return new Promise((resolve, reject) => {
		instance({
				url: par.url,
				params: par.data,
				method: par.method,
			})
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
	});
};
export default $axios;
