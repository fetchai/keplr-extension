module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    ["@babel/plugin-transform-flow-strip-types"],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    "react-native-reanimated/plugin",
    [
      "transform-inline-environment-variables",
      {
        include: [
          "PROD_AMPLITUDE_API_KEY",
          "DEV_AMPLITUDE_API_KEY",
          "PROD_AUTH_CLIENT_ID",
          "DEV_AUTH_CLIENT_ID",
        ],
      },
    ],
  ],
};
