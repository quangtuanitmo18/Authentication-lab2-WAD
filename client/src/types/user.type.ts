type Role = 'User' | 'Admin'
export interface User {
  _id?: string

  email?: string
  name?: string
  username?: string
  date_of_birth?: string //iso 8610

  avatar?: string

  createdAt?: string
  updatedAt?: string
}
