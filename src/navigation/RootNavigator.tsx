import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabsNavigator from "./BottomTabsNavigator";
import Home from "../screens/Home";
import FavoritesScreen from "../screens/favoritescreen";

export type RootStackParamList = {
  Root: undefined;
  Home: undefined;
  Favorite: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={BottomTabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Favorite" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}