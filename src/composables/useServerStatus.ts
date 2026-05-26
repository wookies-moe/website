import { onMounted, onUnmounted, ref } from 'vue'

export type ServerStatusState = 'loading' | 'online' | 'offline' | 'unknown'

export interface ServerStatus {
  state: ServerStatusState
  players: { online: number; max: number } | null
}

interface McsrvstatResponse {
  online?: boolean
  players?: { online?: number; max?: number }
}

// mcsrvstat.us caches results on their side for ~30s, so polling more often is wasteful.
const POLL_MS = 30_000

export function useServerStatus(host: string) {
  const status = ref<ServerStatus>({ state: 'loading', players: null })
  let timer: number | undefined
  let aborted = false

  async function refresh() {
    try {
      const url = `https://api.mcsrvstat.us/3/${encodeURIComponent(host)}`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`status ${res.status}`)
      const data = (await res.json()) as McsrvstatResponse
      if (aborted) return

      status.value = data.online
        ? {
            state: 'online',
            players: {
              online: data.players?.online ?? 0,
              max: data.players?.max ?? 0,
            },
          }
        : { state: 'offline', players: null }
    } catch {
      if (aborted) return
      status.value = { state: 'unknown', players: null }
    }
  }

  onMounted(() => {
    refresh()
    timer = window.setInterval(refresh, POLL_MS)
  })

  onUnmounted(() => {
    aborted = true
    if (timer !== undefined) window.clearInterval(timer)
  })

  return status
}
