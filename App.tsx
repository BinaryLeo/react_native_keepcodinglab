
import React, { useCallback } from 'react';
import { ActivityIndicator, PaperProvider, Text } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import Router from "./src/routes";
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_500Medium, Poppins_100Thin } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import { View } from 'react-native';
import { Loader } from './src/components/loader';
export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_100Thin,
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: "center", gap:6 }}>
        <Loader />
        <Text>Loading settings...</Text>
      </View>);
  }
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <PaperProvider>
          <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <Router />
          </GestureHandlerRootView>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}