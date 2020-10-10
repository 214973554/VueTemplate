// * 正则表达式区域-----------begin---------------------------
/**
 * 手机号码正则表达式，仅限中国大陆11为数字手机号
 */
export const regTel = /^[1][3,4,5,7,8][0-9]{9}$/;
/**
 * 身份证号码正则  包含15、18位纯数字和带有大小X的18位身份证验证
 */
export const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
// * 正则表达式区域-----------end-----------------------------

// * 常用函数区域-------------begin --------------------------
/**
 * 判断字符串、数组、对象非法是否为空
 * true---空值  false --- 非空值
 *
 * 注意： typeof 类型为function、boolean、number、bigint、symbol时不判断，返回false
 * @param {*} value
 */
export const getParams = name => {
    // var search = window.location.search.substring(1);
    // if (search) {
    //     var obj = JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    //     return name ? obj[name] : obj;
    // }
    let reg = new RegExp("[&|?]" + name + "=([^&$]*)", "gi");
    let a = reg.test(location.search);
    return decodeURIComponent(a ? RegExp.$1 : "");
};
export const isEmpty = value => {
    if (typeof value === "object") {
        //对象  数组  null
        if (value === {} || value === null || value.length === 0) return true;
        let oKeys = Object.keys(value);
        if (oKeys.length === 0) return true;
    } else if (typeof value === "undefined") return true;
    else if (typeof value === "string") {
        value = value
            .replace(/^(\s|\u00A0)+/, "")
            .replace(/(\s|\u00A0)+$/, "")
            .replace(/^(\s|\u0020)+/, "")
            .replace(/(\s|\u0020)+$/, "");
        if (value.length === 0 || value === "undefined" || value === "null" || value === "" || value === "{}")
            return true;
    }
    return false;
};
export const changeTime = value => {
    let d = new Date(value);
    let times =
        d.getFullYear() +
        "-" +
        zero(d.getMonth() + 1) +
        "-" +
        zero(d.getDate()) +
        " " +
        zero(d.getHours()) +
        ":" +
        zero(d.getMinutes()) +
        ":" +
        zero(d.getSeconds());
    return times;
}
export const changeTimeNoMinutes = value => {
    let d = new Date(value);
    let times =
        d.getFullYear() +
        "-" +
        zero(d.getMonth() + 1) +
        "-" +
        zero(d.getDate())
    return times;
}
export const zero = value => {
    if (value < 10) {
        return "0" + value;
    } else {
        return value;
    }
}

/**
 * 身份号码验证
 * true---合法   false--错误
 * @param {*} value
 */
export const checkIdCard = value => {
    return regIdCard.test(value);
};
/**
 * 手机号码验证
 * true---正确   false--错误
 * @param {*} value
 */
export const checkPhoneNum = value => {
    return regTel.test(value);
};
/**
 * 输入框只能输入数字、一个小数点、两位小数，如：金额
 * @param {*} value
 */
export const clearNoNum = value => {
    value = value.replace(/[^\d.]/g, ""); // 清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
    value = value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
    value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
    if (value.indexOf(".") < 0 && value != "") {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        value = parseFloat(value);
    }
    return value;
};
/**
 * 字符串 转 Date
 * @param {*} dateStr 形如‘2017-06-12’ ‘2017/6/12’的字符串
 * @param {*} linkSrt dateStr的分割符，如: ‘-’ ‘/’ ‘.’等
 * 注意：dateStr格式不能包含 时、分、秒部分，否则不转换
 * @return Date
 */
export const strToDate = (dateStr, linkSrt = "-") => {
    if (isEmpty(dateStr) || dateStr.indexOf(linkSrt) === -1) return dateStr;
    let str = dateStr.split(" ");
    let temp = str[0].split(linkSrt);
    if (temp.length !== 3 || temp[2].length > 2) return dateStr;
    if (temp[1] === "01" || temp[1] === "1") {
        temp[0] = parseInt(temp[0], 10) - 1;
        temp[1] = "12";
    } else {
        temp[1] = parseInt(temp[1], 10) - 1;
    }
    let time = (str[1] || "00:00:00").split(":");
    // new Date()的月份入参实际都是当前值-1
    let date = new Date(temp[0], temp[1], temp[2], time[0], time[1], time[2]);
    return date;
};

/** * 对new Date的格式化，
 *  @param {*} newDate  -- new Date();格式时间戳
 *  @param {*} fmt  --  要格式话的类型 ：（见下介绍）
 * 将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 *   可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) *
 *
 * 连接符可自定义 如：‘-’，‘/’，‘.’
 *  eg: * (new Date(),"yyyy-MM-dd hh:mm:ss.S")==> 2009-03-10 08:09:04.423
 *         (new Date(),"yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 *         (new Date(),"yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 *         (new Date(),"yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 *         (new Date(),"yyyy-M-d h:m:s.S") ==> 2009-3-10 8:9:4.18
 */
export const newDateFormat = (newDate = new Date(), fmt = "yyyy-MM-dd hh:mm:ss.S") => {
    let o = {
        "M+": newDate.getMonth() + 1, //月份
        "d+": newDate.getDate(), //日
        "h+": newDate.getHours() % 12 == 0 ? 12 : newDate.getHours() % 12, //小时
        "H+": newDate.getHours(), //小时
        "m+": newDate.getMinutes(), //分
        "s+": newDate.getSeconds(), //秒
        "q+": Math.floor((newDate.getMonth() + 3) / 3), //季度
        S: newDate.getMilliseconds(), //毫秒
    };
    let week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d",
    };
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (newDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/i.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") +
            week[newDate.getDay() + ""]
        );
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return fmt.toString();
};
/**
 * 计算时间为刚刚、几分钟前、几小时前、几天前··
 * dateTimeStamp为时间戳格式
 * @param {*} dateTimeStamp
 */
export const timeago = dateTimeStamp => {
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    // let halfamonth = day * 15;
    let month = day * 30;
    let now = new Date().getTime();
    let diffValue = now - dateTimeStamp;
    let result = "";
    if (diffValue < 0) {
        // 若日期不符则弹出窗口告之
        // alert("结束日期不能小于开始日期！");
    }
    let monthC = diffValue / month;
    let weekC = diffValue / (7 * day);
    let dayC = diffValue / day;
    let hourC = diffValue / hour;
    let minC = diffValue / minute;
    if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
    } else result = "刚刚";
    return result;
};
/**
 * 时间戳 转 日期  形如yy-mm-dd hh:mm:ss
 * @param {*} d   毫秒时间戳
 * @param {*} type  转换的日期截止类型，
 *               换类型默认为：年 月 日
 *                        秒：年 月 日  时 分 秒
 *                        分：年 月 日  时 分
 *                        时：年 月 日  时
 * @param {*} linkSrt  链接符号
 */
export const timeNumToStr = (d, type = "", linkSrt = "-") => {
    if (isEmpty(d)) return "";

    function addZero(num) {
        if (num < 10) return "0" + num;
        return num;
    }
    let time = new Date(d);
    if (type == "秒") {
        return (
            time.getFullYear() +
            linkSrt +
            addZero(time.getMonth() + 1) +
            linkSrt +
            addZero(time.getDate()) +
            " " +
            addZero(time.getHours()) +
            ":" +
            addZero(time.getMinutes()) +
            ":" +
            addZero(time.getSeconds())
        );
    } else if (type == "分") {
        return (
            time.getFullYear() +
            linkSrt +
            addZero(time.getMonth() + 1) +
            linkSrt +
            addZero(time.getDate()) +
            " " +
            addZero(time.getHours()) +
            ":" +
            addZero(time.getMinutes())
        );
    } else if (type == "时") {
        return (
            time.getFullYear() +
            linkSrt +
            addZero(time.getMonth() + 1) +
            linkSrt +
            addZero(time.getDate()) +
            " " +
            addZero(time.getHours())
        );
    } else {
        return time.getFullYear() + linkSrt + addZero(time.getMonth() + 1) + linkSrt + addZero(time.getDate());
    }
};
/**
 * 字符串转Date
 * @param {*} dateStr  形如‘2017-06-12 00:00:55 ’、‘2017/6/12 02:00:55’的字符串
 * 注意:dateStr 格式不能包含时、分、秒部分，否则不转换
 * @param {*} linkSrt dateStr的分割符，如:‘-’、‘/’、‘.’等
 */
export const strToDateNum = (dateStr = "", linkSrt = "-") => {
    let dateArr = dateStr.split(" ");
    let str1 = dateArr[0].split(linkSrt);
    let str2 = [];
    if (dateArr.length > 1) {
        str2 = dateArr[1].split(":");
    }

    let dateNum = new Date(str1[0], str1[1], str1[2], str2[0] || "00", str2[1] || "00", str2[2] || "00");
    return dateNum.getTime() || 0;
};
/**
 * 时间字符 截取， 规定从 “年” 截取到指定的类型处
 * @param {*} dateStr 形如‘2017-06-12’ ‘2017/6/12’ ‘2017.6.12 10:52:49’的字符串
 * @param {*} type  截取到时间字符串的位置，年、月、日、时、分、秒
 * @param {*} linkSrt dateStr的(年月日)分割符，如: ‘-’ ‘/’ ‘.’等
 * @param {*} linkSrt1 dateStr的(时分秒)分割符，默认：‘:’
 */
export const dateStrFormat = (dateStr, type = "分", linkSrt = "-", linkSrt1 = ":") => {
    let arr1 = dateStr.split(" ");
    if (isEmpty(arr1[1])) {
        arr1[1] = "00:00:00";
    }
    let arr2 = arr1[0].split(linkSrt);
    let arr3 = arr1[1].split(linkSrt1);
    let arr = [...arr2, ...arr3];
    if (type === "年") {
        return arr[0];
    } else if (type === "月") {
        return arr[0] + linkSrt + arr[1];
    } else if (type === "日") {
        return arr[0] + linkSrt + arr[1] + linkSrt + arr[2];
    } else if (type === "时") {
        return arr[0] + linkSrt + arr[1] + linkSrt + arr[2] + " " + arr[3];
    } else if (type === "分") {
        return arr[0] + linkSrt + arr[1] + linkSrt + arr[2] + " " + arr[3] + linkSrt1 + arr[4];
    } else if (type === "秒") {
        return arr[0] + linkSrt + arr[1] + linkSrt + arr[2] + " " + arr[3] + linkSrt1 + arr[4] + linkSrt1 + arr[4];
    } else {
        return dateStr;
    }
};
/**
 * 获取某个时间点之前/之后的时间
 * @param {*} d 毫秒时间戳
 * @param {*} day -- 天数 Number类型；day>0 表示获取之前的时候，day<0 表示获取之后的时间
 * @param {*} linkSrt dateStr的(年月日)分割符，如: ‘-’ ‘/’ ‘.’等
 * @param {*} linkSrt1 dateStr的(时分秒)分割符，默认：‘:’
 */
export const dateGetBefore = (d = new Date().getTime(), day = 0, type = "分", linkStr = "-") => {
    let timeNum = d - day * 24 * 60 * 60 * 1000;
    return timeNumToStr(timeNum, type, linkStr);
};
/**
 * moneyFormat 适用于金额等长分割
 * @param {*} money
 * @param {*} splitLength 分割长度，金额每隔3位加逗号(',')
 * @param {*} linkSrt --- 分割连接符
 * @param {*} isSpot --- 是否要小数点后的值  注意：小数点后的不分割
 *                      （此值适用于金额分割：56354.31元 isSpot为true分割后：56,354.31 ;为fase时：56,354）
 */
export const moneyFormat = (str, splitLength = 3, linkSrt = ",", isSpot = true) => {
    let strArr = str.toString().split("."); //当分割为金额时 小数点后的字符不处理
    strArr[0] = strFormat(strArr[0], splitLength, linkSrt, true);
    // console.log(strArr[0] + (isSpot ? "." + strArr[1] || ".00" : ""));
    return strArr[0] + (isSpot ? "." + strArr[1] || ".00" : "");
};
/**
 * strFormat 适用于字符串等长分割，如：银行卡号每隔4位加空格(' ')
 * @param {*} str  --- 需要格式的字符串
 * @param {*} splitLength --- 分割长度
 * @param {*} linkSrt --- 分割连接符
 * @param {*} isReverse --- 是否从后向前分割，默认false，从前往后，如：银行卡号每隔4位加空格(' ')
 *
 */
export const strFormat = (str, splitLength = 4, linkSrt = " ", isReverse = false) => {
    str = str.toString();
    if (isReverse) {
        str = str
            .split("")
            .reverse()
            .join("");
    }
    let regExp = new RegExp(`.{${splitLength}}|.{1}`, "g");
    let strArr = str
        .match(regExp)
        .join(linkSrt)
        .split("");
    if (isReverse) {
        strArr.reverse();
    }
    strArr = strArr.join("").split(linkSrt);
    let strArr1 = [...strArr];
    let spareLen = str.length % splitLength;
    let spareStr = "";
    for (let i = 0; i < spareLen; i++) {
        spareStr += strArr1[i].toString();
        strArr.shift();
    }
    // console.log(spareStr + linkSrt + strArr.join(linkSrt));
    return spareStr + linkSrt + strArr.join(linkSrt);
};
/**
 * 判断是否是 iPhoneX
 *  return true --- 是iPhoneX、iPhoneXS、iPhoneXS Max、iPhoneXR
 */
export const isIphoneX = () => {
    let isIphoneX =
        /iphone/gi.test(window.navigator.userAgent) &&
        window.devicePixelRatio &&
        (window.devicePixelRatio === 3 || window.devicePixelRatio === 2) &&
        window.screen.width === 375 &&
        (window.screen.height === 812 || window.screen.height === 724);
    let isIphoneXr =
        /iphone/gi.test(window.navigator.userAgent) &&
        window.devicePixelRatio &&
        window.devicePixelRatio === 2 &&
        window.screen.width === 414 &&
        (window.screen.height === 896 || window.screen.height === 808);
    let isIphoneXsMax =
        /iphone/gi.test(window.navigator.userAgent) &&
        window.devicePixelRatio &&
        window.devicePixelRatio === 3 &&
        window.screen.width === 414 &&
        (window.screen.height === 896 || window.screen.height === 808);
    return isIphoneX || isIphoneXr || isIphoneXsMax;
};
/**
 * 兼容iphoneX
 * @param {*} el  -- ele:元素的 #id 或 .className
 */
export const setIphoneXCss = (ele = ".fixedBox") => {
    if (isIphoneX()) {
        let fBox = document.querySelector(ele);
        let pBox = document.querySelector("#app");
        let pBtm = getComputedStyle(pBox, null).paddingBottom || "0px";
        let fBtm = getComputedStyle(fBox, null).paddingBottom || "0px";
        pBtm = Number(pBtm.split("px")[0]) + 35;
        fBtm = Number(fBtm.split("px")[0]) + 35;
        pBox.style.paddingBottom = pBtm + "px";
        fBox.style.height = "auto";
        fBox.style.paddingBottom = fBtm + "px";
    }
};
// * 常用函数区域-------------end ----------------------------
