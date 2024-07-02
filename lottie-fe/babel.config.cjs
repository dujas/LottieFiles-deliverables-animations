// For jest to convert source files and run
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { esmodules: true },
        bugfixes: true,
      },
    ],
    "@babel/preset-typescript",
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: [["module-resolver", { alias: { "@": "./src" } }]],
  env: {
    test: {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-typescript",
        ["@babel/preset-react", { runtime: "automatic" }],
        "babel-preset-vite",
      ],
    },
  },
};
