module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@api': './src/api',
            '@context': './src/context',
            '@utils': './src/utils',
            '@types': './src/types',
          },
        },
      ],
    ],
  };
};
