import { Suspense, useEffect } from "react";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { TamaguiProvider, Text, Theme } from "tamagui";
import { Provider } from "react-redux";

import config from "../tamagui.config";
import { store } from "@/redux/store";
import Toast from "react-native-toast-message";
import { WebsocketProvider } from "@/contexts/socket-provider";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <TamaguiProvider config={config}>
      <Suspense fallback={<Text>Loading...</Text>}>
        <Theme name={colorScheme}>
          <ThemeProvider
            value={colorScheme === "light" ? DefaultTheme : DarkTheme}
          >
            <Provider store={store}>
              <WebsocketProvider>
                <Slot />
              </WebsocketProvider>
            </Provider>
            <Toast topOffset={65} />
          </ThemeProvider>
        </Theme>
      </Suspense>
    </TamaguiProvider>
  );
}
