import { defineStore } from 'pinia'
import type { LoginData, UserState } from '@/api/user'
import { clearToken, setToken } from '@/utils/auth'

import {
  getEmailCode,
  getUserInfo,
  resetPassword,
  login as userLogin,
  logout as userLogout,
  register as userRegister
} from '@/api/user'

interface AuthStore {
  // 鉴权令牌
  userInfo: UserState
}

const InitUserInfo = {
  uid: 0,
  name: '',
  avatar: ''
}

export const useAuthStore = defineStore('authState', {
  state: (): AuthStore => ({
    userInfo: {
      uid: 0,
      name: '',
      avatar: ''
    }
  }),
  getters: {},
  actions: {
    // Set user's information
    setInfo(partial: Nullable<Partial<UserState>>) {
      this.userInfo = { ...partial }
    },
    async login(loginForm: LoginData) {
      try {
        const { data } = await userLogin(loginForm)
        setToken(data.token)
      } catch (error) {
        clearToken()
        throw error
      }
    },

    async info() {
      try {
        const { data } = await getUserInfo()
        this.setInfo(data)
      } catch (error) {
        clearToken()
        throw error
      }
    },

    async logout() {
      try {
        await userLogout()
      } finally {
        clearToken()
        this.setInfo({ ...InitUserInfo })
      }
    },

    async getCode() {
      try {
        const data = await getEmailCode()
        return data
      } catch {}
    },

    async reset() {
      try {
        const data = await resetPassword()
        return data
      } catch {}
    },

    async register() {
      try {
        const data = await userRegister()
        return data
      } catch {}
    }
  }
})
