module.exports = {
  root: true,
  extends: [require.resolve('@gera2ld/plaid/eslint')],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
