import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nfe.api.nfe.io/v2/productinvoices'
//  baseURL: 'https://api.github.com',
});

export default api;
