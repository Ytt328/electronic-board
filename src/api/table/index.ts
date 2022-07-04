import { useAxios } from '@/hooks/web/useAxios'
import type { ProductTableData, UserTableData } from './types'

const request = useAxios()

export const getProductTableListApi = ({ params }) => {
  return request.get<{
    total: number
    list: ProductTableData[]
  }>({ url: '/product/list', params })
}

export const saveProductTableApi = ({ data }) => {
  return request.post<ProductTableData>({ url: '/product/save', data })
}

export const getProductTableDetApi = ({ params }) => {
  return request.get<ProductTableData>({ url: '/product/detail', params })
}

export const delProductTableListApi = ({ data }) => {
  return request.post({ url: '/product/delete', data })
}

export const getUserTableListApi = ({ params }) => {
  return request.get<{
    total: number
    list: UserTableData[]
  }>({ url: '/user/list', params })
}

export const saveUserTableApi = ({ data }) => {
  return request.post<UserTableData>({ url: '/user/save', data })
}

export const getUserTableDetApi = ({ params }) => {
  return request.get<UserTableData>({ url: '/user/detail', params })
}

export const delUserTableListApi = ({ data }) => {
  return request.post({ url: '/user/delete', data })
}
