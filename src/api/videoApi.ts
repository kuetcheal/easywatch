import httpClient from "./httpClient"
import type {
  ApiParams,
  Comment,
  CommentPayload,
  DislikePayload,
  Id,
  LikePayload,
  UpdateVideoPayload,
  UploadVideoPayload,
  Video,
} from "./types"

export const videoApi = {
  getAll: (params: ApiParams = {}) =>
    httpClient.get<Video[]>("/api/videos", { params }),

  getOne: (id: Id) =>
    httpClient.get<Video>(`/api/videos/${id}`),

  upload: ({ title, categoryId, file }: UploadVideoPayload) => {
    const formData = new FormData()

    formData.append("title", title)

    if (categoryId !== null && categoryId !== undefined && categoryId !== "") {
      formData.append("categoryId", String(categoryId))
    }

    formData.append("video", file)

    return httpClient.post<Video>("/api/videos/upload", formData)
  },

  update: (id: Id, payload: UpdateVideoPayload) =>
    httpClient.patch<Video>(`/api/videos/${id}`, payload),

  remove: (id: Id) =>
    httpClient.delete<void>(`/api/videos/${id}`),

  addView: (id: Id) =>
    httpClient.post<{ message: string }>(`/api/videos/${id}/view`),

  setLike: (id: Id, liked: boolean) =>
    httpClient.post<LikePayload>(`/api/videos/${id}/like`, { liked }),

  setDislike: (id: Id, disliked: boolean) =>
    httpClient.post<DislikePayload>(`/api/videos/${id}/dislike`, { disliked }),

  getComments: (id: Id) =>
    httpClient.get<Comment[]>(`/api/videos/${id}/comments`),

  addComment: (id: Id, content: string, authorName: string | null = null) =>
    httpClient.post<Comment>(`/api/videos/${id}/comments`, {
      content,
      authorName,
    } satisfies CommentPayload),
}