export interface SuccessResponseApi<Data> {
  message: string
  result: Data
}
export interface ErrorResponseApi<Data> {
  message: string
  errors?: Data
}

export type NotUndefinedFiled<T> = {
  [P in keyof T]-?: NotUndefinedFiled<NonNullable<T[P]>>
}
