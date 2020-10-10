import axios from "axios";
import butil from "beta-util";
// import qs from 'qs'

let instance = axios.create({
	timeout: 30000,
	baseURL: "",
});
axios.defaults.headers.post["Content-Type"] = "application/json;utf-8";

//请求拦截器
instance.interceptors.request.use(
	config => {
		let userName = butil.getCookie('username') || "";
		if (!userName) {
			alert('请重新登陆！');
			window.location.replace(`${process.env.VUE_APP_BetaHomeWeb}/Manager/Main.aspx`);
			return false;
		}
		if (config.method === "formdata") {
			config.headers.post["Content-Type"] = "multipart/form-data;utf-8";
			config.method = "post";
			let fPar = new FormData();
			for (let key in config.params) {
				fPar.append(key, config.params[key]);
			}
			config.data = fPar;
			config.params = "";
		} else if (config.method === "query") {
			config.method = "post";
		} else if (config.method === "post") {
			config.data = config.params;
			config.params = "";
		}
		config.headers["Cache-Control"] = "no-cache";
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
		}
		return addErrorLog(res);
	},
	err => {
		return addErrorLog(err);
	}
);
const addErrorLog = res => {
	console.error(res, "axios/error");
	return Promise.reject(res.data);
};
const $axios = option => {
	let parDef = {
		url: "",
		data: {},
		method: "post",
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
