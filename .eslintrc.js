module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    'react-app',
  ],
  rules: {
    "@typescript-eslint/no-var-requires": "warn",
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@tager/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
  },
};
