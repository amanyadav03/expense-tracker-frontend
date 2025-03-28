const uri = 'http://10.245.204.51:3000/';

const MS = {
    AUTH : `${uri}auth/`
};

const ENDPOINTS = {
    login: 'login',
    register: 'register',
    expense: 'expense',
    income: 'income',
    dashboard: 'dashboard',
    
};

export function getEndpoint(microservice, key) {
    return `${MS[microservice]}${ENDPOINTS[key]}`;
  }
  