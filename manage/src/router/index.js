import Vue from 'vue'
import VueRouter from 'vue-router'
import wxMoments from '@/views/wxMoments/index'

Vue.use(VueRouter)

const routes = [
	{
		path: '/wxMoments',
		name: 'wxMoments',
		// component: () => import(/* webpackChunkName: "member" */ '@/views/wxMoments/index'),
		component: wxMoments,
	}, {
		path: '*',
		redirect: '/wxMoments'
	},
]

const router = new VueRouter({
	mode: 'history',
	base: "Beta.HomePC/manage",
	routes
});

router.beforeEach((to, from, next) => {
	if (!to.meta.isLogin) {
		next()
	} else {
		let vuxStore = router.app.$options.store;
		let token = vuxStore.getters.getStrLS('token');

		if (!token) next({ name: 'login' })
		else next()
	}
})
export default router
