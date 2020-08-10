module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".json", ".ts", ".tsx"]
        }
      ]
    ],
    presets: ["babel-preset-expo"]
  };
};
