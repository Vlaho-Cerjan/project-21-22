// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  eslint: {
    dirs: ['.'],
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: true,
  sassOptions: {},
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: [
      '@googlemaps/js-api-loader',
      '@googlemaps/markerclusterer',
      '@react-google-maps/api',
      'react-google-maps/marker-clusterer',
      'ag-grid-community',
      'ag-grid-enterprise',
      'ag-grid-react',
      'animate-css-grid',
      'axios',
      'next-auth',
      '@reduxjs/toolkit',
      'cropperjs',
      'intl-tel-input',
      'dotenv',
      'fuse.js',
      'html-react-parser',
      'rc-dropdown',
      'rc-slider',
      'react-color',
      'react-cropper',
      'react-datepicker',
      'react-toastify',
      'react-tooltip',
      'swiper',
      'usehooks-ts',
      'next-nprogress-bar',
      'planby',
      'swagger-ui-react',
    ],
  },
  compress: true,
});
