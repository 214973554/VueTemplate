import $axios from "@/axios/request";
/**
 *
 * @param {*} url --api路径
 * @param {*} data -- 请求参数 json对象
 * @param {*} method --请求方式：get/post/formdata
 */
const getData = (url = "", data = {}, method) => {
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
const requstUrl = (url = "", id = "", data = {}, method = "post") => {
	let par = id === "" ? "" : "/" + id;
	return $axios({
		url: url + par,
		method,
		data,
	});
};

export default {
	getData,
	requstUrl,
};
