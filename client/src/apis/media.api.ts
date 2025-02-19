import { Media } from 'src/types/media.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

export const mediaApi = {
  uploadImage(body: FormData) {
    return http.post<SuccessResponseApi<Media>>('medias/upload-image', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
