<script setup lang="ts">
import { computed, ref } from 'vue'
import ActionCard from './components/ActionCard.vue'
import { useServerStatus } from './composables/useServerStatus'

const SERVER_IP = 'wookies.moe'
const STORE_URL = 'https://store.wookies.moe'
const DISCORD_URL = 'https://discord.gg/gc6knErkGC'

const status = useServerStatus(SERVER_IP)

const onlineLabel = computed(() => {
  const s = status.value
  if (s.state === 'loading') return '…'
  if (s.state === 'online' && s.players) {
    return s.players.max > 0
      ? `${s.players.online}/${s.players.max}`
      : `${s.players.online}`
  }
  if (s.state === 'offline') return 'offline'
  return '—'
})

const previewUrl = ref<string | null>(null)

function setPreview(value: string | null) {
  previewUrl.value = value
}

interface CopyFlash {
  ok: boolean
  text: string
}
const copyFlash = ref<CopyFlash | null>(null)
let copyTimer: number | undefined

function showCopyFlash(flash: CopyFlash) {
  copyFlash.value = flash
  if (copyTimer !== undefined) window.clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => {
    copyFlash.value = null
  }, 2200)
}

async function copyIp() {
  const ok = await writeClipboard(SERVER_IP)
  showCopyFlash(
    ok
      ? { ok: true, text: `link copied: ${SERVER_IP}` }
      : { ok: false, text: 'copy failed' },
  )
}

const copyFlashState = computed<'success' | 'error' | null>(() => {
  if (!copyFlash.value) return null
  return copyFlash.value.ok ? 'success' : 'error'
})

async function writeClipboard(value: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch {
      /* fall through to legacy path */
    }
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = value
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}
</script>

<template>
  <div class="page">
    <header class="page__header">
      <span class="pkg">
        package moe.wookies;
      </span>
    </header>

    <main class="content">
      <section class="hero">
        <div class="hero__art">
          <img
            src="/assets/mascot.png"
            alt="Wookies"
            class="mascot"
            width="220"
            height="252"
          />
        </div>

        <div class="hero__body">
          <h1 class="title">
            <span class="title__name">Wookies</span><span class="title__tld">.moe</span>
          </h1>
          <p class="tagline">
            <span class="comment">//</span> Minecraft Server \ Sandbox Practice
          </p>

          <div class="meta">
            <span class="meta__pair">
              <span class="meta__key">version</span>
              <span class="meta__val">1.21.2+</span>
            </span>
            <span class="meta__dot">*</span>
            <span class="meta__pair">
              <span class="meta__key">location</span>
              <span class="meta__val">Moscow, Russia</span>
            </span>
            <span class="meta__dot">*</span>
            <template v-if="status.state === 'offline'">
              <span class="meta__pair">
                <span class="meta__offline">offline</span>
              </span>
            </template>
            <template v-else>
              <span class="meta__pair">
                <span class="meta__key">online</span>
                <span class="meta__val">{{ onlineLabel }}</span>
              </span>
            </template>
          </div>
        </div>
      </section>

      <section class="actions" aria-label="Server Links">
        <ActionCard
          label="// minecraft"
          :text="SERVER_IP"
          icon-type="copy"
          :preview-hint="`copy - ${SERVER_IP}`"
          :flash-state="copyFlashState"
          @activate="copyIp"
          @preview="setPreview"
        />
        <ActionCard
          label="// store"
          text="store.wookies.moe"
          icon-type="arrow"
          :href="STORE_URL"
          :preview-hint="STORE_URL"
          @preview="setPreview"
        />
        <ActionCard
          label="// discord"
          text="discord.gg/gc6knErkGC"
          icon-type="arrow"
          :href="DISCORD_URL"
          :preview-hint="DISCORD_URL"
          @preview="setPreview"
        />
      </section>
    </main>

    <footer class="page__footer">
      <div class="footer__stage">
        <Transition name="footer-swap">
          <span
            v-if="copyFlash"
            key="copy"
            class="footer__line"
            :class="copyFlash.ok ? 'footer__copy' : 'footer__copy--err'"
          >
            <span class="comment footer__arrow">//</span>
            <span>{{ copyFlash.text }}</span>
          </span>
        </Transition>
        <Transition name="footer-swap">
          <span
            v-if="!copyFlash && previewUrl"
            key="preview"
            class="footer__line footer__preview"
          >
            <span class="comment footer__arrow">// -&gt;</span>
            <span class="footer__url">{{ previewUrl }}</span>
          </span>
        </Transition>
        <Transition name="footer-swap">
          <span
            v-if="!copyFlash && !previewUrl"
            key="default"
            class="footer__line comment"
          >
            // © 2026 wookies.moe
          </span>
        </Transition>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page {
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 1.75rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
}

.page__header {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--comment);
}

.pkg::before {
  content: '> ';
  color: var(--text-faint);
}

.meta__offline {
  color: var(--danger);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2.5rem;
  padding: 2.5rem 0;
}

.hero {
  display: grid;
  grid-template-columns: minmax(160px, 220px) 1fr;
  gap: 2.5rem;
  align-items: center;
}

.hero__art {
  display: flex;
  justify-content: center;
}

.mascot {
  width: 100%;
  max-width: 220px;
  height: auto;
  filter: drop-shadow(0 12px 32px var(--bg-deep));
  user-select: none;
  -webkit-user-drag: none;
}

.hero__body {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.title {
  font-family: var(--font-mono);
  font-size: clamp(2.1rem, 4.6vw, 3.2rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.1;
  color: var(--text);
}

.title__tld {
  color: var(--accent);
}

.tagline {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-top: -0.4rem;
}

.comment {
  color: var(--comment);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--text-faint);
  padding-bottom: 0.5rem;
}

.meta__pair {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  white-space: nowrap;
}

.meta__key {
  color: var(--keyword);
}

.meta__val {
  color: var(--string);
}

.meta__dot {
  color: var(--text-faint);
}

.actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
}

.page__footer {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--comment);
  padding-top: 1.5rem;
  text-align: left;
}

.footer__stage {
  position: relative;
  min-height: 1.4em;
}

.footer__line {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer__arrow {
  font-variant-ligatures: none;
  font-feature-settings: 'liga' 0, 'calt' 0;
}

.footer__url {
  color: var(--accent);
}

.footer__copy,
.footer__copy--err {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.footer__copy {
  color: var(--success);
}

.footer__copy--err {
  color: var(--danger);
}

.footer-swap-enter-active,
.footer-swap-leave-active {
  transition: opacity 0.22s ease;
}

.footer-swap-enter-from,
.footer-swap-leave-to {
  opacity: 0;
}

@media (max-width: 760px) {
  .page {
    padding: 1.25rem 1.25rem 1.5rem;
  }

  .content {
    justify-content: flex-start;
    gap: 1.5rem;
    padding: 0.75rem 0 1.25rem;
  }

  .hero {
    grid-template-columns: 1fr;
    gap: 1.1rem;
    text-align: left;
  }

  .hero__art {
    justify-content: flex-start;
  }

  .mascot {
    max-width: 160px;
  }

  .actions {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }

  .meta {
    column-gap: 0.85rem;
    row-gap: 0.3rem;
  }

  .meta__dot {
    display: none;
  }
}
</style>
