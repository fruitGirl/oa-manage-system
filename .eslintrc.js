module.exports = {
  extends: ['eslint:recommended', 'umi'],
  env: {
    browser: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
      modules: true
    }
  },
  globals: {
    T: true,
    PropTypes: true,
    axios: true,
    CONFIG: true,
    ReactDOM: true,
    React: true,
    antd: true,
    $: false,
    echarts: true,
    jQuery: true,
    jquery: true,
    variableNameAndValueMap: true
    // window: true,
    // document: true,
  },
  rules: {
    'no-debugger': ['off'],
    'react/no-find-dom-node': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'no-script-url': 'off',
    'semi': ["warn"]
  }
};
