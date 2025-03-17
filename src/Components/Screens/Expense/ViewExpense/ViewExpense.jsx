import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getExpenses } from "../../../../Services/api";
import { useSelector } from "react-redux";

const ViewExpensesScreen = ({ navigation }) => {
  // States for expenses data and UI control
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSorting, setActiveSorting] = useState("newest");
  const [groupBy, setGroupBy] = useState("date"); // 'date', 'category', 'paymentMethod'
  const [totalExpenses, setTotalExpenses] = useState(0);

  const token = useSelector((state)=>state.auth.token);
  // Animation value for filter button
  const animatedValue = new Animated.Value(0);
  const animatedRotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });


  // Category icons mapping
  const categoryIcons = {
    "utilities": "flash",
    "food & dining": "food",
    "housing": "home",
    "shopping": "shopping",
    "transportation": "car",
    "entertainment": "movie",
    "healthcare": "medical-bag",
    "subscriptions": "refresh",
    "education": "school",
    "personal care": "face-man",
    "other": "dots-horizontal",
  };

  // Payment method icons mapping
  const paymentMethodIcons = {
    "Cash": "cash",
    "Credit Card": "credit-card",
    "Debit Card": "credit-card-outline",
    "Bank Transfer": "bank",
    "Mobile Payment": "cellphone",
    "Health Insurance": "shield-plus",
  };

  // Fetch expenses data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      fetchExpense();
    }, 1000);
  }, []);

  const fetchExpense =async()=>{
    setLoading(true);
    try{
      if(!token){
        Alert.alert('Login Again!!');
        return;
      }
      const response  = await getExpenses(token)
      if(response.status === 200){
        setExpenses(response.data.expenses);
        setFilteredExpenses(response.data.expenses);
      calculateTotalExpenses(response.data.expenses);
      }
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);

    }
  }
  // Calculate total expenses
  const calculateTotalExpenses = (expensesList) => {
    const total = expensesList.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpenses(total);
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      fetchExpense();
      setRefreshing(false);
    }, 1000);
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      applyFiltersAndSorting(expenses, activeFilter, activeSorting);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = expenses.filter(
        (expense) =>
          expense.description.toLowerCase().includes(lowercasedQuery) ||
          expense.category.toLowerCase().includes(lowercasedQuery) ||
          expense.paymentMethod.toLowerCase().includes(lowercasedQuery) ||
          expense.amount.toString().includes(lowercasedQuery)
      );
      applyFiltersAndSorting(filtered, activeFilter, activeSorting);
    }
  }, [searchQuery, expenses, activeFilter, activeSorting]);

  // Apply filters and sorting
  const applyFiltersAndSorting = (data, filter, sort) => {
    // Apply category filter
    let filteredData = [...data];
    if (filter !== "all") {
      filteredData = filteredData.filter((expense) => expense.category === filter);
    }

    // Apply sorting
    switch (sort) {
      case "newest":
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "highest":
        filteredData.sort((a, b) => b.amount - a.amount);
        break;
      case "lowest":
        filteredData.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }

    setFilteredExpenses(filteredData);
    calculateTotalExpenses(filteredData);
  };

  // Toggle filter modal with animation
  const toggleFilterModal = () => {
    Animated.timing(animatedValue, {
      toValue: showFilterModal ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowFilterModal(!showFilterModal);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group expenses by date, category, or payment method
  const groupExpenses = (expenses) => {
    if (!expenses.length) return [];

    const grouped = {};
    
    expenses.forEach((expense) => {
      let key;
      
      if (groupBy === "date") {
        // Group by date (just the day, not time)
        const date = new Date(expense.date);
        key = date.toISOString().split("T")[0];
      } else if (groupBy === "category") {
        key = expense.category;
      } else if (groupBy === "paymentMethod") {
        key = expense.paymentMethod;
      }
      
      if (!grouped[key]) {
        grouped[key] = {
          title: groupBy === "date" ? formatDate(expense.date) : key,
          data: [],
          totalAmount: 0,
        };
      }
      
      grouped[key].data.push(expense);
      grouped[key].totalAmount += expense.amount;
    });
    
    // Convert to array and sort
    return Object.values(grouped).sort((a, b) => {
      if (groupBy === "date") {
        // For dates, sort newest first
        return new Date(b.data[0].date) - new Date(a.data[0].date);
      } else {
        // For categories and payment methods, sort by total amount
        return b.totalAmount - a.totalAmount;
      }
    });
  };

  // Render expense item
  const renderExpenseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.expenseItem}
      onPress={() => {
        // Navigate to expense details
        // navigation.navigate("ExpenseDetails", { expense: item });
        console.log("Navigate to expense details:", item);
      }}
    >
      <View style={styles.expenseIconContainer}>
        <Icon
          name={categoryIcons[item.category] || "help-circle"}
          size={24}
          color="#2e5bff"
        />
      </View>
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseTitle} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.expenseCategory}>
          {item.category} • {formatDate(item.date)}
        </Text>
      </View>
      <View style={styles.expenseAmountContainer}>
        <Text style={styles.expenseAmount}>
          ${item.amount.toFixed(2)}
        </Text>
        <View style={styles.paymentMethodContainer}>
          <Icon
            name={paymentMethodIcons[item.paymentMethod] || "help-circle"}
            size={12}
            color="#718096"
          />
          <Text style={styles.paymentMethod} numberOfLines={1}>
            {item.paymentMethod}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render group header
  const renderGroupHeader = (title, totalAmount) => (
    <View style={styles.groupHeader}>
      <Text style={styles.groupTitle}>{title}</Text>
      <Text style={styles.groupTotal}>${totalAmount.toFixed(2)}</Text>
    </View>
  );

  // Get all unique categories from expenses
  const categories = ["all", ...new Set(expenses.map((expense) => expense.category))];

  // Render grouped expenses
  const renderGroupedExpenses = () => {
    const groupedData = groupExpenses(filteredExpenses);
    
    return (
      <FlatList
        data={groupedData}
        keyExtractor={(item, index) => `group-${index}`}
        renderItem={({ item }) => (
          <View style={styles.group}>
            {renderGroupHeader(item.title, item.totalAmount)}
            <FlatList
              data={item.data}
              keyExtractor={(expense) => expense._id}
              renderItem={renderExpenseItem}
              scrollEnabled={false}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="file-search-outline" size={60} color="#a0aec0" />
            <Text style={styles.emptyText}>No expenses found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Total Expenses</Text>
              <Text style={styles.summaryAmount}>
                ${totalExpenses.toFixed(2)}
              </Text>
              <Text style={styles.summarySubtext}>
                {filteredExpenses.length} transactions
              </Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <View style={styles.container}>

      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="magnify" size={20} color="#a0aec0" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search expenses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={toggleFilterModal}
        >
          <Animated.View
            style={{
              transform: [{ rotate: animatedRotation }],
            }}
          >
            <Icon name="filter-variant" size={24} color="#2e5bff" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Group By Tabs */}
      <View style={styles.groupByContainer}>
        <TouchableOpacity
          style={[
            styles.groupByTab,
            groupBy === "date" && styles.activeGroupByTab,
          ]}
          onPress={() => setGroupBy("date")}
        >
          <Text
            style={[
              styles.groupByText,
              groupBy === "date" && styles.activeGroupByText,
            ]}
          >
            By Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.groupByTab,
            groupBy === "category" && styles.activeGroupByTab,
          ]}
          onPress={() => setGroupBy("category")}
        >
          <Text
            style={[
              styles.groupByText,
              groupBy === "category" && styles.activeGroupByText,
            ]}
          >
            By Category
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.groupByTab,
            groupBy === "paymentMethod" && styles.activeGroupByTab,
          ]}
          onPress={() => setGroupBy("paymentMethod")}
        >
          <Text
            style={[
              styles.groupByText,
              groupBy === "paymentMethod" && styles.activeGroupByText,
            ]}
          >
            By Payment
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Filters Display */}
      {activeFilter !== "all" && (
        <View style={styles.activeFiltersContainer}>
          <View style={styles.activeFilterChip}>
            <Text style={styles.activeFilterText}>{activeFilter}</Text>
            <TouchableOpacity
              onPress={() => {
                setActiveFilter("all");
                applyFiltersAndSorting(
                  searchQuery ? filteredExpenses : expenses,
                  "all",
                  activeSorting
                );
              }}
            >
              <Icon name="close" size={16} color="#2e5bff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Expenses List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e5bff" />
          <Text style={styles.loadingText}>Loading expenses...</Text>
        </View>
      ) : (
        renderGroupedExpenses()
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Filter & Sort</Text>
                  <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                    <Icon name="close" size={24} color="#2d3748" />
                  </TouchableOpacity>
                </View>

                {/* Filter by Category */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Filter by Category</Text>
                  <View style={styles.categoryFilters}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryChip,
                          activeFilter === category && styles.activeCategoryChip,
                        ]}
                        onPress={() => {
                          setActiveFilter(category);
                          applyFiltersAndSorting(
                            searchQuery ? filteredExpenses : expenses,
                            category,
                            activeSorting
                          );
                        }}
                      >
                        {category !== "all" && (
                          <Icon
                            name={categoryIcons[category] || "help-circle"}
                            size={16}
                            color={
                              activeFilter === category ? "#ffffff" : "#2e5bff"
                            }
                          />
                        )}
                        <Text
                          style={[
                            styles.categoryChipText,
                            activeFilter === category &&
                              styles.activeCategoryChipText,
                          ]}
                        >
                          {category === "all" ? "All Categories" : category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Sort Options */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Sort By</Text>
                  <View style={styles.sortOptions}>
                    {[
                      { id: "newest", label: "Newest First", icon: "sort-calendar-descending" },
                      { id: "oldest", label: "Oldest First", icon: "sort-calendar-ascending" },
                      { id: "highest", label: "Highest Amount", icon: "sort-numeric-descending" },
                      { id: "lowest", label: "Lowest Amount", icon: "sort-numeric-ascending" },
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.sortOption,
                          activeSorting === option.id && styles.activeSortOption,
                        ]}
                        onPress={() => {
                          setActiveSorting(option.id);
                          applyFiltersAndSorting(
                            searchQuery ? filteredExpenses : expenses,
                            activeFilter,
                            option.id
                          );
                        }}
                      >
                        <Icon
                          name={option.icon}
                          size={20}
                          color={
                            activeSorting === option.id ? "#ffffff" : "#2e5bff"
                          }
                        />
                        <Text
                          style={[
                            styles.sortOptionText,
                            activeSorting === option.id &&
                              styles.activeSortOptionText,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Apply and Reset Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                      setActiveFilter("all");
                      setActiveSorting("newest");
                      applyFiltersAndSorting(expenses, "all", "newest");
                      setShowFilterModal(false);
                    }}
                  >
                    <Text style={styles.resetButtonText}>Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => setShowFilterModal(false)}
                  >
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2e5bff",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7fafc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#2d3748",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f7fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  groupByContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingTop:15
  },
  groupByTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f7fafc",
  },
  activeGroupByTab: {
    backgroundColor: "#ebf4ff",
  },
  groupByText: {
    fontSize: 14,
    color: "#718096",
  },
  activeGroupByText: {
    color: "#2e5bff",
    fontWeight: "500",
  },
  activeFiltersContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebf4ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  activeFilterText: {
    fontSize: 14,
    color: "#2e5bff",
    marginRight: 8,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#718096",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a5568",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#718096",
    marginTop: 8,
  },
  summaryContainer: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    color: "#718096",
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: "#a0aec0",
  },
  group: {
    marginBottom: 20,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f7fafc",
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a5568",
  },
  groupTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d3748",
  },
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f7fafc",
  },
  expenseIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ebf4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2d3748",
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 14,
    color: "#718096",
  },
  expenseAmountContainer: {
    alignItems: "flex-end",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 4,
  },
  paymentMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentMethod: {
    fontSize: 12,
    color: "#718096",
    marginLeft: 4,
    maxWidth: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: Dimensions.get("window").height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
  },
  modalSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: 15,
  },
  categoryFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7fafc",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  activeCategoryChip: {
    backgroundColor: "#2e5bff",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#4a5568",
    marginLeft: 4,
  },
  activeCategoryChipText: {
    color: "#ffffff",
  },
  sortOptions: {
    flexDirection: "column",
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#f7fafc",
  },
  activeSortOption: {
    backgroundColor: "#2e5bff",
  },
  sortOptionText: {
    fontSize: 16,
    color: "#4a5568",
    marginLeft: 10,
  },
  activeSortOptionText: {
    color: "#ffffff",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#f7fafc",
    alignItems: "center",
    marginRight: 10,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a5568",
  },
  applyButton: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#2e5bff",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default ViewExpensesScreen;