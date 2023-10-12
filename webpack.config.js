'use strict'
const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const TerserPlugin = require('terser-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

const config = {
  context: __dirname, // 指定webpack的工作目录
  target: 'node', // koa项目仅在node环境下运行
  entry: path.resolve(__dirname, 'src/index.ts'), // 打包模块入口文件
  // 打包的输出配置
  output: {
    clean: true, // 每次打包前清理输出文件夹
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'src'), // 指定loader要处理的目录
        exclude: ['/node_modules/'], // 排除的目录
      },
    ],
  },
  // 解析规则
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'], // 解析模块时应该搜索的目录
    extensions: ['.tsx', '.ts', '.jsx', '.js'], // 要解析的文件类型
    // 路径别名
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  externals: [nodeExternals()], // 打包时忽略node_modules中的第三方依赖
  plugins: [new webpack.ProgressPlugin()],
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
}

module.exports = () => {
  return isProd
    ? merge(config, {
        mode: 'production',
        stats: {
          children: false, // 是否添加关于子模块的信息
          warnings: false, // 禁用告警
        },
        // 优化配置
        optimization: {
          // 压缩配置
          minimize: true,
          minimizer: [new TerserPlugin()],
        },
      })
    : merge(config, {
        mode: 'development',
        devtool: 'eval-source-map',
        stats: {
          children: false, // 是否添加关于子模块的信息
          modules: false, // 不显示模块信息
        },
      })
}
