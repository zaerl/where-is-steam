module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: 'eslint:recommended',
  rules: {
    'no-empty': 0,
    indent: [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error',
      'single',
      {
        'allowTemplateLiterals': true
      }
    ],
    'semi': [
      'error',
      'always'
    ],
    'no-unused-vars': [
      2, {
        args: 'none'
      }
    ],
    indent: [
      2,
      2,
      {
        SwitchCase: 1
      }
    ]
  }
};
