
import * as React from "react";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
export const Loader = () => (
  <ActivityIndicator size={"large"} animating={true} color={MD2Colors.red800} />
);