import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import HomeComponent from "../../Screens/Dashboard/HomeComponent";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { removeToken } from "../../../Redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddExpense from "../../Screens/Expense/AddExpense/AddExpense";
import ExpenseTab from "../../Screens/Expense/ExpenseTabNavigation";

function CustomDrawerContent(props) {
    const dispatch = useDispatch();
  const navigation = useNavigation();
  const userName = useSelector((state)=>state.auth.userName);
  const role = useSelector((state)=>state.auth.role);
  const handleLogout = async() => {
    dispatch(removeToken());
    await AsyncStorage.removeItem('authToken');
  };

  return (
    <View style={styles.drawerContainer}>
      {/* User Profile Section */}
      <View style={styles.userSection}>
        <Image
          source={{ uri: "https://via.placeholder.com/80" }}
          style={styles.userImage}
        />
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{role}</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>$2,450.50</Text>
        </View>
      </View>

      {/* Drawer Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Footer Section */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={22} color="#e53e3e" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const DrawerNavigation = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2e5bff",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerActiveTintColor: "#2e5bff",
        drawerInactiveTintColor: "#4a5568",
        drawerLabelStyle: {
          fontSize: 16,
        },
        drawerStyle:{
          width:300
        }
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeComponent}
        options={{
          title: "Dashboard",
          drawerIcon: ({ color }) => <Icon name="view-dashboard" size={22} color={color} />,
        }}
      />
       <Drawer.Screen
        name="Expenses"
        component={ExpenseTab}
        options={{
          drawerIcon: ({ color }) => <Icon name="cash-minus" size={22} color={color} />,
        }}
      />
      {/*<Drawer.Screen
        name="Income"
        component={IncomeScreen}
        options={{
          drawerIcon: ({ color }) => <Icon name="cash-plus" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          drawerIcon: ({ color }) => <Icon name="calculator" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          drawerIcon: ({ color }) => <Icon name="chart-bar" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => <Icon name="cog" size={22} color={color} />,
        }}
      /> */}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  userSection: {
    padding: 20,
    backgroundColor: "#2e5bff",
    alignItems: "center",
    paddingTop:60,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "white",
  },
  userName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 3,
  },
  userEmail: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginBottom: 15,
  },
  balanceContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  balanceLabel: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    marginBottom: 5,
  },
  balanceAmount: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  drawerItemsContainer: {
    paddingTop: 10,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 30,
    color: "#e53e3e",
  },
});

export default DrawerNavigation;