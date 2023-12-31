module.exports = function (config) {
    if (config.devServer) {
      config.devServer.proxy = [
        {
          // proxy requests matching a pattern:
          path: "/api/**",
  
          // where to proxy to:
          target: "https://heeq0v05uh.execute-api.us-east-1.amazonaws.com/prod/",
  
          // optionally change Origin: and Host: headers to match target:
          changeOrigin: true,
          changeHost: true,
          secure: false,
  
          // optionally mutate request before proxying:
          pathRewrite: function (path, request) {
            // you can modify the outbound proxy request here:
            // delete req.headers.referer;
  
            // common: remove first path segment: (/api/**)
            return "/" + path.replace(/^\/[^\/]+\//, "");
          },
  
          // optionally mutate proxy response:
          // onProxyRes: function(proxyRes, req, res) {
          // you can modify the response here:
          // proxyRes.headers.connection = 'keep-alive';
          // proxyRes.headers['cache-control'] = 'no-cache';
          // }
        },
      ];
    }
  };