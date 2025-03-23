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
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { addExpense } from "../../../../Services/api";

const AddExpense = ({ navigation }) => {
  // States already defined by user
  const [category, setCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Additional states for UI control
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [errors, setErrors] = useState({});

  const token = useSelector((state) => state.auth.token);

  // Mock data for categories and payment methods
  const predefinedCategories = [
    { id: "1", name: "Food & Dining", icon: "food" },
    { id: "2", name: "Transportation", icon: "car" },
    { id: "3", name: "Shopping", icon: "shopping" },
    { id: "4", name: "Entertainment", icon: "movie" },
    { id: "5", name: "Utilities", icon: "flash" },
    { id: "6", name: "Healthcare", icon: "medical-bag" },
    { id: "7", name: "Education", icon: "school" },
    { id: "8", name: "Travel", icon: "airplane" },
    { id: "9", name: "Housing", icon: "home" },
    { id: "10", name: "Other", icon: "dots-horizontal" },
  ];

  const paymentMethods = [
    { id: "1", name: "Cash", icon: "cash" },
    { id: "2", name: "Credit Card", icon: "credit-card" },
    { id: "3", name: "Debit Card", icon: "credit-card-outline" },
    { id: "4", name: "Bank Transfer", icon: "bank" },
    { id: "5", name: "Mobile Payment", icon: "cellphone" },
  ];

  // Initialize categoryList with predefined categories
  useEffect(() => {
    setCategoryList(predefinedCategories);
  }, []);

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
    else if (isNaN(parseFloat(amount)))
      tempErrors.amount = "Amount must be a number";
    else if (parseFloat(amount) <= 0)
      tempErrors.amount = "Amount must be greater than 0";

    if (!category) tempErrors.category = "Category is required";
    if (!paymentMethod) tempErrors.paymentMethod = "Payment method is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      if (!token) {
        Alert.alert("Please Login First!!");
      }
      try{
        const expenseData = {
        amount: Number(amount),
        category,
        date: date.toISOString(),
        description,
        paymentMethod,
      };
      console.log("Expense data:", expenseData);

      const response = await addExpense(expenseData, token);
      if (response.status === 200) {
        Alert.alert("Success", "Expense added successfully!", [
          {
            text: "OK",
            onPress: () => {
              resetForm();
            },
          },
        ]);
      }

      }catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', error.response?.data || error.message);
          Alert.alert('Error', error.response?.data?.message || 'Failed');
        } else if (error instanceof Error) {
          console.error('Error:', error.message);
          Alert.alert('Error', error.message || 'Something went wrong.');
        } else {
          console.error('Unknown error:', error);
          Alert.alert('Error', 'An unexpected error occurred.');
        }
      } 
      
      // Show success message
    }
  };

  // Reset form
  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDate(new Date());
    setDescription("");
    setPaymentMethod("");
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <View style={styles.backButton} />
        </View> */}

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
          {errors.amount && (
            <Text style={styles.errorText}>{errors.amount}</Text>
          )}
        </View>

        {/* Category Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category*</Text>
          <TouchableOpacity
            style={[styles.selectButton, errors.category && styles.inputError]}
            onPress={() => setShowCategoryModal(true)}
          >
            {category ? (
              <View style={styles.selectedOption}>
                <Icon
                  name={
                    predefinedCategories.find((c) => c.name === category)
                      ?.icon || "help-circle"
                  }
                  size={20}
                  color="#2e5bff"
                />
                <Text style={styles.selectedOptionText}>{category}</Text>
              </View>
            ) : (
              <Text style={styles.placeholderText}>Select Category</Text>
            )}
            <Icon name="chevron-down" size={20} color="#a0aec0" />
          </TouchableOpacity>
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
        </View>

        {/* Date Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.selectedOption}>
              <Icon name="calendar" size={20} color="#2e5bff" />
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
                    paymentMethods.find((p) => p.name === paymentMethod)
                      ?.icon || "help-circle"
                  }
                  size={20}
                  color="#2e5bff"
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

        {/* Description Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Add notes about this expense"
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
            <Text style={styles.saveButtonText}>Save Expense</Text>
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
                {categoryList.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.modalOption}
                    onPress={() => {
                      setCategory(cat.name);
                      setShowCategoryModal(false);
                    }}
                  >
                    <View style={styles.modalOptionIcon}>
                      <Icon name={cat.icon} size={20} color="#2e5bff" />
                    </View>
                    <Text style={styles.modalOptionText}>{cat.name}</Text>
                    {category === cat.name && (
                      <Icon name="check" size={20} color="#2e5bff" />
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
                      <Icon name={method.icon} size={20} color="#2e5bff" />
                    </View>
                    <Text style={styles.modalOptionText}>{method.name}</Text>
                    {paymentMethod === method.name && (
                      <Icon name="check" size={20} color="#2e5bff" />
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
    minHeight: 100,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: "#2e5bff",
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

export default AddExpense;
