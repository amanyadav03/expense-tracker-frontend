import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
import LoginRegisterStyles from "../../../../Styles/LoginRegisterStyles";


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
          monthlyBudget: decoded.monthlyBudget,
          name: decoded.name,

        }
        dispatch(setToken(payload))
        console.log(decoded);
      }
        setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={LoginRegisterStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        
      >
        <ScrollView contentContainerStyle={LoginRegisterStyles.scrollView}>
          <View style={LoginRegisterStyles.logoContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={LoginRegisterStyles.logo}
            />
            <Text style={LoginRegisterStyles.appName}>ExpenseTracker</Text>
            <Text style={LoginRegisterStyles.tagline}>Manage your finances with ease</Text>
          </View>

          <View style={LoginRegisterStyles.formContainer}>
            <Text style={LoginRegisterStyles.welcomeText}>Welcome Back!</Text>
            <Text style={LoginRegisterStyles.subtitle}>Sign in to continue</Text>

            <View style={LoginRegisterStyles.inputContainer}>
              <Text style={LoginRegisterStyles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={LoginRegisterStyles.input}
              />
              {errors.email && <Text style={LoginRegisterStyles.errorText}>{errors.email}</Text>}
            </View>

            <View style={LoginRegisterStyles.inputContainer}>
              <Text style={LoginRegisterStyles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                style={LoginRegisterStyles.input}
              />
              {errors.password && <Text style={LoginRegisterStyles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity style={LoginRegisterStyles.forgotPassword}>
              <Text style={LoginRegisterStyles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[LoginRegisterStyles.loginButton, isLoading && LoginRegisterStyles.loginButtonDisabled]}
              onPress={handleLogin}
              // disabled={isLoading}
            >
              <Text style={LoginRegisterStyles.loginButtonText}>
                {isLoading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <View style={LoginRegisterStyles.signupContainer}>
              <Text style={LoginRegisterStyles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={()=>navigation.navigate('register')}>
                <Text style={LoginRegisterStyles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;