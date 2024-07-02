module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  settings: {},
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-console': 'error',
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-param-reassign': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': [
      'warn',
      {
        allowArgumentsExplicitlyTypedAsAny: true,
      },
    ],
    '@typescript-eslint/no-inferrable-types': [
      'error',
      {
        // MikroOrm and class-transformer need explicit types.
        ignoreProperties: true,
      },
    ],
  },
  overrides: [
    {
      files: ['src/utils/testing/**/*'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 0,
      },
    },
  ],
  ignorePatterns: ['build/'],
};
