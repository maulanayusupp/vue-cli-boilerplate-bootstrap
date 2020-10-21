/* eslint-disable global-require */
process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
	pwa: {
		name: 'MariMoro',
		msTileColor: '#FFFFFF',
		workboxOptions: {
			skipWaiting: true,
		},
	},
	configureWebpack: {
		output: {
			globalObject: 'this', // `typeof self !== 'undefined' ? self : this`'' -- not working
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
			},
		},
	},
	transpileDependencies: [],
	chainWebpack: (config) => {
		config
			.plugin('provide')
			.use(require('webpack').ProvidePlugin, [{
				$: 'jquery',
				jquery: 'jquery',
				jQuery: 'jquery',
				'window.jQuery': 'jquery',
				Popper: ['popper.js', 'default'],
				// In case you imported plugins individually, you must also require them here:
				Util: 'exports-loader?Util!bootstrap/js/dist/util',
				Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
			}]);
	},
};
