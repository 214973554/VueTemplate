<template>
	<div class="wx_moments_main">
		<pageTabs
			:tabArr="tabArr"
			:tabIndex="tabIdx"
			@tab-click="tabChange"
		></pageTabs>
		<userList v-if="tabIdx == 0"></userList>
		<infoList v-else-if="tabIdx == 1"></infoList>
		<badge v-else-if="tabIdx == 2"></badge>
	</div>
</template>
<script>
	import pageTabs from "_c/tabs/pageTabs";
	import userList from "./plug/userList";
	import infoList from "./plug/infoList";
	import badge from "./plug/badge";
	export default {
		name: "wxMoments",
		props: {},
		components: { pageTabs, userList, infoList, badge },
		data() {
			return {
				tabIdx: 0,
				tabArr: [
					{
						id: 123,
						label: "圈住列表",
					},
					{
						id: 456,
						label: "内容管理",
					},
					{
						label: "角标设置",
					},
				],
			};
		},
		created() {},
		computed: {},
		watch: {},
		mounted() {},
		filters: {},
		activated() {},
		deactivated() {},
		methods: {
			tabChange(par) {
				console.log(par);
				this.tabIdx = par.index || 0;
			},
		},
	};
</script>
<style lang="less" scoped>
	.wx_moments_main {
		padding: 10px 20px 15px;
		position: relative;
	}
</style>
