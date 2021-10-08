const path = require('path');
const webpack = require('webpack');

module.exports = {
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
    const babelOptions = {
      presets: [['react-app', { flow: false, typescript: true }], '@linaria'],
    };

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: babelOptions,
        },
        {
          loader: require.resolve('@linaria/webpack-loader'),
          options: {
            sourceMap: process.env.NODE_ENV !== 'production',
            babelOptions: babelOptions,
          },
        },
      ],
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

    return config;
  },
};
