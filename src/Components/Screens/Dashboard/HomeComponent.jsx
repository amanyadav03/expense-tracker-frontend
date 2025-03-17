import { CommonActions } from "@react-navigation/native";
import React from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";

const screenWidth = Dimensions.get("window").width;

// Mock data for demonstration
const mockData = {
  balance: 2450.50,
  income: 3200.00,
  expenses: 749.50,
  monthlyBudget: 1500.00,
  recentTransactions: [
    { id: '1', title: 'Grocery Shopping', amount: -85.20, date: '2023-03-15', category: 'Food', icon: 'food' },
    { id: '2', title: 'Salary Deposit', amount: 3200.00, date: '2023-03-10', category: 'Income', icon: 'cash-plus' },
    { id: '3', title: 'Electric Bill', amount: -120.50, date: '2023-03-08', category: 'Utilities', icon: 'flash' },
    { id: '4', title: 'Amazon Purchase', amount: -65.99, date: '2023-03-05', category: 'Shopping', icon: 'shopping' },
    { id: '5', title: 'Restaurant', amount: -42.80, date: '2023-03-03', category: 'Food', icon: 'food-fork-drink' },
  ],
  expenseCategories: [
    { name: 'Food', amount: 128.00, color: '#FF6384', icon: 'food' },
    { name: 'Transport', amount: 85.50, color: '#36A2EB', icon: 'car' },
    { name: 'Utilities', amount: 120.50, color: '#FFCE56', icon: 'flash' },
    { name: 'Shopping', amount: 65.99, color: '#4BC0C0', icon: 'shopping' },
    { name: 'Entertainment', amount: 42.80, color: '#9966FF', icon: 'movie' },
  ],
  monthlyData: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [500, 650, 750, 500, 600, 750],
        color: (opacity = 1) => `rgba(46, 91, 255, ${opacity})`,
        strokeWidth: 2
      }
    ]
  }
};

const HomeComponent = ({navigation}) => {
    const userName = useSelector((state)=>state.auth.userName);
  // Calculate percentage of budget used
  const budgetUsedPercentage = (mockData.expenses / mockData.monthlyBudget) * 100;
  
  // Format currency
  const formatCurrency = (amount) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Render transaction item
  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIconContainer}>
        <Icon name={item.icon} size={24} color={item.amount > 0 ? '#4CAF50' : '#F44336'} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionCategory}>{item.category} • {formatDate(item.date)}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: item.amount > 0 ? '#4CAF50' : '#F44336' }
      ]}>
        {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceTitle}>Total Balance</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Icon name="dots-horizontal" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceAmount}>${mockData.balance.toFixed(2)}</Text>
        <View style={styles.balanceDetails}>
          <View style={styles.balanceItem}>
            <Icon name="arrow-down" size={20} color="#4CAF50" />
            <View>
              <Text style={styles.balanceItemLabel}>Income</Text>
              <Text style={styles.balanceItemAmount}>${mockData.income.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceItem}>
            <Icon name="arrow-up" size={20} color="#F44336" />
            <View>
              <Text style={styles.balanceItemLabel}>Expenses</Text>
              <Text style={styles.balanceItemAmount}>${mockData.expenses.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Budget Progress */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Monthly Budget</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>Manage</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.budgetContainer}>
          <View style={styles.budgetInfo}>
            <Text style={styles.budgetLabel}>
              ${mockData.expenses.toFixed(2)} of ${mockData.monthlyBudget.toFixed(2)}
            </Text>
            <Text style={styles.budgetPercentage}>
              {budgetUsedPercentage.toFixed(0)}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${Math.min(budgetUsedPercentage, 100)}%` },
                budgetUsedPercentage > 90 ? { backgroundColor: '#F44336' } : {}
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
            <Icon name="cash-plus" size={24} color="#2196F3" />
          </View>
          <Text style={styles.actionText}>Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}
        onPress={()=>navigation.dispatch(
            CommonActions.navigate({ name: 'Expenses' })
          )}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#FFEBEE' }]}>
            <Icon name="cash-minus" size={24} color="#F44336" />
          </View>
          <Text style={styles.actionText}>Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
            <Icon name="chart-bar" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.actionText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
            <Icon name="calculator" size={24} color="#FF9800" />
          </View>
          <Text style={styles.actionText}>Budget</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={mockData.recentTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Expense Breakdown */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Expense Breakdown</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>Details</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoryList}>
          {mockData.expenseCategories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                <Icon name={category.icon} size={20} color={category.color} />
              </View>
              <View style={styles.categoryDetails}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryAmount}>{formatCurrency(category.amount)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Monthly Spending Trend */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Monthly Spending</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>More</Text>
          </TouchableOpacity>
        </View>
        
      </View>

      {/* Bottom padding */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  date: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
  },
  balanceCard: {
    backgroundColor: '#2e5bff',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 10,
    marginBottom: 15,
    shadowColor: '#2e5bff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  moreButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 10,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  balanceDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  balanceItemLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
  },
  balanceItemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  viewAll: {
    fontSize: 14,
    color: '#2e5bff',
    fontWeight: '500',
  },
  budgetContainer: {
    marginTop: 5,
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#4a5568',
  },
  budgetPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2e5bff',
    borderRadius: 5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#4a5568',
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f7fafc',
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    color: '#2d3748',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#718096',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryList: {
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    color: '#4a5568',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
  },
});

export default HomeComponent;