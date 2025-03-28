import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Components/Screens/Login/Login/Login";
import { useSelector } from "react-redux";
import DrawerNavigation from "../Components/Generic/DrawerNavigator/DrawerNavigator";
import RegisterScreen from "../Components/Screens/Login/Register/Register";

const Router = () => {
    const token = useSelector((state) => state.auth.token);
    console.log("Token:", token);

    const Stack = createStackNavigator();

    return (
        // <NavigationContainer independent={true}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {token ? (
                    <Stack.Screen name="drawer" component={DrawerNavigation} />
                ) : (
                    <>
                    <Stack.Screen name = "login" component={Login} />
                    <Stack.Screen name = 'register' component={RegisterScreen}/>
                    </>
                )}
            </Stack.Navigator>
        // </NavigationContainer>
    );
};

export default Router;
