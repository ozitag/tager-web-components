const url = require('@rollup/plugin-url');
const svgr = require('@svgr/rollup').default;

module.exports = {
  rollup(config, options) {
    config.plugins = [
      url(),
      svgr({
        svgo: false,
        titleProp: true,
        ref: true,
      }),
      ...config.plugins,
    ];

    return config;
  },
};
