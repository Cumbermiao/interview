module.exports = {
  mode:'production',
  optimization: {
    concatenateModules:false, //webpack bundle analysis 时防止小文件合并提升
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       test: /node_modules/,
    //       chunks: 'all',
    //       enforce:true,
    //       name: module => {
    //         const packageName = module.context.match(
    //           /[\\/]node_modules[\\/](.*?)([\\/]|$)/
    //         )[1];
    //         if (packageName.match(/(ant\-design|antd)/)) return 'common-ui';
    //         return 'common';
    //       },
    //     },
    //     'common-ui': {
    //         chunks: 'all',
    //         minChunks:2,
    //         test:/src\\styles/,
    //         name:'common-ui'
    //     }
    //   }
    // }
  },
};
