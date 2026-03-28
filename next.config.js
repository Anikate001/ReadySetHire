/** @type {import('next').NextConfig} */
const webpack = require('webpack');

module.exports = {
    experimental: {
      serverActions: {
        bodySizeLimit: '25mb',
      },
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Exclude Node.js built-in modules from client-side bundle
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          child_process: false,
          'node:child_process': false,
          'node:fs': false,
          'node:net': false,
          'node:tls': false,
          'node:path': false,
          'node:os': false,
          'node:crypto': false,
          'node:util': false,
          'node:buffer': false,
          'node:stream': false,
          'node:events': false,
          'node:url': false,
          'node:http': false,
          'node:https': false,
        };
        
        // Ignore all node: protocol imports for client-side bundle
        config.plugins.push(
          new webpack.IgnorePlugin({
            resourceRegExp: /^node:/,
          })
        );
      }
      return config;
    },
  }