import AsyncStorage from "@react-native-async-storage/async-storage"
import decodeJWT from "../jwtDecode/jwtDecode";
import { useDispatch } from "react-redux";
import { setToken } from "../../Redux/authSlice";
import React, { useEffect } from "react";

const RestoreLogin =()=>{
    const dispatch = useDispatch();
    useEffect(()=>{
        const restore = async()=>{
            const token =  await AsyncStorage.getItem('authToken');
            if(token){
                const decoded = decodeJWT(token);
                const payload={
                    token:token,
                    userName:decoded.userName,
                    userId: decoded.userId,
                    mobile: decoded.mobile,
                    role: decoded.role,
          
                  }
                dispatch(setToken(payload));
            }
        }
        restore();
    },[dispatch])
    return null;

    
}
export default RestoreLogin;