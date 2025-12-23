/// <reference types="vite/client" />

import './index.css'

import { createRoot } from 'react-dom/client'
import { App } from './App'
import { configure } from '@telemetryos/sdk'

configure('countdown-timer-app')

createRoot(document.querySelector('#app')!).render(<App />)
