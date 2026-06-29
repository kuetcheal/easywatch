import httpClient from "./httpClient"
import type { AuthResponse, RegisterPayload, UpdateMePayload, User } from "./types"

export const authApi = {
  login: (email: string, password: string) =>
    httpClient.post<AuthResponse>("/api/login", { email, password }),

  register: (data: RegisterPayload) =>
    httpClient.post<AuthResponse>("/api/register", data),

  confirmEmail: (email: string, code: string) =>
    httpClient.post<{ message: string }>("/api/confirm", { email, code }),

  resendConfirmation: (email: string) =>
    httpClient.post<{ message: string }>("/api/resend-confirmation", { email }),

  forgotPassword: (email: string) =>
    httpClient.post<{ message: string }>("/api/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    httpClient.post<{ message: string }>("/api/reset-password", {
      token,
      password,
    }),

  me: () => httpClient.get<User>("/api/me"),

  updateMe: (payload: UpdateMePayload) =>
    httpClient.put<User>("/api/me", payload),

  deleteMe: () => httpClient.delete<void>("/api/me"),
}