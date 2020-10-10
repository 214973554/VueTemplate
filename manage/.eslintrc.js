module.exports = {
	root: true,
	extends: ["plugin:vue/essential"],
	rules: {
		"no-console": process.env.NODE_ENV === "pro" ? "error" : "off",
		"no-debugger": process.env.NODE_ENV === "pro" ? "error" : "off",
		"no-alert": process.env.NODE_ENV === "pro" ? "error" : "off",
		"quotes": 0,
		"semi": 0,
		"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
		"eol-last": 0,
		"no-var": "error",
	},
	parserOptions: {
		parser: "babel-eslint",
	},
};

