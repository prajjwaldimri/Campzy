module.exports = {
  plugins: ['security'],
  extends: ['airbnb-base', 'plugin:vue/essential', 'plugin:security/recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    allowImportExportEverywhere: true,
  },
};
