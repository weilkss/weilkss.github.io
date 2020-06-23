const { override, addLessLoader, addWebpackAlias } = require('customize-cra');

process.env.GENERATE_SOURCEMAP = 'false';

const Func = () => (config, env) => {
  const loc = config.module.rules.findIndex(n => n.oneOf);
  config.module.rules[loc].oneOf = [
    {
      test: /\.md$/,
      use: [
        {
          loader: 'html-loader'
        },
        {
          loader: 'markdown-loader',
          options: {}
        }
      ]
    },
    ...config.module.rules[loc].oneOf
  ];
  return config;
};

module.exports = override(
  Func(),
  addWebpackAlias({
    // '@': path.resolve('./src')
  }),
  addLessLoader({
    javascriptEnabled: true
  })
);
