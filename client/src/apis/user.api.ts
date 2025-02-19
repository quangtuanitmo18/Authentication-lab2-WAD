import { User } from 'src/types/user.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

interface bodyUpdateProfile extends Omit<User, '_id' | 'role' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: string
  new_password?: string
}

interface bodyChangePassword {
  current_password: string
  password: string
  confirm_password: string
}

export const userApi = {
  getProfile() {
    return http.get<SuccessResponseApi<User>>('users/me')
  },
  updateProfile(body: bodyUpdateProfile) {
    return http.put<SuccessResponseApi<User>>('users/me', body)
  },
  changePassword(body: bodyChangePassword) {
    return http.put<{ message: string }>('users/change-password', body)
  },
  uploadAvatar(body: FormData) {
    return http.post<SuccessResponseApi<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
