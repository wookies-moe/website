<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  text: string
  href?: string
  iconType?: 'copy' | 'arrow'
  previewHint?: string
  flashState?: 'success' | 'error' | null
}>()

const emit = defineEmits<{
  (e: 'activate'): void
  (e: 'preview', value: string | null): void
}>()

function onEnter() {
  if (props.previewHint) emit('preview', props.previewHint)
}

function onLeave() {
  emit('preview', null)
}

// Split on slashes so the browser can break at `/` before falling back to mid-word breaks.
const segments = computed(() => props.text.split(/(?<=\/)/))
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    class="card"
    :class="flashState && `card--${flashState}`"
    @click="emit('activate')"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focus="onEnter"
    @blur="onLeave"
  >
    <span class="card__label">{{ label }}</span>
    <span class="card__row">
      <span class="card__text">
        <template v-for="(seg, i) in segments" :key="i"
          >{{ seg }}<wbr v-if="i < segments.length - 1"
        /></template>
      </span>
      <svg
        v-if="iconType === 'copy'"
        class="card__icon"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <svg
        v-else
        class="card__icon"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </span>
  </component>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.1rem 1.25rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  font-family: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.22);
  transition:
    border-color 0.18s ease,
    transform 0.14s ease,
    box-shadow 0.14s ease,
    background 0.18s ease,
    color 0.18s ease;
}

.card:hover {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--bg-elevated) 92%, var(--accent) 8%);
  transform: translateY(-1px);
  box-shadow: 0 4px 0 color-mix(in srgb, var(--accent) 35%, rgba(0, 0, 0, 0.25));
}

.card:hover .card__icon {
  color: var(--accent);
  transform: translateX(2px);
}

.card:active {
  transform: translateY(2px);
  box-shadow: 0 0 0 transparent;
  transition-duration: 60ms;
}

.card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.card--success,
.card--success:hover {
  border-color: var(--success);
  background: color-mix(in srgb, var(--bg-elevated) 88%, var(--success) 12%);
  box-shadow: 0 4px 0 color-mix(in srgb, var(--success) 35%, rgba(0, 0, 0, 0.25));
  transform: translateY(-1px);
}

.card--success .card__icon,
.card--success:hover .card__icon {
  color: var(--success);
}

.card--error,
.card--error:hover {
  border-color: var(--danger);
  background: color-mix(in srgb, var(--bg-elevated) 88%, var(--danger) 12%);
  box-shadow: 0 4px 0 color-mix(in srgb, var(--danger) 35%, rgba(0, 0, 0, 0.25));
  transform: translateY(-1px);
}

.card--error .card__icon,
.card--error:hover .card__icon {
  color: var(--danger);
}

.card__label {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  color: var(--comment);
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.card__text {
  font-family: var(--font-mono);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text);
  overflow-wrap: anywhere;
  min-width: 0;
}

.card__icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  transition:
    color 0.18s ease,
    transform 0.18s ease;
  flex-shrink: 0;
}
</style>
