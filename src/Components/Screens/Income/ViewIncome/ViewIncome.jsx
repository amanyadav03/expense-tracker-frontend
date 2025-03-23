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
  TouchableWithoutFeedback
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getIncome } from "../../../../Services/api";
import { useSelector } from "react-redux";

const ViewIncomeScreen = ({ navigation }) => {
  // States for income data and UI control
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSorting, setActiveSorting] = useState("newest");
  const [groupBy, setGroupBy] = useState("date"); // 'date', 'category', 'source'
  const [totalIncome, setTotalIncome] = useState(0);
  const [recurringIncome, setRecurringIncome] = useState(0);

  const token = useSelector((state)=>state.auth.token);
  // Animation value for filter button
  const animatedValue = new Animated.Value(0);
  const animatedRotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const fetchIncome= async()=>{
    if(!token){
      setLoading(false);
      return;
    }
    try{
      const response = await getIncome(token);
      if(response.status===200){
      setIncomes(response.data.income);
      setFilteredIncomes(response.data.income);
      calculateTotalIncome(response.data.income);
      }
    }
    catch(err){
      console.error(err);
    }finally{
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Category icons mapping
  const categoryIcons = {
    "salary": "cash-multiple",
    "freelance": "laptop",
    "investments": "chart-line",
    "rental": "home-city",
    "gifts": "gift",
    "refunds": "cash-refund",
    "business": "store",
    "side Hustle": "handshake",
    "other": "dots-horizontal",
  };

  // Payment method icons mapping
  const paymentMethodIcons = {
    "Bank Transfer": "bank-transfer",
    "Cash": "cash",
    "Check": "file-document-outline",
    "Credit Card": "credit-card",
    "PayPal": "paypal",
    "Mobile Payment": "cellphone",
  };

  // Fetch income data
  useEffect(() => {
    fetchIncome();
  }, []);

  // Calculate total income and recurring income
  const calculateTotalIncome = (incomeList) => {
    const total = incomeList.reduce((sum, income) => sum + income.amount, 0);
    setTotalIncome(total);

    const recurring = incomeList
      .filter(income => income.isRecurring)
      .reduce((sum, income) => sum + income.amount, 0);
    setRecurringIncome(recurring);
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchIncome();
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      applyFiltersAndSorting(incomes, activeFilter, activeSorting);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = incomes.filter(
        (income) =>
          income.description.toLowerCase().includes(lowercasedQuery) ||
          income.category.toLowerCase().includes(lowercasedQuery) ||
          income.source.toLowerCase().includes(lowercasedQuery) ||
          income.paymentMethod.toLowerCase().includes(lowercasedQuery) ||
          income.amount.toString().includes(lowercasedQuery)
      );
      applyFiltersAndSorting(filtered, activeFilter, activeSorting);
    }
  }, [searchQuery, incomes, activeFilter, activeSorting]);

  // Apply filters and sorting
  const applyFiltersAndSorting = (data, filter, sort) => {
    // Apply category filter
    let filteredData = [...data];
    if (filter !== "all") {
      filteredData = filteredData.filter((income) => income.category === filter);
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

    setFilteredIncomes(filteredData);
    calculateTotalIncome(filteredData);
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

  // Group incomes by date, category, or source
  const groupIncomes = (incomes) => {
    if (!incomes.length) return [];

    const grouped = {};
    
    incomes.forEach((income) => {
      let key;
      
      if (groupBy === "date") {
        // Group by date (just the day, not time)
        const date = new Date(income.date);
        key = date.toISOString().split("T")[0];
      } else if (groupBy === "category") {
        key = income.category;
      } else if (groupBy === "source") {
        key = income.source || "Unknown";
      }
      
      if (!grouped[key]) {
        grouped[key] = {
          title: groupBy === "date" ? formatDate(income.date) : key,
          data: [],
          totalAmount: 0,
        };
      }
      
      grouped[key].data.push(income);
      grouped[key].totalAmount += income.amount;
    });
    
    // Convert to array and sort
    return Object.values(grouped).sort((a, b) => {
      if (groupBy === "date") {
        // For dates, sort newest first
        return new Date(b.data[0].date) - new Date(a.data[0].date);
      } else {
        // For categories and sources, sort by total amount
        return b.totalAmount - a.totalAmount;
      }
    });
  };

  // Render income item
  const renderIncomeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.incomeItem}
      onPress={() => {
        // Navigate to income details
        // navigation.navigate("IncomeDetails", { income: item });
        console.log("Navigate to income details:", item);
      }}
    >
      <View style={styles.incomeIconContainer}>
        <Icon
          name={categoryIcons[item.category] || "help-circle"}
          size={24}
          color="#4CAF50"
        />
      </View>
      <View style={styles.incomeDetails}>
        <Text style={styles.incomeTitle} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.incomeCategory}>
          {item.category} • {formatDate(item.date)}
        </Text>
      </View>
      <View style={styles.incomeAmountContainer}>
        <Text style={styles.incomeAmount}>
          ${item.amount.toFixed(2)}
        </Text>
        <View style={styles.sourceContainer}>
          {item.isRecurring && (
            <Icon name="refresh" size={12} color="#4CAF50" style={styles.recurringIcon} />
          )}
          <Text style={styles.source} numberOfLines={1}>
            {item.source || item.paymentMethod}
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

  // Get all unique categories from incomes
  const categories = ["all", ...new Set(incomes.map((income) => income.category))];

  // Render grouped incomes
  const renderGroupedIncomes = () => {
    const groupedData = groupIncomes(filteredIncomes);
    
    return (
      <FlatList
        data={groupedData}
        keyExtractor={(item, index) => `group-${index}`}
        renderItem={({ item }) => (
          <View style={styles.group}>
            {renderGroupHeader(item.title, item.totalAmount)}
            <FlatList
              data={item.data}
              keyExtractor={(income) => income.id}
              renderItem={renderIncomeItem}
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
            <Text style={styles.emptyText}>No income found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Total Income</Text>
              <Text style={styles.summaryAmount}>
                ${totalIncome.toFixed(2)}
              </Text>
              <Text style={styles.summarySubtext}>
                {filteredIncomes.length} transactions
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Recurring Income</Text>
              <Text style={styles.summaryAmount}>
                ${recurringIncome.toFixed(2)}
              </Text>
              <Text style={styles.summarySubtext}>
                {filteredIncomes.filter(i => i.isRecurring).length} sources
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
      {/* Header */}

      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="magnify" size={20} color="#a0aec0" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search income..."
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
            <Icon name="filter-variant" size={24} color="#4CAF50" />
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
            groupBy === "source" && styles.activeGroupByTab,
          ]}
          onPress={() => setGroupBy("source")}
        >
          <Text
            style={[
              styles.groupByText,
              groupBy === "source" && styles.activeGroupByText,
            ]}
          >
            By Source
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
                  searchQuery ? filteredIncomes : incomes,
                  "all",
                  activeSorting
                );
              }}
            >
              <Icon name="close" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Income List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading income...</Text>
        </View>
      ) : (
        renderGroupedIncomes()
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
                            searchQuery ? filteredIncomes : incomes,
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
                              activeFilter === category ? "#ffffff" : "#4CAF50"
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
                            searchQuery ? filteredIncomes : incomes,
                            activeFilter,
                            option.id
                          );
                        }}
                      >
                        <Icon
                          name={option.icon}
                          size={20}
                          color={
                            activeSorting === option.id ? "#ffffff" : "#4CAF50"
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

                {/* Filter by Recurring */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Recurring Income</Text>
                  <View style={styles.recurringFilters}>
                    {[
                      { id: "all", label: "All Income" },
                      { id: "recurring", label: "Recurring Only" },
                      { id: "non-recurring", label: "Non-Recurring Only" },
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.recurringOption,
                          activeFilter === option.id && styles.activeRecurringOption,
                        ]}
                        onPress={() => {
                          let filtered = [...incomes];
                          if (option.id === "recurring") {
                            filtered = incomes.filter(income => income.isRecurring);
                          } else if (option.id === "non-recurring") {
                            filtered = incomes.filter(income => !income.isRecurring);
                          }
                          setActiveFilter(option.id);
                          applyFiltersAndSorting(filtered, activeFilter, activeSorting);
                        }}
                      >
                        <Text
                          style={[
                            styles.recurringOptionText,
                            activeFilter === option.id && styles.activeRecurringOptionText,
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
                      applyFiltersAndSorting(incomes, "all", "newest");
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
    backgroundColor: "#4CAF50",
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
    backgroundColor: "#e8f5e9",
  },
  groupByText: {
    fontSize: 14,
    color: "#718096",
  },
  activeGroupByText: {
    color: "#4CAF50",
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
    backgroundColor: "#e8f5e9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  activeFilterText: {
    fontSize: 14,
    color: "#4CAF50",
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
    flexDirection: "row",
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
    flex: 1,
    marginRight: 10,
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
    flex: 1,
    marginHorizontal: 5,
  },
  summaryTitle: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 12,
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
  incomeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f7fafc",
  },
  incomeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  incomeDetails: {
    flex: 1,
  },
  incomeTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2d3748",
    marginBottom: 4,
  },
  incomeCategory: {
    fontSize: 14,
    color: "#718096",
  },
  incomeAmountContainer: {
    alignItems: "flex-end",
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 4,
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  recurringIcon: {
    marginRight: 4,
  },
  source: {
    fontSize: 12,
    color: "#718096",
    maxWidth: 100,
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
    backgroundColor: "#4CAF50",
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
    backgroundColor: "#4CAF50",
  },
  sortOptionText: {
    fontSize: 16,
    color: "#4a5568",
    marginLeft: 10,
  },
  activeSortOptionText: {
    color: "#ffffff",
  },
  recurringFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  recurringOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#f7fafc",
  },
  activeRecurringOption: {
    backgroundColor: "#4CAF50",
  },
  recurringOptionText: {
    fontSize: 14,
    color: "#4a5568",
  },
  activeRecurringOptionText: {
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
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default ViewIncomeScreen;