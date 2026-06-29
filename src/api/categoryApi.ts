import httpClient from "./httpClient"
import type { Category, CategoryPayload, Id } from "./types"

export const categoryApi = {
  getAll: () => httpClient.get<Category[]>("/api/categories"),

  create: (payload: CategoryPayload) =>
    httpClient.post<Category>("/api/categories", payload),

  update: (id: Id, payload: CategoryPayload) =>
    httpClient.patch<Category>(`/api/categories/${id}`, payload),

  remove: (id: Id) =>
    httpClient.delete<void>(`/api/categories/${id}`),
}