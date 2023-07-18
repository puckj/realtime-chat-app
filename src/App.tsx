import { registerRootComponent } from "expo";
import { LogBox } from "react-native";
import RootStackNavigator from "./navigation/RootStackNavigator";
import { Provider } from "react-redux";
import { store } from "./store/store";

LogBox.ignoreLogs([
  `Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property. This API will be removed in SDK 45.`,
]);

export default function App() {
  return (
    <>
      <Provider store={store}>
        <RootStackNavigator />
      </Provider>
    </>
  );
}

registerRootComponent(App);
