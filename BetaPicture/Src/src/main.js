import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import moment from "moment";
// import preventReClick from "./common/preventReClick"; //防多次点击，重复提交
import "normalize.css";
import "../src/assets/css/reset.css";
import "element-ui/lib/theme-chalk/index.css";
import "babel-polyfill";

import Vue from "vue";
Vue.use(ElementUI, {
	size: "small",
	zIndex: 3000
});
Vue.prototype.$moment = moment;
Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount("#app");
