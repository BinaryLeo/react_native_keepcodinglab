// Desc: App routes for authenticated users
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthenticatedRoutes, } from "../../types/routes";
import { Home } from "../screens/home";
import { NewTicket } from "../screens/newTicket";
const SCREENNAME: AuthenticatedRoutes = {Home, NewTicket};
const { Navigator, Screen } = createStackNavigator();
export function AppRoutes() {
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: "#eaeaea"} 
        }}>
        {Object.entries(SCREENNAME).map(([key, val]) => (
          <Screen key={key} name={key} component={val} />
        ))}
      </Navigator>
    </NavigationContainer>
  );
}
