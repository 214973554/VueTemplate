const dateFormat = (fmt, date) => {
	let ret;
	const opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString(), // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
		}
	}
	return fmt;
};

// const isUrl = str_url => {
// 	let strRegex =
// 		"^((https|http|ftp|rtsp|mms)?://)" +
// 		"?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + //ftp的user@
// 		"(([0-9]{1,3}.){3}[0-9]{1,3}" + // IP形式的URL- 199.194.52.184
// 		"|" + // 允许IP和DOMAIN（域名）
// 		"([0-9a-z_!~*'()-]+.)*" + // 域名- www.
// 		"([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." + // 二级域名
// 		"[a-z]{2,6})" + // first level domain- .com or .museum
// 		"(:[0-9]{1,4})?" + // 端口- :80
// 		"((/?)|" + // a slash isn't required if there is no file name
// 		"(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
// 	let re = new RegExp(strRegex);
// 	//re.test()
// 	if (re.test(str_url)) {
// 		return true;
// 	} else {
// 		return false;
// 	}
// };

const isUrl = str_url => {
	let reg = /^(https:\/\/|http:\/\/|www\.)/;
	if (!reg.test(str_url)) {
		return false;
	} else {
		return true;
	}
};

export { dateFormat, isUrl };
