import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AddIncomeScreen = ({ navigation }) => {
  // States for form data
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");

  // UI control states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Predefined data
  const incomeCategories = [
    { id: "1", name: "Salary", icon: "cash-multiple" },
    { id: "2", name: "Freelance", icon: "laptop" },
    { id: "3", name: "Investments", icon: "chart-line" },
    { id: "4", name: "Rental", icon: "home-city" },
    { id: "5", name: "Gifts", icon: "gift" },
    { id: "6", name: "Refunds", icon: "cash-refund" },
    { id: "7", name: "Business", icon: "store" },
    { id: "8", name: "Side Hustle", icon: "handshake" },
    { id: "9", name: "Other", icon: "dots-horizontal" },
  ];

  const paymentMethods = [
    { id: "1", name: "Bank Transfer", icon: "bank-transfer" },
    { id: "2", name: "Cash", icon: "cash" },
    { id: "3", name: "Check", icon: "file-document-outline" },
    { id: "4", name: "Credit Card", icon: "credit-card" },
    { id: "5", name: "PayPal", icon: "paypal" },
    { id: "6", name: "Mobile Payment", icon: "cellphone" },
  ];

  const frequencyOptions = [
    { id: "1", name: "Daily", icon: "calendar-today" },
    { id: "2", name: "Weekly", icon: "calendar-week" },
    { id: "3", name: "Bi-weekly", icon: "calendar-weekend" },
    { id: "4", name: "Monthly", icon: "calendar-month" },
    { id: "5", name: "Quarterly", icon: "calendar-range" },
    { id: "6", name: "Annually", icon: "calendar-star" },
  ];

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Validate form
  const validateForm = () => {
    let tempErrors = {};
    
    if (!amount) tempErrors.amount = "Amount is required";
    else if (isNaN(parseFloat(amount))) tempErrors.amount = "Amount must be a number";
    else if (parseFloat(amount) <= 0) tempErrors.amount = "Amount must be greater than 0";
    
    if (!category) tempErrors.category = "Category is required";
    if (!paymentMethod) tempErrors.paymentMethod = "Payment method is required";
    if (isRecurring && !frequency) tempErrors.frequency = "Frequency is required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Create income object
      const incomeData = {
        amount: parseFloat(amount),
        category,
        date,
        description,
        source,
        paymentMethod,
        isRecurring,
        frequency: isRecurring ? frequency : null,
        id: Date.now().toString(), // temporary ID
      };

      // Here you would typically save the income to your database or state
      console.log("Income data:", incomeData);
      
      // Show success message
      Alert.alert(
        "Success",
        "Income added successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form and navigate back
              resetForm();
              navigation?.goBack();
            },
          },
        ]
      );
    }
  };

  // Reset form
  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDate(new Date());
    setDescription("");
    setSource("");
    setPaymentMethod("");
    setIsRecurring(false);
    setFrequency("monthly");
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Amount Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount*</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </View>
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>

        {/* Category Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category*</Text>
          <TouchableOpacity
            style={[
              styles.selectButton,
              errors.category && styles.inputError,
            ]}
            onPress={() => setShowCategoryModal(true)}
          >
            {category ? (
              <View style={styles.selectedOption}>
                <Icon
                  name={
                    incomeCategories.find((c) => c.name === category)?.icon ||
                    "help-circle"
                  }
                  size={20}
                  color="#4CAF50"
                />
                <Text style={styles.selectedOptionText}>{category}</Text>
              </View>
            ) : (
              <Text style={styles.placeholderText}>Select Category</Text>
            )}
            <Icon name="chevron-down" size={20} color="#a0aec0" />
          </TouchableOpacity>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        {/* Source Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Source</Text>
          <TextInput
            style={styles.textInput}
            value={source}
            onChangeText={setSource}
            placeholder="e.g. Company Name, Client, etc."
          />
        </View>

        {/* Date Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.selectedOption}>
              <Icon name="calendar" size={20} color="#4CAF50" />
              <Text style={styles.selectedOptionText}>{formatDate(date)}</Text>
            </View>
            <Icon name="chevron-down" size={20} color="#a0aec0" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Payment Method Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Payment Method*</Text>
          <TouchableOpacity
            style={[
              styles.selectButton,
              errors.paymentMethod && styles.inputError,
            ]}
            onPress={() => setShowPaymentModal(true)}
          >
            {paymentMethod ? (
              <View style={styles.selectedOption}>
                <Icon
                  name={
                    paymentMethods.find((p) => p.name === paymentMethod)?.icon ||
                    "help-circle"
                  }
                  size={20}
                  color="#4CAF50"
                />
                <Text style={styles.selectedOptionText}>{paymentMethod}</Text>
              </View>
            ) : (
              <Text style={styles.placeholderText}>Select Payment Method</Text>
            )}
            <Icon name="chevron-down" size={20} color="#a0aec0" />
          </TouchableOpacity>
          {errors.paymentMethod && (
            <Text style={styles.errorText}>{errors.paymentMethod}</Text>
          )}
        </View>

        {/* Recurring Income Toggle */}
        <View style={styles.formGroup}>
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Recurring Income</Text>
            <TouchableOpacity
              style={[styles.toggleButton, isRecurring && styles.toggleButtonActive]}
              onPress={() => setIsRecurring(!isRecurring)}
            >
              <View
                style={[
                  styles.toggleCircle,
                  isRecurring && styles.toggleCircleActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Frequency Selection (only if recurring) */}
        {isRecurring && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Frequency*</Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                errors.frequency && styles.inputError,
              ]}
              onPress={() => setShowFrequencyModal(true)}
            >
              {frequency ? (
                <View style={styles.selectedOption}>
                  <Icon
                    name={
                      frequencyOptions.find(
                        (f) => f.name.toLowerCase() === frequency.toLowerCase()
                      )?.icon || "calendar"
                    }
                    size={20}
                    color="#4CAF50"
                  />
                  <Text style={styles.selectedOptionText}>
                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                  </Text>
                </View>
              ) : (
                <Text style={styles.placeholderText}>Select Frequency</Text>
              )}
              <Icon name="chevron-down" size={20} color="#a0aec0" />
            </TouchableOpacity>
            {errors.frequency && (
              <Text style={styles.errorText}>{errors.frequency}</Text>
            )}
          </View>
        )}

        {/* Description Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Add notes about this income"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Save Income</Text>
          </TouchableOpacity>
        </View>

        {/* Category Selection Modal */}
        <Modal
          visible={showCategoryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Category</Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                  <Icon name="close" size={24} color="#2d3748" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScrollView}>
                {incomeCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.modalOption}
                    onPress={() => {
                      setCategory(cat.name);
                      setShowCategoryModal(false);
                    }}
                  >
                    <View style={styles.modalOptionIcon}>
                      <Icon name={cat.icon} size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.modalOptionText}>{cat.name}</Text>
                    {category === cat.name && (
                      <Icon name="check" size={20} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Payment Method Selection Modal */}
        <Modal
          visible={showPaymentModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPaymentModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Payment Method</Text>
                <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                  <Icon name="close" size={24} color="#2d3748" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScrollView}>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={styles.modalOption}
                    onPress={() => {
                      setPaymentMethod(method.name);
                      setShowPaymentModal(false);
                    }}
                  >
                    <View style={styles.modalOptionIcon}>
                      <Icon name={method.icon} size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.modalOptionText}>{method.name}</Text>
                    {paymentMethod === method.name && (
                      <Icon name="check" size={20} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Frequency Selection Modal */}
        <Modal
          visible={showFrequencyModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFrequencyModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Frequency</Text>
                <TouchableOpacity onPress={() => setShowFrequencyModal(false)}>
                  <Icon name="close" size={24} color="#2d3748" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScrollView}>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.modalOption}
                    onPress={() => {
                      setFrequency(option.name.toLowerCase());
                      setShowFrequencyModal(false);
                    }}
                  >
                    <View style={styles.modalOptionIcon}>
                      <Icon name={option.icon} size={20} color="#4CAF50" />
                    </View>
                    <Text style={styles.modalOptionText}>{option.name}</Text>
                    {frequency === option.name.toLowerCase() && (
                      <Icon name="check" size={20} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
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
  formGroup: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4a5568",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#2d3748",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
  },
  currencySymbol: {
    paddingHorizontal: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d3748",
  },
  amountInput: {
    flex: 1,
    padding: 12,
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748",
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    height: 50,
  },
  selectedOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedOptionText: {
    fontSize: 16,
    color: "#2d3748",
    marginLeft: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: "#a0aec0",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e2e8f0",
    padding: 2,
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#4CAF50",
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ffffff",
  },
  toggleCircleActive: {
    transform: [{ translateX: 20 }],
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flex: 2,
    marginLeft: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#4a5568",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#e53e3e",
    fontSize: 12,
    marginTop: 5,
  },
  inputError: {
    borderColor: "#e53e3e",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
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
  modalScrollView: {
    maxHeight: "100%",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f7fafc",
  },
  modalOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f7fafc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#2d3748",
    flex: 1,
  },
});

export default AddIncomeScreen;