import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import publicApi from './module/publicApi'
import wxMoments from './module/wxMoments'
import badge from './module/badge'

export default new Vuex.Store({
	state: {
		userInfo: null,
		token: '',
	},
	mutations: {
		setObjLS: (state, opt = { key: '', val: null }) => {
			state[opt.key] = opt.val;
			window.localStorage.setItem(opt.key, JSON.stringify(opt.val));
		},
		setStrLS: (state, opt = { key: '', val: '' }) => {
			state[opt.key] = opt.val;
			window.localStorage.setItem(opt.key, opt.val);
		},
	},
	getters: {
		getObjLS: (state) => (key) => {
			let uInfo = state[key] || null;
			let uInfo1 = JSON.parse(window.localStorage.getItem(key)) || null;
			return uInfo || uInfo1;
		},
		getStrLS: (state) => (key) => {
			let val = state[key] || "";
			let val1 = window.localStorage.getItem(key) || '';
			return val || val1;
		}
	},
	actions: {
	},
	modules: {
		publicApi,
		wxMoments,
		badge
	}
})
