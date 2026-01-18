import { create, StateCreator } from 'zustand'
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware'

/**
 * 创建store的通用工具函数
 * @param stateCreator - Zustand state creator 函数
 * @param options - 可选配置项
 * @returns Zustand store hook
 *
 * @example 不使用持久化
 * ```ts
 * const useStore = createStore((set) => ({
 *   count: 0,
 *   increment: () => set((state) => ({ count: state.count + 1 }))
 * }))
 * ```
 *
 * @example 使用localStorage持久化
 * ```ts
 * const useStore = createStore(
 *   (set) => ({
 *     user: null,
 *     setUser: (user) => set({ user })
 *   }),
 *   {
 *     persist: {
 *       name: 'user-storage'
 *     }
 *   }
 * )
 * ```
 *
 * @example 选择性持久化部分状态
 * ```ts
 * const useStore = createStore(
 *   (set) => ({
 *     user: null,
 *     tempData: null, // 这个不会被持久化
 *     setUser: (user) => set({ user }),
 *     setTempData: (data) => set({ tempData: data })
 *   }),
 *   {
 *     persist: {
 *       name: 'user-storage',
 *       partialize: (state) => ({ user: state.user }) // 只持久化user
 *     }
 *   }
 * )
 * ```
 */
export function createStore<T>(
  stateCreator: StateCreator<T, [], []>,
  options?: {
    persist?: {
      name: string
      storage?: 'localStorage' | 'sessionStorage'
      partialize?: (state: T) => Partial<T>
      version?: number
      migrate?: (persistedState: unknown, version: number) => T
    }
  }
) {
  if (!options?.persist) {
    // 不使用持久化
    return create<T>()(stateCreator)
  }

  // 使用持久化
  const { name, storage = 'localStorage', partialize, version, migrate } = options.persist

  const storageType = storage === 'sessionStorage' ? sessionStorage : localStorage

  const persistOptions: PersistOptions<T> = {
    name,
    storage: createJSONStorage(() => storageType),
  }

  if (partialize) {
    persistOptions.partialize = partialize
  }

  if (version !== undefined) {
    persistOptions.version = version
  }

  if (migrate) {
    persistOptions.migrate = migrate
  }

  return create<T>()(
    persist(stateCreator, persistOptions)
  )
}
