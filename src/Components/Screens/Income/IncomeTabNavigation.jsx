import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AddIncomeScreen from "./AddIncome/AddIncome";
import ViewIncomeScreen from "./ViewIncome/ViewIncome";

const IncomeTab = ()=>{
    const Tab = createBottomTabNavigator();
    return(
        <Tab.Navigator
        initialRouteName="AddIncomeScreen"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        var iconName;
                        if (route.name === 'AddIncomeScreen') {
                            iconName = 'cash-plus';
                        }
                        else {
                            iconName = 'shield-search';
                        }

                        return <Icon name={iconName} size={24} color='#4caf50' />;
                    },
                    tabBarActiveTintColor: '#000',
                    tabBarInactiveTintColor: '#999',
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        height: 80, // Increase height of the tab bar
                        borderTopWidth: 0,
                        paddingBottom: 15,
                        borderTopLeftRadius: 20, // Adjust padding for better alignment
                        borderTopRightRadius: 20,
                    },
                    tabBarHideOnKeyboard: true,
                    tabBarLabelStyle: {
                        fontSize: 16,
                        fontWeight: 'light',
                        marginBottom: 1, // Margin for better spacing
                    },
                    tabBarItemStyle: {
                        marginVertical: 1, // Additional margin for item spacing
                    },
                })}>
            <Tab.Screen name="AddIncomeScreen" component={AddIncomeScreen} options={{headerShown:false, title:'Add Income'}}/>
            <Tab.Screen name="ViewIncomeScreen" component={ViewIncomeScreen} options={{headerShown:false, title:'View Income'}}/>
        </Tab.Navigator>
    );
}
export default IncomeTab;