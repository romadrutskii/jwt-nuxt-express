module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  ignorePatterns: ['dist'],
  rules: {
    'import/prefer-default-export': 'off',
    'consistent-return': 'off',
  },
};
