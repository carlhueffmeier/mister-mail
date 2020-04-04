const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: slsw.lib.webpack.isLocal
    ? 'cheap-module-eval-source-map'
    : 'source-map',
  resolve: {
    extensions: ['.mjs', '.json', '.ts'],
    symlinks: false,
    cacheWithContext: false,
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  externals: [
    // These packages create an indirect dependency on the aws-sdk.
    // Specifying these dependencies here turns them into 1st-level dependencies,
    // which allows the `forceExclude` setting in serverless.yml to purge the aws-sdk
    // dependency from the build artifact.
    // See https://github.com/serverless-heaven/serverless-webpack/issues/292#issuecomment-348755231
    nodeExternals({
      whitelist: [
        '@dazn/lambda-powertools-dynamodb-client',
        '@dazn/lambda-powertools-sns-client',
      ],
    }),
  ],
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: true,
      eslintOptions: {
        cache: true,
      },
    }),
  ],
};
