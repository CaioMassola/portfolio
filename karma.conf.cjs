/* eslint-disable @typescript-eslint/no-require-imports */
/* global require, process, module, __dirname */
const path = require('node:path');

process.env.CHROME_BIN =
  process.env.CHROME_BIN ||
  (process.env.CI
    ? require('playwright').chromium.executablePath()
    : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe');

module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    files: ['tests/unit/**/*.spec.tsx'],
    preprocessors: {
      'tests/unit/**/*.spec.tsx': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.ts', '.tsx', '.js'] },
      module: {
        rules: [
          {
            test: /\.[tj]sx?$/,
            include: path.resolve(__dirname, 'src'),
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '120' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                  '@babel/preset-typescript',
                ],
                plugins: ['istanbul'],
              },
            },
          },
          {
            test: /\.[tj]sx?$/,
            include: path.resolve(__dirname, 'tests'),
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '120' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                  '@babel/preset-typescript',
                ],
              },
            },
          },
        ],
      },
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: path.join(__dirname, 'coverage', 'karma'),
      reporters: [
        { type: 'text-summary' },
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
      ],
      check: {
        global: { statements: 100, branches: 100, functions: 100, lines: 100 },
        each: { statements: 100, branches: 100, functions: 100, lines: 100 },
      },
    },
    customLaunchers: {
      EdgeHeadless: {
        base: 'ChromeHeadless',
        flags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
      },
    },
    browsers: ['EdgeHeadless'],
    singleRun: true,
    browserNoActivityTimeout: 30000,
  });
};
