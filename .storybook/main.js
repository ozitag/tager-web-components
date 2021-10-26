const path = require('path');
const webpack = require('webpack');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../src/**/*.stories.@(tsx)'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
      },
    },
  ],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        presets: [['react-app', { flow: false, typescript: true }]],
      },
    });
    config.resolve.extensions.push('.ts', '.tsx');

    /** Support import svg as React component */
    config.module.rules.unshift({
      test: /\.svg$/,
      use: ['@svgr/webpack?-svgo,+titleProp,+ref![path]', 'url-loader'],
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.__NEXT_PLUGINS': JSON.stringify(false),
      })
    );

    config.module.rules.push({
      test: /\.pcss$/,
      sideEffects: true,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
            modules: {
              localIdentName: '[name]_[local]__[hash:base64:5]',
            },
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            postcssOptions: {
              plugins: [require('autoprefixer'), require('postcss-nesting')],
            },
            implementation: require('postcss'),
          },
        },
      ],
    });

    const pcssRule = config.module.rules.find(
      (rule) => String(rule.test) === '/\\.pcss$/'
    );

    console.log('cssRule', pcssRule.use);
    console.log('cssRule', pcssRule.use[2]);
    return config;
  },
};
