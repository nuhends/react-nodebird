// gzip 으로 압축 (브라우저에 압축 푸는 기능 존재)
// const CompressPlugin = require('compress-webpack-plugin');

// cross-env ANALYZE=true NODE_ENV=production next build 시
// 1. ANALYZE=true가 true가 됨, enabled가 true가 됨
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  compress: true,
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';
    const plugins = [
      ...config.plugins,
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^\.\/ko$/)
    ];

    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'eval',
      plugins,
    }
  }
});
