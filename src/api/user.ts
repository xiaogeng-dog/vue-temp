import http from '@/service/HttpClient'
import type BaseResponse from '@/model/BaseResponse'

export interface LoginData {
  email: string
  password: string
}

export interface LoginRes {
  token: string
}

export interface UserState {
  uid?: number
  name?: string
  avatar?: string
}

export async function login(data: LoginData): Promise<BaseResponse<any>> {
  const res = await http.server().post('/auth/login', { params: data })
  return res.data
}

export async function logout(): Promise<BaseResponse<any>> {
  const res = await http.server().post('/user/logout')
  return res.data
}

export async function getUserInfo(): Promise<BaseResponse<UserState>> {
  const res = await http.server().post('/user/me')
  return res.data
}

export async function getEmailCode(): Promise<BaseResponse<any>> {
  const res = await http.server().get('/user/email-code')
  return res.data
}

export async function resetPassword(): Promise<BaseResponse<any>> {
  const res = await http.server().post('/user/reset-password')
  return res.data
}

export async function register(): Promise<BaseResponse<any>> {
  const res = await http.server().post('/user/register')
  return res.data
}
