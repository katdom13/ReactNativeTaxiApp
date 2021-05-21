module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    semi: 0,
    'react-native/no-inline-styles': 0,
    'prettier/prettier': [
      'error',
      {
        'no-inline-styles': false,
      },
    ],
    'react-hooks/exhaustive-deps': 0,
    'no-shadow': 'off',
  },
}
