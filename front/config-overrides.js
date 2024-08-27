const { overrideDevServer } = require('customize-cra');

module.exports = {
  devServer: overrideDevServer((config) => {
    return {
      ...config,
      allowedHosts: 'all',  // 이 줄을 추가
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }

        // 기존 onBeforeSetupMiddleware 및 onAfterSetupMiddleware 로직을 여기에 추가

        return middlewares;
      }
    };
  }),
};