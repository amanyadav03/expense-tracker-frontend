import axios from "axios";
import * as endpoint from './endpoints';

export function userLogin(payload){
    return axios.post(endpoint.getEndpoint('AUTH', 'login'), payload);
} 

export function addExpense(payload, token) {
    return axios.post(
        endpoint.getEndpoint('AUTH', 'expense'), payload, {  headers: { 'Authorization': `Bearer ${token}`,} } );
}

export function getExpenses(token){
    return axios.get(endpoint.getEndpoint('AUTH', 'expense'), {headers:{Authorization:`Bearer ${token}`}});
}