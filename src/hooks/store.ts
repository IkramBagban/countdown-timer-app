import { createUseStoreState } from '@telemetryos/sdk/react'

export type CompletionType = 'text' | 'media'
export type DisplayStyle = 'digital' | 'flip' | 'circle' | 'card'

export interface VisibleUnits {
    days: boolean
    hours: boolean
    minutes: boolean
    seconds: boolean
}

export interface BackgroundConfig {
    type: 'default' | 'solid' | 'media'
    color: string
    mediaId: string
    opacity: number
}

// Target Time
export const useTargetDateStoreState = createUseStoreState<string>('targetDate', '')
export const useTimezoneStoreState = createUseStoreState<string>('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone)

// Appearance
export const useDisplayStyleStoreState = createUseStoreState<DisplayStyle>('displayStyle', 'digital')
export const useVisibleUnitsStoreState = createUseStoreState<VisibleUnits>('visibleUnits', {
    days: true,
    hours: true,
    minutes: true,
    seconds: true,
})

// Messaging
export const useTitleStoreState = createUseStoreState<string>('title', 'Countdown to Event')
export const useCtaStoreState = createUseStoreState<string>('cta', '')

// Completion
export const useCompletionTypeStoreState = createUseStoreState<CompletionType>('completionType', 'text')
export const useCompletionTextStoreState = createUseStoreState<string>('completionText', 'The event has started!')
export const useCompletionMediaIdStoreState = createUseStoreState<string>('completionMediaId', '')

// Theme
export const useThemePrimaryStoreState = createUseStoreState<string>('themePrimary', '#FFFFFF')
export const useThemeSecondaryStoreState = createUseStoreState<string>('themeSecondary', '#F8B334') // Using accent color from tokens as default

// Background
export const useBackgroundStoreState = createUseStoreState<BackgroundConfig>('background', {
    type: 'default',
    color: '#1B2632',
    mediaId: '',
    opacity: 100,
})
