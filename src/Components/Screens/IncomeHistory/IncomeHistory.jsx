import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Share
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// Note: In a real implementation, you would need to install:
// npm install react-native-chart-kit
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const IncomeHistoryScreen = ({ navigation }) => {
  // States for data and UI control
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("monthly"); // monthly, quarterly, yearly
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [chartType, setChartType] = useState("line"); // line, bar, pie
  const [incomeData, setIncomeData] = useState([]);
  const [monthlyTotals, setMonthlyTotals] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [recurringIncome, setRecurringIncome] = useState(0);
  const [comparisonData, setComparisonData] = useState({
    currentPeriod: 0,
    previousPeriod: 0,
    percentChange: 0,
  });

  const screenWidth = Dimensions.get("window").width - 40;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Years for picker (last 5 years)
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  // Mock data for income
  const mockIncomes = [
    // January
    { id: "1", amount: 3500, category: "Salary", date: "2025-01-15T07:38:13.443Z", isRecurring: true },
    { id: "2", amount: 200, category: "Investments", date: "2025-01-20T14:22:43.443Z", isRecurring: true },
    { id: "3", amount: 1200, category: "Rental", date: "2025-01-05T09:15:00.443Z", isRecurring: true },
    
    // February
    { id: "4", amount: 3500, category: "Salary", date: "2025-02-15T07:38:13.443Z", isRecurring: true },
    { id: "5", amount: 200, category: "Investments", date: "2025-02-20T14:22:43.443Z", isRecurring: true },
    { id: "6", amount: 1200, category: "Rental", date: "2025-02-05T09:15:00.443Z", isRecurring: true },
    { id: "7", amount: 500, category: "Freelance", date: "2025-02-10T16:45:22.443Z", isRecurring: false },
    
    // March
    { id: "8", amount: 3500, category: "Salary", date: "2025-03-15T07:38:13.443Z", isRecurring: true },
    { id: "9", amount: 200, category: "Investments", date: "2025-03-20T14:22:43.443Z", isRecurring: true },
    { id: "10", amount: 1200, category: "Rental", date: "2025-03-05T09:15:00.443Z", isRecurring: true },
    { id: "11", amount: 300, category: "Gifts", date: "2025-03-25T16:45:22.443Z", isRecurring: false },
    
    // April
    { id: "12", amount: 3500, category: "Salary", date: "2025-04-15T07:38:13.443Z", isRecurring: true },
    { id: "13", amount: 200, category: "Investments", date: "2025-04-20T14:22:43.443Z", isRecurring: true },
    { id: "14", amount: 1200, category: "Rental", date: "2025-04-05T09:15:00.443Z", isRecurring: true },
    { id: "15", amount: 750, category: "Freelance", date: "2025-04-10T16:45:22.443Z", isRecurring: false },
    
    // May
    { id: "16", amount: 3500, category: "Salary", date: "2025-05-15T07:38:13.443Z", isRecurring: true },
    { id: "17", amount: 200, category: "Investments", date: "2025-05-20T14:22:43.443Z", isRecurring: true },
    { id: "18", amount: 1200, category: "Rental", date: "2025-05-05T09:15:00.443Z", isRecurring: true },
    
    // June
    { id: "19", amount: 3700, category: "Salary", date: "2025-06-15T07:38:13.443Z", isRecurring: true },
    { id: "20", amount: 200, category: "Investments", date: "2025-06-20T14:22:43.443Z", isRecurring: true },
    { id: "21", amount: 1200, category: "Rental", date: "2025-06-05T09:15:00.443Z", isRecurring: true },
    { id: "22", amount: 400, category: "Gifts", date: "2025-06-25T16:45:22.443Z", isRecurring: false },
    
    // July
    { id: "23", amount: 3700, category: "Salary", date: "2025-07-15T07:38:13.443Z", isRecurring: true },
    { id: "24", amount: 200, category: "Investments", date: "2025-07-20T14:22:43.443Z", isRecurring: true },
    { id: "25", amount: 1200, category: "Rental", date: "2025-07-05T09:15:00.443Z", isRecurring: true },
    { id: "26", amount: 800, category: "Freelance", date: "2025-07-10T16:45:22.443Z", isRecurring: false },
    
    // August
    { id: "27", amount: 3700, category: "Salary", date: "2025-08-15T07:38:13.443Z", isRecurring: true },
    { id: "28", amount: 200, category: "Investments", date: "2025-08-20T14:22:43.443Z", isRecurring: true },
    { id: "29", amount: 1200, category: "Rental", date: "2025-08-05T09:15:00.443Z", isRecurring: true },
    
    // September
    { id: "30", amount: 3700, category: "Salary", date: "2025-09-15T07:38:13.443Z", isRecurring: true },
    { id: "31", amount: 200, category: "Investments", date: "2025-09-20T14:22:43.443Z", isRecurring: true },
    { id: "32", amount: 1200, category: "Rental", date: "2025-09-05T09:15:00.443Z", isRecurring: true },
    { id: "33", amount: 600, category: "Freelance", date: "2025-09-10T16:45:22.443Z", isRecurring: false },
    
    // October
    { id: "34", amount: 3700, category: "Salary", date: "2025-10-15T07:38:13.443Z", isRecurring: true },
    { id: "35", amount: 200, category: "Investments", date: "2025-10-20T14:22:43.443Z", isRecurring: true },
    { id: "36", amount: 1200, category: "Rental", date: "2025-10-05T09:15:00.443Z", isRecurring: true },
    
    // November
    { id: "37", amount: 3700, category: "Salary", date: "2025-11-15T07:38:13.443Z", isRecurring: true },
    { id: "38", amount: 200, category: "Investments", date: "2025-11-20T14:22:43.443Z", isRecurring: true },
    { id: "39", amount: 1200, category: "Rental", date: "2025-11-05T09:15:00.443Z", isRecurring: true },
    { id: "40", amount: 350, category: "Gifts", date: "2025-11-25T16:45:22.443Z", isRecurring: false },
    
    // December
    { id: "41", amount: 4000, category: "Salary", date: "2025-12-15T07:38:13.443Z", isRecurring: true },
    { id: "42", amount: 200, category: "Investments", date: "2025-12-20T14:22:43.443Z", isRecurring: true },
    { id: "43", amount: 1200, category: "Rental", date: "2025-12-05T09:15:00.443Z", isRecurring: true },
    { id: "44", amount: 1000, category: "Bonus", date: "2025-12-22T16:45:22.443Z", isRecurring: false },
  ];

  // Category colors for charts
  const categoryColors = {
    "Salary": "#4CAF50",
    "Investments": "#2196F3",
    "Rental": "#FF9800",
    "Freelance": "#9C27B0",
    "Gifts": "#E91E63",
    "Bonus": "#3F51B5",
    "Business": "#00BCD4",
    "Refunds": "#607D8B",
    "Other": "#CCCCCC"
  };

  // Fetch income data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIncomeData(mockIncomes);
      processData(mockIncomes);
      setLoading(false);
    }, 1000);
  }, []);

  // Process data when timeframe, year, or month changes
  useEffect(() => {
    processData(incomeData);
  }, [timeFrame, selectedYear, selectedMonth, incomeData]);

  // Process income data based on selected timeframe
  const processData = (data) => {
    if (!data.length) return;

    // Filter data for selected year
    const yearData = data.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate.getFullYear() === selectedYear;
    });

    // Calculate monthly totals
    const monthlyData = Array(12).fill(0);
    yearData.forEach(income => {
      const incomeDate = new Date(income.date);
      const month = incomeDate.getMonth();
      monthlyData[month] += income.amount;
    });
    setMonthlyTotals(monthlyData);

    // Calculate category breakdown for selected period
    let periodData = [];
    if (timeFrame === "monthly") {
      // Filter for selected month
      periodData = yearData.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === selectedMonth;
      });
    } else if (timeFrame === "quarterly") {
      // Filter for selected quarter
      const quarter = Math.floor(selectedMonth / 3);
      periodData = yearData.filter(income => {
        const incomeDate = new Date(income.date);
        const incomeQuarter = Math.floor(incomeDate.getMonth() / 3);
        return incomeQuarter === quarter;
      });
    } else {
      // Yearly data
      periodData = yearData;
    }

    // Calculate category breakdown
    const categories = {};
    periodData.forEach(income => {
      if (!categories[income.category]) {
        categories[income.category] = 0;
      }
      categories[income.category] += income.amount;
    });

    // Format for pie chart
    const categoryData = Object.keys(categories).map(category => ({
      name: category,
      amount: categories[category],
      color: categoryColors[category] || "#CCCCCC",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }));
    setCategoryBreakdown(categoryData);

    // Calculate recurring income
    const recurringTotal = periodData
      .filter(income => income.isRecurring)
      .reduce((sum, income) => sum + income.amount, 0);
    setRecurringIncome(recurringTotal);

    // Calculate comparison data
    calculateComparison(data);
  };

  // Calculate comparison between current and previous period
  const calculateComparison = (data) => {
    let currentPeriodTotal = 0;
    let previousPeriodTotal = 0;

    if (timeFrame === "monthly") {
      // Current month
      const currentMonthData = data.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getFullYear() === selectedYear && 
               incomeDate.getMonth() === selectedMonth;
      });
      currentPeriodTotal = currentMonthData.reduce((sum, income) => sum + income.amount, 0);

      // Previous month
      let prevMonth = selectedMonth - 1;
      let prevYear = selectedYear;
      if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
      }
      const previousMonthData = data.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getFullYear() === prevYear && 
               incomeDate.getMonth() === prevMonth;
      });
      previousPeriodTotal = previousMonthData.reduce((sum, income) => sum + income.amount, 0);
    } else if (timeFrame === "quarterly") {
      // Current quarter
      const quarter = Math.floor(selectedMonth / 3);
      const currentQuarterData = data.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getFullYear() === selectedYear && 
               Math.floor(incomeDate.getMonth() / 3) === quarter;
      });
      currentPeriodTotal = currentQuarterData.reduce((sum, income) => sum + income.amount, 0);

      // Previous quarter
      let prevQuarter = quarter - 1;
      let prevYear = selectedYear;
      if (prevQuarter < 0) {
        prevQuarter = 3;
        prevYear--;
      }
      const previousQuarterData = data.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getFullYear() === prevYear && 
               Math.floor(incomeDate.getMonth() / 3) === prevQuarter;
      });
      previousPeriodTotal = previousQuarterData.reduce((sum, income) => sum + income.amount, 0);
    } else {
      // Current year
      const currentYearData = data.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getFullYear() === selectedYear;
      });
      currentPeriodTotal = currentYearData.reduce((sum, income) => sum + income.amount, 0);

      // Previous year
      const prevYear = selectedYear - 1;
      const previousYearData = data.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getFullYear() === prevYear;
      });
      previousPeriodTotal = previousYearData.reduce((sum, income) => sum + income.amount, 0);
    }

    // Calculate percent change
    let percentChange = 0;
    if (previousPeriodTotal > 0) {
      percentChange = ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100;
    }

    setComparisonData({
      currentPeriod: currentPeriodTotal,
      previousPeriod: previousPeriodTotal,
      percentChange: percentChange
    });
  };

  // Get period label based on timeframe
  const getPeriodLabel = () => {
    if (timeFrame === "monthly") {
      return `${months[selectedMonth]} ${selectedYear}`;
    } else if (timeFrame === "quarterly") {
      const quarter = Math.floor(selectedMonth / 3) + 1;
      return `Q${quarter} ${selectedYear}`;
    } else {
      return `${selectedYear}`;
    }
  };

  // Get previous period label
  const getPreviousPeriodLabel = () => {
    if (timeFrame === "monthly") {
      let prevMonth = selectedMonth - 1;
      let prevYear = selectedYear;
      if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
      }
      return `${months[prevMonth]} ${prevYear}`;
    } else if (timeFrame === "quarterly") {
      let quarter = Math.floor(selectedMonth / 3) + 1;
      let prevQuarter = quarter - 1;
      let prevYear = selectedYear;
      if (prevQuarter < 1) {
        prevQuarter = 4;
        prevYear--;
      }
      return `Q${prevQuarter} ${prevYear}`;
    } else {
      return `${selectedYear - 1}`;
    }
  };

  // Share income report
  const shareReport = async () => {
    try {
      const message = `
Income Report for ${getPeriodLabel()}

Total Income: $${comparisonData.currentPeriod.toFixed(2)}
Recurring Income: $${recurringIncome.toFixed(2)}
Compared to ${getPreviousPeriodLabel()}: ${comparisonData.percentChange >= 0 ? '+' : ''}${comparisonData.percentChange.toFixed(2)}%

Category Breakdown:
${categoryBreakdown.map(cat => `${cat.name}: $${cat.amount.toFixed(2)}`).join('\n')}
      `;
      
      await Share.share({
        message,
        title: `Income Report - ${getPeriodLabel()}`
      });
    } catch (error) {
      console.error("Error sharing report:", error);
    }
  };

  // Render line chart for monthly income
  const renderLineChart = () => {
    const labels = timeFrame === "yearly" 
      ? months.map(month => month.substring(0, 3)) 
      : timeFrame === "quarterly"
        ? ["Month 1", "Month 2", "Month 3"]
        : ["Week 1", "Week 2", "Week 3", "Week 4"];

    let data = [];
    if (timeFrame === "yearly") {
      data = monthlyTotals;
    } else if (timeFrame === "quarterly") {
      const quarter = Math.floor(selectedMonth / 3);
      const startMonth = quarter * 3;
      data = [
        monthlyTotals[startMonth],
        monthlyTotals[startMonth + 1],
        monthlyTotals[startMonth + 2]
      ];
    } else {
      // For monthly view, we'll simulate weekly data
      const total = monthlyTotals[selectedMonth];
      // Distribute the total across 4 weeks (this is just for demonstration)
      data = [total * 0.25, total * 0.25, total * 0.25, total * 0.25];
    }

    return (
      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: data.length ? data : [0],
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              strokeWidth: 2
            }
          ],
          legend: ["Income"]
        }}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#4CAF50"
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    );
  };

  // Render bar chart for monthly income
  const renderBarChart = () => {
    const labels = timeFrame === "yearly" 
      ? months.map(month => month.substring(0, 3)) 
      : timeFrame === "quarterly"
        ? ["Month 1", "Month 2", "Month 3"]
        : ["Week 1", "Week 2", "Week 3", "Week 4"];

    let data = [];
    if (timeFrame === "yearly") {
      data = monthlyTotals;
    } else if (timeFrame === "quarterly") {
      const quarter = Math.floor(selectedMonth / 3);
      const startMonth = quarter * 3;
      data = [
        monthlyTotals[startMonth],
        monthlyTotals[startMonth + 1],
        monthlyTotals[startMonth + 2]
      ];
    } else {
      // For monthly view, we'll simulate weekly data
      const total = monthlyTotals[selectedMonth];
      // Distribute the total across 4 weeks (this is just for demonstration)
      data = [total * 0.25, total * 0.25, total * 0.25, total * 0.25];
    }

    return (
      <BarChart
        data={{
          labels,
          datasets: [
            {
              data: data.length ? data : [0]
            }
          ]
        }}
        width={screenWidth}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          barPercentage: 0.5
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    );
  };

  // Render pie chart for category breakdown
  const renderPieChart = () => {
    // If no data, show empty chart
    if (!categoryBreakdown.length) {
      return (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>No data for this period</Text>
        </View>
      );
    }

    return (
      <PieChart
        data={categoryBreakdown}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    );
  };

  // Render chart based on selected type
  const renderChart = () => {
    switch (chartType) {
      case "line":
        return renderLineChart();
      case "bar":
        return renderBarChart();
      case "pie":
        return renderPieChart();
      default:
        return renderLineChart();
    }
  };

  // Render top categories
  const renderTopCategories = () => {
    if (!categoryBreakdown.length) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No data for this period</Text>
        </View>
      );
    }

    // Sort categories by amount
    const sortedCategories = [...categoryBreakdown].sort((a, b) => b.amount - a.amount);
    // Take top 5
    const topCategories = sortedCategories.slice(0, 5);

    return (
      <View style={styles.topCategoriesContainer}>
        {topCategories.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryIconContainer}>
              <View 
                style={[
                  styles.categoryColorIndicator, 
                  { backgroundColor: category.color }
                ]} 
              />
            </View>
            <View style={styles.categoryDetails}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: `${(category.amount / sortedCategories[0].amount) * 100}%`,
                      backgroundColor: category.color 
                    }
                  ]} 
                />
              </View>
            </View>
            <Text style={styles.categoryAmount}>${category.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render recurring vs non-recurring breakdown
  const renderRecurringBreakdown = () => {
    if (!categoryBreakdown.length) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No data for this period</Text>
        </View>
      );
    }

    // Calculate total for the period
    const totalIncome = comparisonData.currentPeriod;
    const nonRecurringIncome = totalIncome - recurringIncome;
    
    // Calculate percentages
    const recurringPercentage = totalIncome > 0 ? (recurringIncome / totalIncome) * 100 : 0;
    const nonRecurringPercentage = totalIncome > 0 ? (nonRecurringIncome / totalIncome) * 100 : 0;

    return (
      <View style={styles.recurringBreakdownContainer}>
        <View style={styles.recurringItem}>
          <View style={styles.recurringIconContainer}>
            <Icon name="refresh" size={20} color="#4CAF50" />
          </View>
          <View style={styles.recurringDetails}>
            <Text style={styles.recurringTitle}>Recurring Income</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${recurringPercentage}%`,
                    backgroundColor: "#4CAF50" 
                  }
                ]} 
              />
            </View>
          </View>
          <View style={styles.recurringAmountContainer}>
            <Text style={styles.recurringAmount}>${recurringIncome.toFixed(2)}</Text>
            <Text style={styles.recurringPercentage}>{recurringPercentage.toFixed(1)}%</Text>
          </View>
        </View>

        <View style={styles.recurringItem}>
          <View style={styles.recurringIconContainer}>
            <Icon name="cash" size={20} color="#FF9800" />
          </View>
          <View style={styles.recurringDetails}>
            <Text style={styles.recurringTitle}>Non-Recurring Income</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${nonRecurringPercentage}%`,
                    backgroundColor: "#FF9800" 
                  }
                ]} 
              />
            </View>
          </View>
          <View style={styles.recurringAmountContainer}>
            <Text style={styles.recurringAmount}>${nonRecurringIncome.toFixed(2)}</Text>
            <Text style={styles.recurringPercentage}>{nonRecurringPercentage.toFixed(1)}%</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#2d3748" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Income History</Text>
        <TouchableOpacity style={styles.shareButton} onPress={shareReport}>
          <Icon name="share-variant" size={24} color="#2d3748" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading income history...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Time Frame Selector */}
          <View style={styles.timeFrameContainer}>
            <TouchableOpacity
              style={[
                styles.timeFrameButton,
                timeFrame === "monthly" && styles.activeTimeFrameButton,
              ]}
              onPress={() => setTimeFrame("monthly")}
            >
              <Text
                style={[
                  styles.timeFrameText,
                  timeFrame === "monthly" && styles.activeTimeFrameText,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeFrameButton,
                timeFrame === "quarterly" && styles.activeTimeFrameButton,
              ]}
              onPress={() => setTimeFrame("quarterly")}
            >
              <Text
                style={[
                  styles.timeFrameText,
                  timeFrame === "quarterly" && styles.activeTimeFrameText,
                ]}
              >
                Quarterly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeFrameButton,
                timeFrame === "yearly" && styles.activeTimeFrameButton,
              ]}
              onPress={() => setTimeFrame("yearly")}
            >
              <Text
                style={[
                  styles.timeFrameText,
                  timeFrame === "yearly" && styles.activeTimeFrameText,
                ]}
              >
                Yearly
              </Text>
            </TouchableOpacity>
          </View>

          {/* Period Selector */}
          <View style={styles.periodSelectorContainer}>
            {timeFrame !== "yearly" && (
              <TouchableOpacity
                style={styles.periodButton}
                onPress={() => setShowMonthPicker(true)}
              >
                <Text style={styles.periodButtonText}>
                  {timeFrame === "monthly" 
                    ? months[selectedMonth] 
                    : `Q${Math.floor(selectedMonth / 3) + 1}`}
                </Text>
                <Icon name="chevron-down" size={20} color="#4CAF50" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.periodButton}
              onPress={() => setShowYearPicker(true)}
            >
              <Text style={styles.periodButtonText}>{selectedYear}</Text>
              <Icon name="chevron-down" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>
                {timeFrame === "monthly" 
                  ? "Monthly Summary" 
                  : timeFrame === "quarterly" 
                    ? "Quarterly Summary" 
                    : "Yearly Summary"}
              </Text>
              <Text style={styles.summaryPeriod}>{getPeriodLabel()}</Text>
            </View>
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Total Income</Text>
                <Text style={styles.summaryItemValue}>
                  ${comparisonData.currentPeriod.toFixed(2)}
                </Text>
                <Text style={styles.summaryItemSubtext}>
                  Recurring: ${recurringIncome.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>
                  vs {getPreviousPeriodLabel()}
                </Text>
                <View style={styles.comparisonContainer}>
                  <Icon
                    name={comparisonData.percentChange >= 0 ? "arrow-up" : "arrow-down"}
                    size={16}
                    color={comparisonData.percentChange >= 0 ? "#38a169" : "#e53e3e"}
                  />
                  <Text
                    style={[
                      styles.comparisonValue,
                      {
                        color: comparisonData.percentChange >= 0 ? "#38a169" : "#e53e3e",
                      },
                    ]}
                  >
                    {comparisonData.percentChange >= 0 ? "+" : ""}
                    {comparisonData.percentChange.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Chart Type Selector */}
          <View style={styles.chartTypeContainer}>
            <TouchableOpacity
              style={[
                styles.chartTypeButton,
                chartType === "line" && styles.activeChartTypeButton,
              ]}
              onPress={() => setChartType("line")}
            >
              <Icon
                name="chart-line"
                size={20}
                color={chartType === "line" ? "#4CAF50" : "#a0aec0"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chartTypeButton,
                chartType === "bar" && styles.activeChartTypeButton,
              ]}
              onPress={() => setChartType("bar")}
            >
              <Icon
                name="chart-bar"
                size={20}
                color={chartType === "bar" ? "#4CAF50" : "#a0aec0"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chartTypeButton,
                chartType === "pie" && styles.activeChartTypeButton,
              ]}
              onPress={() => setChartType("pie")}
            >
              <Icon
                name="chart-pie"
                size={20}
                color={chartType === "pie" ? "#4CAF50" : "#a0aec0"}
              />
            </TouchableOpacity>
          </View>

          {/* Chart */}
          <View style={styles.chartContainer}>
            {renderChart()}
          </View>

          {/* Top Categories */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Top Income Sources</Text>
            {renderTopCategories()}
          </View>

          {/* Recurring vs Non-Recurring */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Recurring vs Non-Recurring</Text>
            {renderRecurringBreakdown()}
          </View>

          {/* Month Picker Modal */}
          <Modal
            visible={showMonthPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowMonthPicker(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowMonthPicker(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>
                        {timeFrame === "monthly" ? "Select Month" : "Select Quarter"}
                      </Text>
                      <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                        <Icon name="close" size={24} color="#2d3748" />
                      </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalContent}>
                      {timeFrame === "monthly" ? (
                        // Month selector
                        months.map((month, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.modalOption,
                              selectedMonth === index && styles.selectedModalOption,
                            ]}
                            onPress={() => {
                              setSelectedMonth(index);
                              setShowMonthPicker(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.modalOptionText,
                                selectedMonth === index && styles.selectedModalOptionText,
                              ]}
                            >
                              {month}
                            </Text>
                            {selectedMonth === index && (
                              <Icon name="check" size={20} color="#4CAF50" />
                            )}
                          </TouchableOpacity>
                        ))
                      ) : (
                        // Quarter selector
                        Array.from({ length: 4 }, (_, i) => (
                          <TouchableOpacity
                            key={i}
                            style={[
                              styles.modalOption,
                              Math.floor(selectedMonth / 3) === i && styles.selectedModalOption,
                            ]}
                            onPress={() => {
                              setSelectedMonth(i * 3);
                              setShowMonthPicker(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.modalOptionText,
                                Math.floor(selectedMonth / 3) === i && styles.selectedModalOptionText,
                              ]}
                            >
                              Q{i + 1} ({months[i * 3]} - {months[i * 3 + 2]})
                            </Text>
                            {Math.floor(selectedMonth / 3) === i && (
                              <Icon name="check" size={20} color="#4CAF50" />
                            )}
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Year Picker Modal */}
          <Modal
            visible={showYearPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowYearPicker(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowYearPicker(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Select Year</Text>
                      <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                        <Icon name="close" size={24} color="#2d3748" />
                      </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalContent}>
                      {years.map((year) => (
                        <TouchableOpacity
                          key={year}
                          style={[
                            styles.modalOption,
                            selectedYear === year && styles.selectedModalOption,
                          ]}
                          onPress={() => {
                            setSelectedYear(year);
                            setShowYearPicker(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.modalOptionText,
                              selectedYear === year && styles.selectedModalOptionText,
                            ]}
                          >
                            {year}
                          </Text>
                          {selectedYear === year && (
                            <Icon name="check" size={20} color="#4CAF50" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </ScrollView>
      )}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
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
  timeFrameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  timeFrameButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f7fafc",
  },
  activeTimeFrameButton: {
    backgroundColor: "#e8f5e9",
  },
  timeFrameText: {
    fontSize: 14,
    color: "#718096",
  },
  activeTimeFrameText: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  periodSelectorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  periodButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f7fafc",
    marginHorizontal: 5,
  },
  periodButtonText: {
    fontSize: 14,
    color: "#4CAF50",
    marginRight: 5,
  },
  summaryCard: {
    margin: 20,
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
  summaryHeader: {
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 5,
  },
  summaryPeriod: {
    fontSize: 14,
    color: "#718096",
  },
  summaryContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemLabel: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 5,
  },
  summaryItemValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  summaryItemSubtext: {
    fontSize: 12,
    color: "#718096",
    marginTop: 4,
  },
  comparisonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  comparisonValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  chartTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  chartTypeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f7fafc",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeChartTypeButton: {
    backgroundColor: "#e8f5e9",
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyChartContainer: {
    width: "100%",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyChartText: {
    fontSize: 16,
    color: "#a0aec0",
  },
  sectionContainer: {
    margin: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 15,
  },
  topCategoriesContainer: {
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  categoryIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  categoryColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  categoryDetails: {
    flex: 1,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 14,
    color: "#4a5568",
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#f7fafc",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2d3748",
  },
  recurringBreakdownContainer: {
    marginTop: 10,
  },
  recurringItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  recurringIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  recurringDetails: {
    flex: 1,
    marginRight: 10,
  },
  recurringTitle: {
    fontSize: 14,
    color: "#4a5568",
    marginBottom: 5,
  },
  recurringAmountContainer: {
    alignItems: "flex-end",
  },
  recurringAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2d3748",
  },
  recurringPercentage: {
    fontSize: 12,
    color: "#718096",
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#a0aec0",
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
    maxHeight: "70%",
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
  modalContent: {
    padding: 20,
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f7fafc",
  },
  selectedModalOption: {
    backgroundColor: "#f7fafc",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#4a5568",
  },
  selectedModalOptionText: {
    color: "#4CAF50",
    fontWeight: "500",
  },
});

export default IncomeHistoryScreen;