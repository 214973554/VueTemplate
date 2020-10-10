<template>
	<el-tabs v-model="actName" @tab-click="tabClick" class="tabs_css">
		<el-tab-pane
			v-for="(item,index) in tabArr"
			:key="'tabs'+index"
			:label="item[keyLabel]"
			:name="''+index"
		></el-tab-pane>
	</el-tabs>
</template>
<script>
	export default {
		name: "pageTabs",
		props: {
			tabIndex: {
				type: Number,
				default: 0,
			},
			tabArr: {
				type: Array,
				required: true,
			},
			keyLabel: {
				type: String,
				default: "label",
			},
			keyName: {
				type: String,
				default: "name",
			},
		},
		components: {},
		data() {
			return {
				actName: "0",
			};
		},
		created() {
			this.actName = "" + this.tabIndex || "0";
		},
		computed: {},
		watch: {},
		mounted() {},
		filters: {},
		activated() {},
		deactivated() {},
		methods: {
			tabClick() {
				let par = {
					index: Number(this.actName || 0),
					item: this.tabArr[this.actName],
				};
				this.$emit("tab-click", par);
			},
		},
	};
</script>
<style lang="less" scoped>
	.tabs_css {
		min-width: 750px;
	}
</style>
