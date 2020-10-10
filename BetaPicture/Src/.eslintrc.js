module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ["plugin:vue/essential", "@vue/prettier"],
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-alert": process.env.NODE_ENV === "production" ? "error" : "off",
		quotes: 0,
		semi: 0,
		"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
		"eol-last": 0,
		"no-var": "error",
		"prettier/prettier": 3,
	},
	parserOptions: {
		parser: "babel-eslint",
	},
};
