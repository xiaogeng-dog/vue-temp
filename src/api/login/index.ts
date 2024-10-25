import http from '@/service/HttpClient'
import type BaseResponse from '@/model/BaseResponse'
import { getRefreshToken } from '@/utils/auth'
import type { RegisterVO, UserLoginVO } from './types'

export interface SmsCodeVO {
  mobile: string
  scene: number
}

export interface SmsLoginVO {
  mobile: string
  code: string
}

// 登录
export const login = (data: UserLoginVO): Promise<BaseResponse<any>> => {
  return http.server().post('/system/auth/login', data)
}

// 注册
export const register = (data: RegisterVO): Promise<BaseResponse<any>> => {
  return http.server().post('/system/auth/register', data)
}

// 刷新访问令牌
export const refreshToken = (): Promise<BaseResponse<any>> => {
  return http.server().post('/system/auth/refresh-token?refreshToken=' + getRefreshToken())
}

// 使用租户名，获得租户编号
export const getTenantIdByName = (name: string): Promise<BaseResponse<any>> => {
  return http.server().get('/system/tenant/get-id-by-name?name=' + name)
}

// 使用租户域名，获得租户信息
export const getTenantByWebsite = (website: string): Promise<BaseResponse<any>> => {
  return http.server().get('/system/tenant/get-by-website?website=' + website)
}

// 登出
export const loginOut = (): Promise<BaseResponse<any>> => {
  return http.server().post('/system/auth/logout')
}

// 获取用户权限信息
export const getInfo = (): Promise<BaseResponse<any>> => {
  return http.server().get('/system/auth/get-permission-info')
}

//获取登录验证码
export const sendSmsCode = (data: SmsCodeVO): Promise<BaseResponse<any>> => {
  return http.server().post('/system/auth/send-sms-code', data)
}

// 短信验证码登录
export const smsLogin = (data: SmsLoginVO): Promise<BaseResponse<any>> => {
  return http.server().post('/system/auth/sms-login', data)
}

// 社交快捷登录，使用 code 授权码
export function socialLogin(type: string, code: string, state: string): Promise<BaseResponse<any>> {
  return http.server().post('/system/auth/social-login', {
    type,
    code,
    state
  })
}

// 社交授权的跳转
export const socialAuthRedirect = (
  type: number,
  redirectUri: string
): Promise<BaseResponse<any>> => {
  return http
    .server()
    .get('/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri)
}
// 获取验证图片以及 token
export const getCode = (data): Promise<BaseResponse<any>> => {
  return http.server().post('system/captcha/get', data)
}

// 滑动或者点选验证
export const reqCheck = (data): Promise<BaseResponse<any>> => {
  return http.server().post('system/captcha/check', data)
}
