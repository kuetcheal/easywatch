export type Id = string | number

export type ApiParams = Record<string, string | number | boolean | null | undefined>

export interface User {
  id: Id
  email: string
  name?: string
  role?: string
  [key: string]: unknown
}

export interface AuthResponse {
  access_token?: string
  token?: string
  user?: User
  message?: string
}

export interface RegisterPayload {
  email: string
  password: string
  name?: string
  [key: string]: unknown
}

export interface UpdateMePayload {
  name?: string
  email?: string
  password?: string
  [key: string]: unknown
}

export interface Category {
  id: Id
  name?: string
  title?: string
  [key: string]: unknown
}

export interface CategoryPayload {
  name?: string
  title?: string
  description?: string
  [key: string]: unknown
}

export interface Client {
  id: Id
  nom?: string
  name?: string
  email?: string
  mail?: string
  [key: string]: unknown
}

export interface ClientPayload {
  nom?: string
  name?: string
  email?: string
  mail?: string
  [key: string]: unknown
}

export interface ContactPayload {
  name?: string
  email?: string
  message?: string
  subject?: string
  [key: string]: unknown
}

export interface CastingPayload {
  name?: string
  email?: string
  phone?: string
  message?: string
  [key: string]: unknown
}

export interface ContactMessage {
  id: Id
  type?: "contact" | "casting"
  name?: string
  email?: string
  message?: string
  createdAt?: string
  [key: string]: unknown
}

export interface Video {
  id: Id
  title: string
  categoryId?: Id | null
  videoUrl?: string
  url?: string
  views?: number
  likes?: number
  dislikes?: number
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export interface UploadVideoPayload {
  title: string
  categoryId?: Id | null
  file: File
}

export interface UpdateVideoPayload {
  title?: string
  categoryId?: Id | null
  [key: string]: unknown
}

export interface LikePayload {
  liked: boolean
}

export interface DislikePayload {
  disliked: boolean
}

export interface CommentPayload {
  content: string
  authorName?: string | null
}

export interface Comment {
  id: Id
  content: string
  authorName?: string | null
  createdAt?: string
  [key: string]: unknown
}