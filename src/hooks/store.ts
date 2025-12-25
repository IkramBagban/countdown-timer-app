import { createUseInstanceStoreState } from '@telemetryos/sdk/react'

export type CompletionType = 'text' | 'media'
export type DisplayStyle = 'digital' | 'flip' | 'circle' | 'card'

export interface VisibleUnits {
    days: boolean
    hours: boolean
    minutes: boolean
    seconds: boolean
}

export interface UnitLabels {
    days: string
    hours: string
    minutes: string
    seconds: string
}

export interface BackgroundConfig {
    type: 'default' | 'solid' | 'media'
    color: string
    mediaId: string
    opacity: number
}

// Target Time
export const useTargetDateStoreState = createUseInstanceStoreState<string>('targetDate', '')
export const useTimezoneStoreState = createUseInstanceStoreState<string>('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone)

// Appearance
export const useDisplayStyleStoreState = createUseInstanceStoreState<DisplayStyle>('displayStyle', 'card')
export const useVisibleUnitsStoreState = createUseInstanceStoreState<VisibleUnits>('visibleUnits', {
    days: true,
    hours: true,
    minutes: true,
    seconds: true,
})
export const useUnitLabelsStoreState = createUseInstanceStoreState<UnitLabels>('unitLabels', {
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
})

// Messaging
export const useTitleStoreState = createUseInstanceStoreState<string>('title', 'Countdown to Event')
export const useCtaStoreState = createUseInstanceStoreState<string>('cta', '')

// Completion
export const useCompletionTypeStoreState = createUseInstanceStoreState<CompletionType>('completionType', 'text')
export const useCompletionTextStoreState = createUseInstanceStoreState<string>('completionText', '')
export const useCompletionMediaIdStoreState = createUseInstanceStoreState<string>('completionMediaId', '')
export const useCompletionDurationStoreState = createUseInstanceStoreState<number>('completionDuration', 0) // minutes, 0 = indefinite

// Theme
export const useThemePrimaryStoreState = createUseInstanceStoreState<string>('themePrimary', '#FFFFFF')
export const useThemeSecondaryStoreState = createUseInstanceStoreState<string>('themeSecondary', '#F8B334')

// Scaling
export const useUiScaleStoreState = createUseInstanceStoreState<number>('uiScale', 1)

// Background
export const useBackgroundStoreState = createUseInstanceStoreState<BackgroundConfig>('background', {
    type: 'default',
    color: '#000000',
    mediaId: '',
    opacity: 100,
})
