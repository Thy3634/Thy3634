import { toggleColorMode, colorMode } from './utils/theme.ts'
import './assets/style.css'
import './assets/signature.css'
import './hero/index.ts'


const themeSwitch: HTMLButtonElement = document.querySelector('#theme-switch')!
setThemeIcon()

themeSwitch.addEventListener('click', () => {
    toggleColorMode()
    setThemeIcon()
})

function setThemeIcon() {
    switch (colorMode.value) {
        case 'dark':
            themeSwitch.innerText = '☪'
            break
        case 'light':
            themeSwitch.innerText = '☀'
            break
        case 'auto':
        default:
            themeSwitch.innerText = 'A'
            break
    }
    themeSwitch.innerText
}
