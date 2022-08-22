require('ignore-styles');

require('@babel/register')({
  ignore: [/(node_module)/],
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  extensions: ['.js', '.ts', '.tsx'],
});

require('./server');
