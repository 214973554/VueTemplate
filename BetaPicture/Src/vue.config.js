const path = require("path");
const webpack = require("webpack");

const Timestamp = new Date().getTime();
const resolve = dir => {
	return path.join(__dirname, dir);
};
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
	publicPath: "/Beta.HomePC/BetaPicture",
	// 输出文件目录
	outputDir: process.env.NODE_ENV == 'pro' ? "dist/Beta.HomePC-BetaPicture-主站" : "dist/Beta.HomePC-BetaPicture-测试",
	// eslint-loader 是否在保存的时候检查
	lintOnSave: true,
	runtimeCompiler: false,
	// 生产环境是否生成 sourceMap 文件
	productionSourceMap: false,
	chainWebpack: config => {
		const types = ["vue-modules", "vue", "normal-modules", "normal"];
		types.forEach(type => addStyleResource(config.module.rule("less").oneOf(type)));
		config.resolve.alias.set("@", resolve("src")).set("_c", resolve("src/components"));

		config.module.rules.delete("svg");
		config.module
			.rule("svg-sprite-loader")
			.test(/\.svg$/)
			.include.add(resolve("src/assets/svg"))
			.end()
			.use("svg-sprite-loader")
			.loader("svg-sprite-loader")
			.options({
				symbolId: "icon-[name]",
			});
	},
	configureWebpack: config => {
		let pluginsPro = [
			new webpack.DefinePlugin({
				"process.env.SERVERS_ENV": JSON.stringify({
					WXAuthShare: process.env.VUE_APP_weixin,
					DCAPI: process.env.VUE_APP_dcApi,
					wxwork: process.env.VUE_APP_wxwork,
					LeadsMWeb: process.env.VUE_APP_BetaLeadsMWeb,
					WebPC: process.env.VUE_APP_BetaWebPC,
					FileService: process.env.VUE_APP_BetaFileService,
					HomeWebAPI: process.env.VUE_APP_BetaHomeWebAPI,
					VipManagerApi: process.env.VUE_APP_BetaVipManagerApi,
				}),
			}),
		];
		//生产环境
		if (process.env.NODE_ENV === "production") {
			config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
			// config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;//干掉所有console
			config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
			config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
				"console.log",
				"console.info",
				"console.warn",
			];
		}
		let outputPro = {
			// 输出重构  打包编译后的 文件名称  【模块名称.时间戳】
			filename: `js/[name].${Timestamp}.js`,
			chunkFilename: `js/[name].${Timestamp}.js`,
		};
		config.output = Object.assign(config.output, outputPro);
		config.plugins = [...config.plugins, ...pluginsPro];
	},
	// css相关配置
	css: {
		// 开启 CSS source maps?
		sourceMap: false,
		loaderOptions: {
			less: {
				javascriptEnabled: true,
			},
		},
	},
	devServer: {
		host: "0.0.0.0",
		port: 8509,
		https: false,
		// proxy: 'http://50.test.betawm.com'
		proxy: {
			"/Beta.HomeWebAPI": {
				target: "http://50.test.betawm.com",
				ws: true, // 是否启用websockets
				secure: false, //是否需要SSL证书认证
				changeOrigin: true, //开启代理：在本地创建一个虚拟服务端，这样服务端和服务端就不会有跨域问题
				pathRewrite: {
					// "^/Beta.BigDataTagAPI": "",
				},
			},
			'/Beta.FileService': {
				target: "http://50.test.betawm.com",
				ws: true, // 是否启用websockets
				secure: false, //是否需要SSL证书认证
				changeOrigin: true, //开启代理：在本地创建一个虚拟服务端，这样服务端和服务端就不会有跨域问题
				pathRewrite: {
					// "^/Beta.BigDataTagAPI": "",
				},
			},


		},
	},

	pwa: {
		iconPaths: {
			favicon16: "favicon.ico",
			favicon32: "favicon.ico",
		},
	},
};
