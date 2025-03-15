import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  Image,
  Alert,
  SafeAreaView
} from "react-native";

import { userLogin } from "../../../../Services/api";
import decodeJWT from "../../../../Utils/jwtDecode/jwtDecode";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../Redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const validate = () => {
    let tempErrors = {};
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Email is invalid";
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async() => {
    if (validate()) {
      setIsLoading(true);
      const data= {
        userName: email,
        password: password
      }
      const response = await userLogin(data);
      if(response.status===200|| response.status ===201){
        const token = response.data.token;
        const decoded = decodeJWT(token);
        await AsyncStorage.setItem('authToken', token)
        const payload={
          token:token,
          userName:decoded.userName,
          userId: decoded.userId,
          mobile: decoded.mobile,
          role: decoded.role,

        }
        dispatch(setToken(payload))
        console.log(decoded);
      }
      setTimeout(() => {
        setIsLoading(false);
        // For demo purposes, just show a success message
        Alert.alert("Success", "Login successful!");
        // In a real app, you would navigate to the main app screen
        // navigation.navigate('Home');
      }, 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={styles.logo}
            />
            <Text style={styles.appName}>ExpenseTracker</Text>
            <Text style={styles.tagline}>Manage your finances with ease</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                style={styles.input}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              // disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
     flex: 1,
    backgroundColor: "#f5f7fa",
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e5bff",
    marginTop: 10,
  },
  tagline: {
    fontSize: 14,
    color: "#8a94a6",
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#8a94a6",
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4a5568",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f7fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#e53e3e",
    fontSize: 12,
    marginTop: 5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#2e5bff",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#2e5bff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: "#a0aec0",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#718096",
    fontSize: 14,
  },
  signupLink: {
    color: "#2e5bff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Login;