<template>
	<div class="badge">
		<el-form size="mini">
			<el-row
				v-for="appTabType in tabTypeBadges"
				:gutter="20"
				:key="appTabType.TabNameFull"
			>
				<el-col :span="12"
					><el-form-item
						:label="appTabType.TabNameFull"
						label-width="150px"
						><el-input
							v-model="appTabType.Badge"
							placeholder="请输入角标内容"
							maxlength="2"
							show-word-limit="show-word-limit"
						></el-input></el-form-item
				></el-col>
				<el-col :span="8">
					<el-form-item label="开启/隐藏">
						<el-switch
							v-model="appTabType.BadgeShow"
							active-color="#13ce66"
							inactive-color="#ff4949"
						></el-switch>
						<el-tooltip
							placement="right"
							effect="light"
							class="btnsave"
						>
							<div slot="content">
								<el-badge
									:value="appTabType.Badge"
									class="badge-item"
									size="mini"
									:hidden="!appTabType.BadgeShow"
								>
									<el-button type="primary" size="mini">{{
										appTabType.TabName
									}}</el-button>
								</el-badge>
							</div>
							<el-button
								class="btnSave"
								type="primary"
								size="mini"
								@click="save(appTabType)"
								>保存</el-button
							>
						</el-tooltip>
					</el-form-item>
				</el-col>
				<el-col :span="4"></el-col>
			</el-row>
		</el-form>
	</div>
</template>
<script>
	export default {
		name: "badge",
		props: {},
		components: {},
		data() {
			return {
				tabTypeBadges: [],
			};
		},
		created() {
			this.initAppTabTypeBadge();
		},
		computed: {},
		watch: {},
		mounted() {},
		filters: {},
		activated() {},
		deactivated() {},
		methods: {
			initAppTabTypeBadge: function () {
				this.$store
					.dispatch("badge/InitAppTabTypeBadge")
					.then((res) => {
						if (res.State === 0) {
							var data = res.Data;
							if (data != null && data.length > 0) {
								this.tabTypeBadges = data.map(function (item) {
									if (item.AppType === 1) {
										item.TabNameFull =
											item.TabName + "(理财师APP)";
									} else if (item.AppType === 4) {
										item.TabNameFull =
											item.TabName + "(保险APP)";
									}

									return item;
								});
							}
						}
					})
					.catch((err) => {
						console.error(err);
					});
			},
			save: function (appTabType) {
				if (!appTabType.Badge || appTabType.Badge.trim().length === 0) {
					this.$message.warning("请输入角标内容");
					return false;
				}
				this.$store
					.dispatch("badge/Save", appTabType)
					.then((res) => {
						if (res.State === 0) {
							var data = res.Data;
							if (data) {
								this.$message.success("保存成功。");
							} else {
								this.$message.error("保存失败。");
							}
						}
					})
					.catch((err) => {
						console.error(err);
						this.$message.error("保存失败。");
					});
			},
		},
	};
</script>
<style lang="less" scoped>
	.badge {
		.btnsave {
			margin-left: 10px;
		}
	}
</style>
