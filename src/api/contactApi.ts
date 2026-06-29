import httpClient from "./httpClient"
import type { CastingPayload, ContactMessage, ContactPayload, Id } from "./types"

export const contactApi = {
  send: (payload: ContactPayload) =>
    httpClient.post<{ message: string }>("/api/contact", payload),

  applyCasting: (payload: CastingPayload) =>
    httpClient.post<{ message: string }>("/api/castings/apply", payload),

  getAllMessages: () =>
    httpClient.get<ContactMessage[]>("/api/contact/messages?type=contact"),

  getAllCastings: () =>
    httpClient.get<ContactMessage[]>("/api/contact/messages?type=casting"),

  removeMessage: (id: Id) =>
    httpClient.delete<void>(`/api/contact/messages/${id}`),

  removeCasting: (id: Id) =>
    httpClient.delete<void>(`/api/contact/messages/${id}`),
}