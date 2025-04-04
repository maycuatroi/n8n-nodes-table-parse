module.exports = {
  extends: [
    'plugin:n8n-nodes-base/community',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'n8n-nodes-base/node-param-description-missing-for-return-all': 'off',
    'n8n-nodes-base/node-class-description-empty-description': 'off',
  },
  ignorePatterns: ['node_modules/', 'dist/'],
}; 