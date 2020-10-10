
const path = require("path");
const resolve = dir => {
	return path.join(__dirname, dir);
};
const Timestamp = new Date().getTime();
// 覆盖默认的webpack配置
function addStyleResource(rule) {
	rule.use("style-resource")
		.loader("style-resources-loader")
		.options({
			patterns: [
				path.resolve(__dirname, "src/assets/css/share.less"), // 需要全局导入的less
			],
		});
}
module.exports = {
	outputDir: process.env.NODE_ENV === "pro" ? 'dist/Beta.HomePC_主站manage' : 'dist/manage_测试',
	publicPath: "/Beta.HomePC/manage",
	// 输出文件目录
	lintOnSave: false,
	runtimeCompiler: false,
	// webpack配置
	chainWebpack: config => {
		const types = ["vue-modules", "vue", "normal-modules", "normal"];
		types.forEach(type => addStyleResource(config.module.rule("less").oneOf(type)));
		config.resolve.alias.set("@", resolve("src")).set("_c", resolve("src/components"));
	},
	configureWebpack: config => {
		let outputPro = {
			// 输出重构  打包编译后的 文件名称  【模块名称.时间戳】
			filename: `js/[name].${Timestamp}.js`,
			chunkFilename: `js/[name].${Timestamp}.js`,
		};
		config.output = Object.assign(config.output, outputPro);
	},
	// 生产环境是否生成 sourceMap 文件
	productionSourceMap: true,
	// css相关配置
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		extract: ['production', 'test'].includes(process.env.NODE_ENV),
		// 开启 CSS source maps?
		sourceMap: false,
		// css预设器配置项
		loaderOptions: {
		},
		// 启用 CSS requireModuleExtension for all css / pre-processor files.
		requireModuleExtension: true,
	},
	pwa: {
		iconPaths: {
			favicon16: "favicon.ico",
			favicon32: "favicon.ico",
		},
	},
	devServer: {
		host: "172.17.12.74",
		port: 8088,
		https: false,
		disableHostCheck: true,
		// historyApiFallback: true,
		inline: true,
		sockPath: "/Beta.HomePC/manage/sockjs-node",
		publicPath: "/Beta.HomePC/manage/",
		public: "wliu.test.betawm.com/Beta.HomePC/manage",
	}
}
