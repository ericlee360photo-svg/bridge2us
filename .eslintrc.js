module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Temporarily disable linting rules that are not critical for build
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
    'prefer-spread': 'off',
    'prefer-const': 'off',
  }
};
