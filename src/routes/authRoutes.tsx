// Desc: Auth routes for unauthenticated users
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Signin } from "../screens/signin";
import { Signup } from "../screens/signup";
import { Recovery } from "../screens/recovery";
import { UnauthenticatedRoutes } from "../../types/routes";
const SCREENNAME: UnauthenticatedRoutes = {
  Signin,
  Signup,
  Recovery,
};
const { Navigator, Screen } = createStackNavigator();
export function AuthRoutes() {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{headerShown: false, cardStyle: { backgroundColor: "#eaeaea"}}}>
        {Object.entries(SCREENNAME).map(([key, val]) => (
          <Screen key={key} name={key} component={val} />
        ))}
      </Navigator>
    </NavigationContainer>
  );
};
