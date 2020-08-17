module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    '@typescript-eslint/no-use-before-define': 0,
    'no-use-before-define': 0,
    '@typescript-eslint/naming-convention': 0,
  },
};
