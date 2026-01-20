import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// 简化的用户类型定义（项目暂未接后端，可先用占位类型）
export interface UserInfoDto {
  id?: string | number
  name?: string
  [key: string]: any
}

export interface LoginResponseDto {
  user: UserInfoDto | null
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  // 状态
  user: UserInfoDto | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  // Actions
  setAuth: (data: LoginResponseDto) => void
  clearAuth: () => void
  updateUser: (user: Partial<UserInfoDto>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Actions
      setAuth: (data: LoginResponseDto) => {
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        })
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      updateUser: (userData: Partial<UserInfoDto>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }))
      },
    }),
    {
      name: 'USER_INFO_STORE', // localStorage key
      storage: createJSONStorage(() => localStorage), // 使用localStorage
    }
  )
)
