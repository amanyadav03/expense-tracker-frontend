import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import AddExpense from "./AddExpense/AddExpense";
import ViewExpensesScreen from "./ViewExpense/ViewExpense";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ExpenseTab = ()=>{
    const Tab = createBottomTabNavigator();
    return(
        <Tab.Navigator
        initialRouteName="AddExpense"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        var iconName;
                        if (route.name === 'AddExpense') {
                            iconName = 'cash-minus';
                        }
                        else {
                            iconName = 'shield-search';
                        }

                        return <Icon name={iconName} size={24} color='#0026b0' />;
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
            <Tab.Screen name="AddExpense" component={AddExpense} options={{headerShown:false, title:'Add expense'}}/>
            <Tab.Screen name="ViewExpense" component={ViewExpensesScreen} options={{headerShown:false, title:'View expense'}}/>
        </Tab.Navigator>
    );
}
export default ExpenseTab;