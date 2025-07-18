// NOTE:  All localStorage access is now wrapped in                 //
//        `typeof window !== "undefined"` checks so that            //
//        it is skipped while the app is pre-rendered on the server //
export class UserStorage {
  private static userId: string | null = null
  private static telegramInitData: string | null = null

  /** Returns the per-browser user-id (created on first visit). */
  static getUserId(): string {
    if (this.userId) return this.userId

    /* During SSR we don’t have localStorage - return a dummy id. */
    if (typeof window === "undefined") {
      this.userId = "ssr" // always the same on the server
      return this.userId
    }

    // Попытка получить ID пользователя Telegram WebApp
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
      this.userId = `tg_user_${window.Telegram.WebApp.initDataUnsafe.user.id}`
      // Сохраняем initData
      this.telegramInitData = window.Telegram.WebApp.initData
      localStorage.setItem("rpg_user_id", this.userId) // Сохраняем Telegram ID
      return this.userId
    }

    // Если Telegram ID недоступен, используем существующий или генерируем новый
    let userId = localStorage.getItem("rpg_user_id")
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
      localStorage.setItem("rpg_user_id", userId)
    }

    this.userId = userId
    return userId
  }

  /** Returns the Telegram WebApp initData string. */
  static getTelegramInitData(): string | null {
    if (typeof window === "undefined") return null
    if (this.telegramInitData) return this.telegramInitData
    if (window.Telegram?.WebApp?.initData) {
      this.telegramInitData = window.Telegram.WebApp.initData
      return this.telegramInitData
    }
    return null
  }

  /** Writes data for the current user (no-op on the server). */
  static setUserData(key: string, data: unknown): void {
    if (typeof window === "undefined") return
    const userKey = `${this.getUserId()}_${key}`
    localStorage.setItem(userKey, JSON.stringify(data))
  }

  /** Reads data for the current user (always returns null on the server). */
  static getUserData<T = unknown>(key: string): T | null {
    if (typeof window === "undefined") return null
    const userKey = `${this.getUserId()}_${key}`
    const raw = localStorage.getItem(userKey)
    return raw ? (JSON.parse(raw) as T) : null
  }

  static removeUserData(key: string): void {
    if (typeof window === "undefined") return
    const userKey = `${this.getUserId()}_${key}`
    localStorage.removeItem(userKey)
  }

  static getCurrentUserId(): string {
    return this.getUserId()
  }
}
