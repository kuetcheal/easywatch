import httpClient from "./httpClient"
import type { Client, ClientPayload, Id } from "./types"

export const clientApi = {
  getAll: () => httpClient.get<Client[]>("/api/clients"),

  create: (data: ClientPayload) =>
    httpClient.post<Client>("/api/clients", data),

  remove: (id: Id) =>
    httpClient.delete<void>(`/api/clients/${id}`),
}