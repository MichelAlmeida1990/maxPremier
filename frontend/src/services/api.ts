import axios from 'axios'

// Garantir que a URL sempre termine com /api
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL
  if (!envURL) return '/api'
  
  // Se já termina com /api, retornar como está
  if (envURL.endsWith('/api')) return envURL
  
  // Se termina com /, remover e adicionar /api
  if (envURL.endsWith('/')) return `${envURL}api`
  
  // Caso contrário, adicionar /api
  return `${envURL}/api`
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
})

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      console.error('Erro de conexão: Backend não está acessível')
    }
    return Promise.reject(error)
  }
)

export default api

