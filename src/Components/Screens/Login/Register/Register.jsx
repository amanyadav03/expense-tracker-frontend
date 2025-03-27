import { Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, TextInputBase, TouchableOpacity, View } from "react-native";
import LoginRegisterStyles from "../../../../Styles/LoginRegisterStyles";
import { useState } from "react";
import { userRegister } from "../../../../Services/api";

const RegisterScreen=({navigation})=>{
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [mobile, setMobile] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async()=>{
        try{
            if(!name|| !email|| !userName || !password || ! confirmPassword || !mobile){
                setError('Please fill all the fields');
                return;
            }
            if(password !== confirmPassword){
                setError('Passwords do not match!!');
                return;
            }
            setLoading(true);
            const payload = {
                name,
                email,
                userName,
                mobile,
                password,
                role
            }
            const response = await userRegister(payload);
            if(response.status === 200){
                Alert.alert('You are registered , please login to continue');
            }

        }catch(err){
            console.log(err);
            setError(err.message)
        }finally{
            setLoading(false);
        }
    }
    return(
        <SafeAreaView style={LoginRegisterStyles.container}>
            <KeyboardAvoidingView>
                <ScrollView style={LoginRegisterStyles.scrollView}>
                    <View>
                        <View style={LoginRegisterStyles.logoContainer}>
                        <Text style={LoginRegisterStyles.appName}>Expense Tracker</Text>
                        </View>
                    </View>
                    <View style={LoginRegisterStyles.formContainer}>
                        <Text style={LoginRegisterStyles.welcomeText}>Let's get you Started 👋</Text>
                        <Text style={LoginRegisterStyles.errorText}>{error}</Text>
                        <Text style={LoginRegisterStyles.label}>Name</Text>
                        <View style={LoginRegisterStyles.inputContainer}>
                        <TextInput
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        placeholder="Enter your name"
                        style={LoginRegisterStyles.input}/>
                        </View>
                        <Text style={LoginRegisterStyles.label}>Email</Text>
                        <View style={LoginRegisterStyles.inputContainer}>
                            <TextInput
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            placeholder="Enter email"
                            style={LoginRegisterStyles.input}/>
                        </View>
                        <Text style={LoginRegisterStyles.label}>Phone Number</Text>
                        <View style={LoginRegisterStyles.inputContainer}>
                        <TextInput
                        value={mobile}
                        onChange={(e)=>setMobile(e.target.value)}
                        placeholder="Enter your Number"
                        style={LoginRegisterStyles.input}/>
                        </View>
                        <Text style={LoginRegisterStyles.label}>Role</Text>
                        <View style={LoginRegisterStyles.inputContainer}>
                        <TextInput
                        value={role}
                        onChange={(e)=>setRole(e.target.value)}
                        placeholder="what do you do"
                        style={LoginRegisterStyles.input}/>
                        </View>

                        <Text style={LoginRegisterStyles.label}>UserName</Text>
                        <View style={LoginRegisterStyles.inputContainer}>
                        <TextInput
                        value={userName}
                        onChange={(e)=>setUserName(e.target.value)}
                        placeholder="Choose your userName"
                        style={LoginRegisterStyles.input}/>
                        </View>

                        <Text style={LoginRegisterStyles.label}>Password</Text>
                        <View style={LoginRegisterStyles.inputContainer}>
                        <TextInput
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        placeholder="Choose your Password"
                        style={LoginRegisterStyles.input}
                        secureTextEntry={true}/>
                        </View>

                        <Text style={LoginRegisterStyles.label}>Confirm Password</Text>
                        <View style={LoginRegisterStyles.inputContainer}>
                        <TextInput
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        placeholder="Re-Enter Password"
                        style={LoginRegisterStyles.input}
                        secureTextEntry={true}/>
                        </View>

                        <TouchableOpacity style={LoginRegisterStyles.loginButton} disabled={loading} onPress={handleRegister}>
                            <Text style={LoginRegisterStyles.loginButtonText}>{loading?'Signing...':'Sign Up'}</Text>
                        </TouchableOpacity>
                        <View style={LoginRegisterStyles.signupContainer}>
                        <Text style={LoginRegisterStyles.signupText}>Already have an account?</Text>
                        <TouchableOpacity onPress={()=>navigation.navigate('login')}>
                            <Text style={LoginRegisterStyles.signupLink}>Log In</Text>
                        </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default RegisterScreen;