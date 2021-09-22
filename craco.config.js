const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: { '@Color-primary': 'red' }, // customize var in src/less/..
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};