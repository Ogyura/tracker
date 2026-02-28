"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Camera,
  Edit3,
  ImagePlus,
  MapPin,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react"
import type { UserPhoto } from "@/lib/types"

interface UserProfileProps {
  onClose: () => void
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user, updateProfile, photos, addPhoto, deletePhoto, reviews, deleteReview, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"photos" | "reviews" | "settings">("photos")
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Photo upload state
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadCaption, setUploadCaption] = useState("")
  const [uploadPlaceName, setUploadPlaceName] = useState("")
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)

  // Full-screen photo view
  const [viewPhoto, setViewPhoto] = useState<UserPhoto | null>(null)

  if (!user) return null

  function handleSaveName() {
    if (editName.trim()) {
      updateProfile({ name: editName.trim() })
    }
    setIsEditing(false)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Файл слишком большой. Максимальный размер — 5 МБ.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadPreview(reader.result as string)
      setShowUploadForm(true)
    }
    reader.readAsDataURL(file)
    // Reset input so same file can be selected again
    e.target.value = ""
  }

  function handleUploadPhoto() {
    if (!uploadPreview) return
    addPhoto({
      imageData: uploadPreview,
      caption: uploadCaption.trim(),
      placeName: uploadPlaceName.trim() || undefined,
    })
    setUploadPreview(null)
    setUploadCaption("")
    setUploadPlaceName("")
    setShowUploadForm(false)
  }

  function cancelUpload() {
    setUploadPreview(null)
    setUploadCaption("")
    setUploadPlaceName("")
    setShowUploadForm(false)
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const tabs = [
    { id: "photos" as const, label: "Фото", count: photos.length },
    { id: "reviews" as const, label: "Отзывы", count: reviews.length },
    { id: "settings" as const, label: "Настройки", count: null },
  ]

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Назад</span>
        </Button>
        <h2 className="text-lg font-semibold text-foreground">Личный кабинет</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          {/* User info card */}
          <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm border">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-8 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleSaveName}>
                    OK
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground truncate">{user.name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(user.name)
                      setIsEditing(true)
                    }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Редактировать имя"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Camera className="h-3 w-3" />
                  {photos.length} фото
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {reviews.length} отзывов
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-muted p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="ml-1 text-xs opacity-60">({tab.count})</span>
                )}
              </button>
            ))}
          </div>

          {/* Photos tab */}
          {activeTab === "photos" && (
            <div className="flex flex-col gap-3">
              {/* Upload button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {showUploadForm && uploadPreview ? (
                <div className="rounded-xl border bg-card p-4 flex flex-col gap-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={uploadPreview}
                      alt="Предпросмотр"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={cancelUpload}
                      className="absolute top-2 right-2 rounded-full bg-foreground/60 p-1 text-background hover:bg-foreground/80"
                      aria-label="Отменить"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="upload-place" className="text-xs text-muted-foreground">
                      Название места (необязательно)
                    </Label>
                    <Input
                      id="upload-place"
                      value={uploadPlaceName}
                      onChange={(e) => setUploadPlaceName(e.target.value)}
                      placeholder="Например: Парк Горького"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="upload-caption" className="text-xs text-muted-foreground">
                      Описание (необязательно)
                    </Label>
                    <Textarea
                      id="upload-caption"
                      value={uploadCaption}
                      onChange={(e) => setUploadCaption(e.target.value)}
                      placeholder="Опишите фотографию..."
                      rows={2}
                      className="text-sm resize-none"
                    />
                  </div>
                  <Button onClick={handleUploadPhoto} size="sm">
                    Загрузить фото
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Добавить фото местности
                </Button>
              )}

              {/* Photo grid */}
              {photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Camera className="mb-2 h-10 w-10 opacity-40" />
                  <p className="text-sm">У вас пока нет фотографий</p>
                  <p className="text-xs mt-1">Добавьте фото доступных мест города</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {photos
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
                        onClick={() => setViewPhoto(photo)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setViewPhoto(photo)}
                        aria-label={`Просмотреть фото${photo.placeName ? `: ${photo.placeName}` : ""}`}
                      >
                        <img
                          src={photo.imageData}
                          alt={photo.caption || "Фото местности"}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {photo.placeName && (
                          <div className="absolute bottom-0 left-0 right-0 p-2 text-xs font-medium text-background opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{photo.placeName}</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            deletePhoto(photo.id)
                          }}
                          className="absolute top-1 right-1 rounded-full bg-foreground/60 p-1 text-background opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                          aria-label="Удалить фото"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <div className="flex flex-col gap-3">
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Star className="mb-2 h-10 w-10 opacity-40" />
                  <p className="text-sm">У вас пока нет отзывов</p>
                  <p className="text-xs mt-1">Оставляйте отзывы на страницах мест</p>
                </div>
              ) : (
                reviews
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((review) => (
                    <div
                      key={review.id}
                      className="rounded-xl border bg-card p-4 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {review.placeName}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < review.rating
                                    ? "fill-warning text-warning"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteReview(review.id)}
                          className="text-muted-foreground hover:text-destructive shrink-0"
                          aria-label="Удалить отзыв"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground/60">
                        {new Date(review.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* Settings tab */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border bg-card p-4 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-foreground">Профиль</h3>
                <Separator />
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">Имя</p>
                  <p className="text-sm text-foreground">{user.name}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">Почта</p>
                  <p className="text-sm text-foreground">{user.email}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">Дата регистрации</p>
                  <p className="text-sm text-foreground">
                    {new Date(user.createdAt).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-4 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-foreground">Статистика</h3>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{photos.length}</p>
                    <p className="text-xs text-muted-foreground">Фотографий</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
                    <p className="text-xs text-muted-foreground">Отзывов</p>
                  </div>
                </div>
              </div>

              <Button
                variant="destructive"
                onClick={() => {
                  logout()
                  onClose()
                }}
                className="w-full"
              >
                Выйти из аккаунта
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Full-screen photo viewer */}
      {viewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4"
          onClick={() => setViewPhoto(null)}
          role="dialog"
          aria-label="Просмотр фотографии"
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={viewPhoto.imageData}
              alt={viewPhoto.caption || "Фото"}
              className="max-h-[80vh] max-w-[85vw] object-contain rounded-xl"
            />
            <button
              type="button"
              onClick={() => setViewPhoto(null)}
              className="absolute top-3 right-3 rounded-full bg-foreground/60 p-2 text-background hover:bg-foreground/80"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </button>
            {(viewPhoto.placeName || viewPhoto.caption) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent p-4 pt-8 text-background">
                {viewPhoto.placeName && (
                  <p className="flex items-center gap-1 text-sm font-medium">
                    <MapPin className="h-3.5 w-3.5" />
                    {viewPhoto.placeName}
                  </p>
                )}
                {viewPhoto.caption && (
                  <p className="text-xs mt-1 opacity-80">{viewPhoto.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
