/**
 * Унифицированное клиент-ское хранилище «game data».
 * Сохраняет объект JSON в localStorage под ключом `gameData_<userId>`.
 * На сервере возвращает null / делает no-op.
 */
export async function getUserGameData(userId: string, _initData?: string): Promise<any | null> {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(`gameData_${userId}`)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.error("getUserGameData error:", err)
    return null
  }
}

export async function saveUserGameData(userId: string, data: any, _initData?: string): Promise<void> {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`gameData_${userId}`, JSON.stringify(data))
  } catch (err) {
    console.error("saveUserGameData error:", err)
  }
}
