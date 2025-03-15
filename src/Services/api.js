import axios from "axios";
import * as endpoint from './endpoints';

export function userLogin(payload){
    return axios.post(endpoint.getEndpoint('AUTH', 'login'), payload);
} 