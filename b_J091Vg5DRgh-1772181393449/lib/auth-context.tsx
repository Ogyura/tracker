"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { AuthUser, UserPhoto, UserReview } from "@/lib/types"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  register: (name: string, email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  updateProfile: (data: Partial<Pick<AuthUser, "name" | "avatar">>) => void
  photos: UserPhoto[]
  addPhoto: (photo: Omit<UserPhoto, "id" | "userId" | "createdAt">) => void
  deletePhoto: (photoId: string) => void
  getPhotosForPlace: (placeId: number) => UserPhoto[]
  reviews: UserReview[]
  addReview: (review: Omit<UserReview, "id" | "userId" | "createdAt">) => void
  deleteReview: (reviewId: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEYS = {
  USERS: "dostup_rostov_users",
  CURRENT_USER: "dostup_rostov_current_user",
  PHOTOS: "dostup_rostov_photos",
  REVIEWS: "dostup_rostov_reviews",
} as const

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function setStorageItem(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable
  }
}

interface StoredUser {
  id: string
  name: string
  email: string
  password: string
  avatar?: string
  createdAt: string
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [photos, setPhotos] = useState<UserPhoto[]>([])
  const [reviews, setReviews] = useState<UserReview[]>([])

  // Load current user on mount
  useEffect(() => {
    const currentUserId = getStorageItem<string | null>(STORAGE_KEYS.CURRENT_USER, null)
    if (currentUserId) {
      const users = getStorageItem<StoredUser[]>(STORAGE_KEYS.USERS, [])
      const found = users.find((u) => u.id === currentUserId)
      if (found) {
        const { password: _, ...safeUser } = found
        setUser(safeUser)
        // Load user photos and reviews
        const allPhotos = getStorageItem<UserPhoto[]>(STORAGE_KEYS.PHOTOS, [])
        setPhotos(allPhotos.filter((p) => p.userId === currentUserId))
        const allReviews = getStorageItem<UserReview[]>(STORAGE_KEYS.REVIEWS, [])
        setReviews(allReviews.filter((r) => r.userId === currentUserId))
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const users = getStorageItem<StoredUser[]>(STORAGE_KEYS.USERS, [])
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!found) {
      return { success: false, error: "Пользователь не найден" }
    }
    if (found.password !== password) {
      return { success: false, error: "Неверный пароль" }
    }
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    setStorageItem(STORAGE_KEYS.CURRENT_USER, found.id)
    // Load user data
    const allPhotos = getStorageItem<UserPhoto[]>(STORAGE_KEYS.PHOTOS, [])
    setPhotos(allPhotos.filter((p) => p.userId === found.id))
    const allReviews = getStorageItem<UserReview[]>(STORAGE_KEYS.REVIEWS, [])
    setReviews(allReviews.filter((r) => r.userId === found.id))
    return { success: true }
  }, [])

  const register = useCallback((name: string, email: string, password: string) => {
    const users = getStorageItem<StoredUser[]>(STORAGE_KEYS.USERS, [])
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (exists) {
      return { success: false, error: "Пользователь с такой почтой уже зарегистрирован" }
    }
    const newUser: StoredUser = {
      id: generateId(),
      name,
      email: email.toLowerCase(),
      password,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    setStorageItem(STORAGE_KEYS.USERS, users)
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    setStorageItem(STORAGE_KEYS.CURRENT_USER, newUser.id)
    setPhotos([])
    setReviews([])
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setPhotos([])
    setReviews([])
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }, [])

  const updateProfile = useCallback(
    (data: Partial<Pick<AuthUser, "name" | "avatar">>) => {
      if (!user) return
      const users = getStorageItem<StoredUser[]>(STORAGE_KEYS.USERS, [])
      const idx = users.findIndex((u) => u.id === user.id)
      if (idx === -1) return
      if (data.name) users[idx].name = data.name
      if (data.avatar !== undefined) users[idx].avatar = data.avatar
      setStorageItem(STORAGE_KEYS.USERS, users)
      setUser((prev) => (prev ? { ...prev, ...data } : prev))
    },
    [user]
  )

  const addPhoto = useCallback(
    (photo: Omit<UserPhoto, "id" | "userId" | "createdAt">) => {
      if (!user) return
      const newPhoto: UserPhoto = {
        ...photo,
        id: generateId(),
        userId: user.id,
        createdAt: new Date().toISOString(),
      }
      const allPhotos = getStorageItem<UserPhoto[]>(STORAGE_KEYS.PHOTOS, [])
      allPhotos.push(newPhoto)
      setStorageItem(STORAGE_KEYS.PHOTOS, allPhotos)
      setPhotos((prev) => [...prev, newPhoto])
    },
    [user]
  )

  const deletePhoto = useCallback(
    (photoId: string) => {
      if (!user) return
      const allPhotos = getStorageItem<UserPhoto[]>(STORAGE_KEYS.PHOTOS, [])
      const filtered = allPhotos.filter((p) => p.id !== photoId)
      setStorageItem(STORAGE_KEYS.PHOTOS, filtered)
      setPhotos((prev) => prev.filter((p) => p.id !== photoId))
    },
    [user]
  )

  const getPhotosForPlace = useCallback((placeId: number) => {
    return getStorageItem<UserPhoto[]>(STORAGE_KEYS.PHOTOS, []).filter((p) => p.placeId === placeId)
  }, [])

  const addReview = useCallback(
    (review: Omit<UserReview, "id" | "userId" | "createdAt">) => {
      if (!user) return
      const newReview: UserReview = {
        ...review,
        id: generateId(),
        userId: user.id,
        createdAt: new Date().toISOString(),
      }
      const allReviews = getStorageItem<UserReview[]>(STORAGE_KEYS.REVIEWS, [])
      allReviews.push(newReview)
      setStorageItem(STORAGE_KEYS.REVIEWS, allReviews)
      setReviews((prev) => [...prev, newReview])
    },
    [user]
  )

  const deleteReview = useCallback(
    (reviewId: string) => {
      if (!user) return
      const allReviews = getStorageItem<UserReview[]>(STORAGE_KEYS.REVIEWS, [])
      const filtered = allReviews.filter((r) => r.id !== reviewId)
      setStorageItem(STORAGE_KEYS.REVIEWS, filtered)
      setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        photos,
        addPhoto,
        deletePhoto,
        getPhotosForPlace,
        reviews,
        addReview,
        deleteReview,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
