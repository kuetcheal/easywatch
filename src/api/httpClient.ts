import axios, { type InternalAxiosRequestConfig } from "axios"

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
})

const PUBLIC_ENDPOINTS = [
  "/api/login",
  "/api/register",
  "/api/confirm",
  "/api/resend-confirmation",
  "/api/forgot-password",
  "/api/reset-password",
]

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const url = config.url || ""
  const isPublic = PUBLIC_ENDPOINTS.some((path) => url.startsWith(path))

  if (!isPublic) {
    const token = localStorage.getItem("access_token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }
  } else {
    delete config.headers.Authorization
  }

  return config
})

export default httpClient