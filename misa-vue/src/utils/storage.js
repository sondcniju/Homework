export const safeJsonParse = (text, fallback) => {
  try {
    return JSON.parse(text)
  } catch {
    return fallback
  }
}

export const readArrayFromStorage = (key) => {
  const raw = localStorage.getItem(key)
  const parsed = safeJsonParse(raw ?? '[]', [])
  return Array.isArray(parsed) ? parsed : []
}

export const writeJsonToStorage = (key, value) => {
  const payload = value ?? []
  localStorage.setItem(key, JSON.stringify(payload))
}
