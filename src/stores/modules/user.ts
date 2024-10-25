import { defineStore } from 'pinia'
import { getAccessToken } from '@/utils/auth'
import type { LoginData, UserState } from '@/api/user'
import { clearToken, setToken } from '@/utils/auth'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { getInfo } from '@/api/login'

const { wsCache } = useCache()

import {
  getEmailCode,
  getUserInfo,
  resetPassword,
  login as userLogin,
  logout as userLogout,
  register as userRegister
} from '@/api/user'

interface UserVO {
  id: number
  avatar: string
  nickname: string
  deptId: number
}

interface AuthStore {
  // 鉴权令牌
  userInfo: UserState
  // USER 缓存
  permissions: string[]
  roles: string[]
  isSetUser: boolean
  user: UserVO
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
    },
    permissions: [],
    roles: [],
    isSetUser: false,
    user: {
      id: 0,
      avatar: '',
      nickname: '',
      deptId: 0
    }
  }),
  getters: {
    getIsSetUser(): boolean {
      return this.isSetUser
    }
  },
  actions: {
    async setUserInfoAction() {
      if (!getAccessToken()) {
        this.resetState()
        return null
      }
      let userInfo = wsCache.get(CACHE_KEY.USER)
      if (!userInfo) {
        userInfo = await getInfo()
      }
      this.permissions = userInfo.permissions
      this.roles = userInfo.roles
      this.user = userInfo.user
      this.isSetUser = true
      wsCache.set(CACHE_KEY.USER, userInfo)
      wsCache.set(CACHE_KEY.ROLE_ROUTERS, userInfo.menus)
    },
    resetState() {
      this.permissions = []
      this.roles = []
      this.isSetUser = false
      this.user = {
        id: 0,
        avatar: '',
        nickname: '',
        deptId: 0
      }
    },
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
