"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Eye, EyeOff, LogIn, UserPlus } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function resetForm() {
    setName("")
    setEmail("")
    setPassword("")
    setError("")
    setShowPassword(false)
  }

  function switchMode(newMode: "login" | "register") {
    resetForm()
    setMode(newMode)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (!email.trim() || !password.trim()) {
      setError("Заполните все обязательные поля")
      setIsSubmitting(false)
      return
    }

    if (mode === "register" && !name.trim()) {
      setError("Введите ваше имя")
      setIsSubmitting(false)
      return
    }

    if (password.length < 4) {
      setError("Пароль должен быть не менее 4 символов")
      setIsSubmitting(false)
      return
    }

    // Simulate brief loading
    setTimeout(() => {
      let result
      if (mode === "login") {
        result = login(email, password)
      } else {
        result = register(name, email, password)
      }

      if (result.success) {
        resetForm()
        onOpenChange(false)
      } else {
        setError(result.error || "Произошла ошибка")
      }
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {mode === "login" ? "Вход в аккаунт" : "Регистрация"}
          </DialogTitle>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LogIn className="h-4 w-4" />
            Вход
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "register"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Регистрация
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="auth-name">Имя</Label>
              <Input
                id="auth-name"
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="auth-email">Электронная почта</Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="auth-password">Пароль</Label>
            <div className="relative">
              <Input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Загрузка..."
              : mode === "login"
                ? "Войти"
                : "Зарегистрироваться"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {mode === "login"
            ? "Нет аккаунта? Нажмите «Регистрация» выше."
            : "Уже есть аккаунт? Нажмите «Вход» выше."}
        </p>
      </DialogContent>
    </Dialog>
  )
}
