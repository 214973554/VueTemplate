import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import "normalize.css";
import 'element-ui/lib/theme-chalk/index.css';
import "@/assets/css/reset.css";

import ElementUI from 'element-ui';
Vue.use(ElementUI, { size: 'small' });

//全局注册api
// import api from '@/api/api';
// Vue.prototype.$api = api;
Vue.config.productionTip = false;
Vue.config.silent = process.env.NODE_ENV === "pro";

Vue.config.errorHandler = function (err, vm, info) {
	let errdata = `Error: ${err.toString()}\nInfo: ${info}`;
	console.error(errdata);
}
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
