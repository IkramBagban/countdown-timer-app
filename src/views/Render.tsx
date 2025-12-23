import { store, media, send } from '@telemetryos/sdk'
import { useUiScaleToSetRem } from '@telemetryos/sdk/react'
import { useEffect, useState } from 'react'
import {
  useTargetDateStoreState,
  useTimezoneStoreState,
  useDisplayStyleStoreState,
  useVisibleUnitsStoreState,
  useUnitLabelsStoreState,
  useTitleStoreState,
  useCtaStoreState,
  useCompletionTypeStoreState,
  useCompletionTextStoreState,
  useCompletionMediaIdStoreState,
  useThemePrimaryStoreState,
  useThemeSecondaryStoreState,
  useBackgroundStoreState,
} from '../hooks/store'
import { useCountdown } from '../hooks/useCountdown'
import { CountdownDisplay } from '../components/CountdownDisplay'
import './Render.css'
import { CSSProperties } from 'react'

export function Render() {
  // Responsive Scaling
  useUiScaleToSetRem(1)

  const instance = store().instance

  // Store Hooks
  const [isLoadingTarget, targetDate] = useTargetDateStoreState(instance)
  const [isLoadingTz, timezone] = useTimezoneStoreState(instance)
  const [isLoadingStyle, displayStyle] = useDisplayStyleStoreState(instance)
  const [isLoadingUnits, visibleUnits] = useVisibleUnitsStoreState(instance)
  const [isLoadingLabels, unitLabels] = useUnitLabelsStoreState(instance)
  const [isLoadingTitle, title] = useTitleStoreState(instance)
  const [isLoadingCta, cta] = useCtaStoreState(instance)
  const [isLoadingCompType, completionType] = useCompletionTypeStoreState(instance)
  const [isLoadingCompText, completionText] = useCompletionTextStoreState(instance)
  const [isLoadingCompMedia, completionMediaId] = useCompletionMediaIdStoreState(instance)
  const [isLoadingThemePri, themePrimary] = useThemePrimaryStoreState(instance)
  const [isLoadingThemeSec, themeSecondary] = useThemeSecondaryStoreState(instance)
  const [isLoadingBg, background] = useBackgroundStoreState(instance)

  useEffect(() => {
    console.log('Render View Mounted', { hasInstance: !!instance, isLoadingTarget })
    send('ready', {})
  }, [instance, isLoadingTarget])

  // Countdown Logic
  const { timeLeft, isCompleted } = useCountdown(targetDate, timezone)

  const isLoading = isLoadingTarget || isLoadingTz || isLoadingStyle

  if (isLoading) {
    return <div className="render">Loading...</div>
  }

  // Unconfigured State check (PRD Requirement #10)
  if (!targetDate) {
    return (
      <div className="render">
        <div className="render__content">
          <div style={{ fontSize: '2rem', opacity: 0.6 }}>
            Please set a target date in settings.
          </div>
        </div>
      </div>
    )
  }

  // Define CSS Variables for Theming
  const styleVars = {
    '--color-primary': themePrimary || '#ffffff',
    '--color-secondary': themeSecondary || '#F8B334',
    '--bg-color': background.type === 'solid' ? background.color : 'transparent',
    '--bg-opacity': background.opacity / 100,
  } as CSSProperties

  // Background Handling
  const renderBackground = () => {
    if (background.type === 'solid') {
      return (
        <div
          className="render__background"
          style={{ backgroundColor: background.color, opacity: background.opacity / 100 }}
        />
      )
    }
    // TODO: Handle Media background with SDK when available.
    // For now, if "media", just show a placeholder or transparent if no logic.
    return <div className="render__background" style={{ opacity: background.opacity / 100 }} />
  }

  return (
    <div className="render" style={styleVars}>
      {renderBackground()}

      <div className="render__content">
        {/* Header: Title (Hide on completion) */}
        {!isCompleted && title && <h1 className="render__title">{title}</h1>}

        {/* Main: Timer or Completion */}
        {!isCompleted ? (
          <CountdownDisplay
            timeLeft={timeLeft}
            style={displayStyle}
            visibleUnits={visibleUnits}
            unitLabels={unitLabels}
            primaryColor={themePrimary}
          />
        ) : (
          /* Completion State: Replacement content */
          <>
            {completionType === 'text' ? (
              completionText && <div className="render__completion">{completionText}</div>
            ) : (
              /* Media Placeholder (Stage 2) - Only if configured */
              completionMediaId && (
                <div className="render__media-placeholder">
                  <span style={{ fontSize: '2rem' }}>Media Display (Stage 2)</span>
                </div>
              )
            )}
          </>
        )}

        {/* Footer: CTA (Hide on completion) */}
        {!isCompleted && cta && <div className="render__cta">{cta}</div>}
      </div>
    </div>
  )
}

