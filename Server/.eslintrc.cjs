module.exports = {
  env: { es2020: true, node: true, jest: true },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    allowImportExportEverywhere: true,
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  plugins: ['prettier'],
  rules: {
    // Common
    'no-console': 0, //
    'no-extra-boolean-cast': 0,
    'no-lonely-if': 1,
    'no-unused-vars': 1,
    'no-trailing-spaces': 1,
    'no-multi-spaces': 1,
    'no-multiple-empty-lines': 1,
    'space-before-blocks': ['error', 'always'],
    'object-curly-spacing': [1, 'always'],
    'indent': ['warn', 2],
    'semi': [0, 'never'], //
    'quotes': ['error', 'single'],
    'array-bracket-spacing': 1,
    'linebreak-style': 0,
    'no-unexpected-multiline': 'warn',
    'keyword-spacing': 1,
    'comma-dangle': 0, //
    'comma-spacing': 1,
    'arrow-spacing': 1,
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        trailingComma: 'all',
        endOfLine: 'auto',
        printWidth: 100,
      },
    ],
  },
};
