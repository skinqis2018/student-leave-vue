// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    node: true,
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  rules: {
    'generator-star-spacing': 'off',
    'no-debugger': 'error',
    'no-console': 'off',
    'no-irregular-whitespace': 'off'
  }
}
