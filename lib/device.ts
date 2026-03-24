const DEVICE_ID_KEY = 'bill_device_id_v1'

function randomId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export function getDeviceId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY)
    if (!id) {
      id = randomId()
      localStorage.setItem(DEVICE_ID_KEY, id)
    }
    return id
  } catch {
    return randomId()
  }
}
