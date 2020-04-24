const { override, addLessLoader } = require('customize-cra');

process.env.GENERATE_SOURCEMAP = 'false';

module.exports = override(
	addLessLoader({
		javascriptEnabled: true,
	})
);
