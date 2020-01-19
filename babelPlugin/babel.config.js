module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "58",
          ie: "11"
        },
        useBuiltIns: "usage"
      }
    ],
    // "@babel/preset-react",

  ],
  plugins: ["./util/babel-flow"],
  exclude:"node_modules/*",
  babelrcRoots:['./src',"node_modules/react/*","node_modules/react-dom/*"]
  // include:["node_modules/react/*","node_modules/react-dom/*"]
}