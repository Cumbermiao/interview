module.exports = {
  babelrcRoots:["./node_modules/react/*","./node_modules/react-dom/*",],
  presets: [
      [
          "@babel/preset-env",
          {
            useBuiltIns: "usage",
            modules:'commonjs',
            corejs:2
          }
      ],
      "@babel/preset-react",
  ],
  plugins: ['./conf/babel-flow']
}