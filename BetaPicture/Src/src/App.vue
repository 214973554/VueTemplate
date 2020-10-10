<template>
	<div id="app">
		<router-view class="appView"></router-view>
	</div>
</template>
<script>
	//import bsdk from "beta-jsdk";

	export default {
		name: "App",
		watch: {},
		created() {
			// bsdk.config({
			// 	//服务器列表
			// 	servers: process.env.SERVERS_ENV,
			// });
		},
		mounted() {},
		data() {
			return {};
		},
	};
</script>
<style lang="less">
@import "../src/assets/css/share";
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
</style>
