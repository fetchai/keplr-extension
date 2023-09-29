/**
 * @format
 */

// import Bugsnag from "@bugsnag/react-native";
// import BugsnagPluginReactNavigation from "@bugsnag/plugin-react-navigation";
// import { codeBundleId } from "./bugsnag.env";

// Bugsnag.start({
//   plugins: [new BugsnagPluginReactNavigation()],
//   codeBundleId,
// });

import "./shim";

import "text-encoding";

import "react-native-gesture-handler";

import "react-native-url-polyfill/auto";

import { AppRegistry } from "react-native";
import Instabug, { InvocationEvent } from "instabug-reactnative";

import "./init";

// The use of "require" is intentional.
// In case of "import" statement, it is located before execution of the next line,
// so `getPlugin()` can be executed before `Bugsnag.start()`.
// To prevent this, "require" is used.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const App = require("./src/app").App;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const appName = require("./app.json").name;

Instabug.init({
  token: "cf467aa7beed2839b3ec0d23f83b4580",
  invocationEvents: [
    InvocationEvent.shake,
    InvocationEvent.screenshot,
    InvocationEvent.floatingButton,
  ],
});

AppRegistry.registerComponent(appName, () => App);
