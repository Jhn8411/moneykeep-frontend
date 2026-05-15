import axios from 'axios';

const api = axios.create({
  baseURL: 'https://moneykeep-api-tcc.onrender.com', // A URL do seu backend!
});

// Este interceptador é mágico: ele pega o Token do localStorage 
// e injeta automaticamente em TODAS as requisições futuras!
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('@MoneyKeep:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;