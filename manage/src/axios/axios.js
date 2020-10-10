import $axios from "@/axios/request";
/**
 *
 * @param {*} url --api路径
 * @param {*} data -- 请求参数 json对象
 * @param {*} method --请求方式：get/post/formdata
 */
export const getData = (url = "", data = {}, method = "post") => {
	url = setBaseUrl(url);
	return $axios({
		url,
		method,
		data,
	});
};

/**
 *
 * @param {*} url --api路径
 * @param {*} id  --路径参字符串，通常情况是以斜杠"/"分割的多个字符串
 *                  一个字符串时不用斜杠"/"
 *                  如："aaa" 和 "aaa/bbb/ccc"
 *
 * @param {*} data -- 请求参数 json对象
 * @param {*} method --请求方式：get/post/formdata
 */
export const requstUrl = (url = "", urlStr = "", data = {}, method = "post") => {
	url = setBaseUrl(url);
	return $axios({
		url: `${url}/${urlStr}`,
		method,
		data,
	});
};
//处理api请求的url
const setBaseUrl = url => {
	if (url.indexOf('/Beta.') == 0 || url.indexOf('Beta.') == 0) {
		//仅处理以/Beta.或者Beta开头的请求，全路径的 // 、http:// 和https://的直接返回
		if (url.indexOf("/") > 0) {
			url = "/" + url;
		}
		let urlArr = url.split("/");
		let baseName = urlArr[1];
		baseName = baseName.replace(/\./g, "");
		let baseUrl = process.env["VUE_APP_" + baseName] + url;

		if (baseUrl.indexOf("http") == -1) {
			let h = window.location.protocol + '//';
			baseUrl = h + baseUrl;
		}
		console.log(baseUrl, 'baseUrl');
		return baseUrl;
	} else {
		return url
	}
};
