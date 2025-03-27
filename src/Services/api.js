import axios from "axios";
import * as endpoint from './endpoints';

export function userLogin(payload){
    return axios.post(endpoint.getEndpoint('AUTH', 'login'), payload);
} 

export function userRegister(payload){
    return axios.post(endpoint.getEndpoint('AUTH', 'register'), payload )
}

export function addExpense(payload, token) {
    return axios.post(
        endpoint.getEndpoint('AUTH', 'expense'), payload, {  headers: { 'Authorization': `Bearer ${token}`,} } );
}

export function getExpenses(token){
    return axios.get(endpoint.getEndpoint('AUTH', 'expense'), {headers:{Authorization:`Bearer ${token}`}});
}

export function addIncome(payload, token) {
    return axios.post(
        endpoint.getEndpoint('AUTH', 'income'), payload, {  headers: { 'Authorization': `Bearer ${token}`,} } );
}

export function getIncome(token){
    return axios.get(endpoint.getEndpoint('AUTH', 'income'), {headers:{Authorization:`Bearer ${token}`}});
}

export function getDashboard(token){
    return axios.get(endpoint.getEndpoint('AUTH', 'dashboard'), {headers:{Authorization:`Bearer ${token}`}});
}