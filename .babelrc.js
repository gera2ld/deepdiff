module.exports = {
  extends: require.resolve('@gera2ld/plaid/config/babelrc-base'),
  presets: [
    '@babel/preset-typescript',
  ],
  plugins: [

    process.env.BABEL_ENV === 'test' && 'istanbul',
  ].filter(Boolean),
};
