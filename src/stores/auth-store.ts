import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import type { User } from '@/features/auth/models'

const ACCESS_TOKEN = 'access_token'

// 游客模式标记性 token 值；api.ts 的 adapter 据此判断是否走 mock
const GUEST_TOKEN = 'guest'

/**
 * 游客身份的假用户信息 / Guest mock user
 * isGuest 不持久化（仅内存），刷新后回到登录态
 */
const guestUser: User = {
  id: 'guest',
  username: '游客',
  email: '',
  role: 'guest',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
}

interface AuthState {
  auth: {
    user: User | null
    setUser: (user: User | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    // 游客模式相关
    isGuest: boolean
    enterGuestMode: () => void
    exitGuestMode: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const initToken = getCookie(ACCESS_TOKEN) || ''
  return {
    auth: {
      user: null,
      isGuest: initToken === GUEST_TOKEN,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, accessToken)
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', isGuest: false },
          }
        }),
      // 进入游客模式：写入标记性 token（供 adapter 判断）+ 假用户信息
      enterGuestMode: () =>
        set((state) => {
          setCookie(ACCESS_TOKEN, GUEST_TOKEN)
          return {
            ...state,
            auth: {
              ...state.auth,
              isGuest: true,
              accessToken: GUEST_TOKEN,
              user: guestUser,
            },
          }
        }),
      // 退出游客模式（等同于 reset）
      exitGuestMode: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', isGuest: false },
          }
        }),
    },
  }
})
