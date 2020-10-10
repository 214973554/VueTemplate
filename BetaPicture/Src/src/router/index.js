import Vue from "vue";
import VueRouter from "vue-router";

import pictureLibrary from "../views/pictureLibrary/pictureLibrary";
import addEditPictureLibrary from "../views/pictureLibrary/addEditPictureLibrary";

Vue.use(VueRouter);

const routes = [{
		path: "/",
		name: "pictureLibrary",
		component: pictureLibrary,
		meta: {
			keepAlive: false,
			title: '图片库'
		},
	},

	{
		path: "/pictureLibrary",
		name: "pictureLibrary",
		component: pictureLibrary,
		meta: {
			keepAlive: false,
			title: '图片库'
		},
	},
	{
		path: "/addEditPictureLibrary",
		name: "addEditPictureLibrary",
		component: addEditPictureLibrary,
		meta: {
			keepAlive: false,
			title: '图片库'
		},
	},

];

const router = new VueRouter({
	mode: "history",
	base: "Beta.HomePC/BetaPicture",
	routes,
});
router.beforeEach((to, from, next) => {
	if (to.meta.title) {
		//判断是否有标题
		document.title = to.meta.title;
	}
	next();
});
export default router;
