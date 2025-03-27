import { StyleSheet } from "react-native";

const LoginRegisterStyles = StyleSheet.create({
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

  export default LoginRegisterStyles;