import axios from 'axios'

const api=axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL||'http://13.233.142.226:8080/api',
  headers: {'Content-Type': 'application/json'}
})

api.interceptors.request.use((config) => {
  try {
    const raw=localStorage.getItem('auth')
    if(raw) {
      const parsed=JSON.parse(raw)
      const token=parsed?.token
      if(token) {
        config.headers=config.headers||{}
        config.headers.Authorization=`Bearer ${token}`
      }
    }
  } catch {
    localStorage.removeItem('auth')
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status=err.response?.status
    const hasAuth=Boolean(localStorage.getItem('auth'))
    if(status&&[401, 403].includes(status)&&!window.location.pathname.startsWith('/login')) {
      if(status===401||(status===403&&hasAuth)) {
        localStorage.removeItem('auth')
        window.location.href='/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
