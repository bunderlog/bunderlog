import { createApp } from 'vue'
import '../shared/base.css'
import { COPY } from '../shared/copy'
import { track } from '../shared/experiment'
import App from './App.vue'
import { exp } from './state'

const copy = COPY[exp.variant]
document.title = copy.title
document.querySelector('meta[name="description"]')?.setAttribute('content', copy.description)
document.documentElement.dataset.variant = exp.variant

createApp(App, { copy }).mount('#app')
track(exp, 'view')
