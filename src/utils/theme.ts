import { computed, ref } from '@vue/reactivity'

export const colorMode = ref((localStorage.getItem('color-mode') || 'auto') as 'light' | 'dark' | 'auto')
export function toggleColorMode() {
    switch (colorMode.value) {
        case 'light':
            colorMode.value = prefersColorScheme.value === 'light' ? 'dark' : 'auto'
            break
        case 'dark':
            colorMode.value = prefersColorScheme.value === 'dark' ? 'light' : 'auto'
            break
        case 'auto':
        default:
            colorMode.value = prefersColorScheme.value === 'dark' ? 'light' : 'dark'
            break
    }
    localStorage.setItem('color-mode', colorMode.value)
    document.documentElement.setAttribute('data-color-mode', colorMode.value)
}

const prefersColorScheme = ref<'light' | 'dark'>('dark')
const match = matchMedia('(prefers-color-scheme: light)')
prefersColorScheme.value = match.matches ? 'light' : 'dark'
match.addEventListener('change', (ev) => {
    prefersColorScheme.value = ev.matches ? 'light' : 'dark'
})

export const light = computed(() => {
    return colorMode.value === 'light' || colorMode.value === 'auto' && prefersColorScheme.value === 'light'
})

