import { store, media } from '@telemetryos/sdk'
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

  // Instance scoping is now handled automatically by hooks
  const [isLoadingTarget, targetDate] = useTargetDateStoreState()
  const [isLoadingTz, timezone] = useTimezoneStoreState()
  const [isLoadingStyle, displayStyle] = useDisplayStyleStoreState()
  const [isLoadingUnits, visibleUnits] = useVisibleUnitsStoreState()
  const [isLoadingLabels, unitLabels] = useUnitLabelsStoreState()
  const [isLoadingTitle, title] = useTitleStoreState()
  const [isLoadingCta, cta] = useCtaStoreState()
  const [isLoadingCompType, completionType] = useCompletionTypeStoreState()
  const [isLoadingCompText, completionText] = useCompletionTextStoreState()
  const [isLoadingCompMedia, completionMediaId] = useCompletionMediaIdStoreState()
  const [isLoadingThemePri, themePrimary] = useThemePrimaryStoreState()
  const [isLoadingThemeSec, themeSecondary] = useThemeSecondaryStoreState()
  const [isLoadingBg, background] = useBackgroundStoreState()

  const instance = { id: (store() as any)._applicationInstance || 'loading...' }

  useEffect(() => {
    console.log('Render View Mounted', { hasInstance: !!instance, isLoadingTarget })
  }, [instance, isLoadingTarget])

  // Countdown Logic
  const { timeLeft, isCompleted } = useCountdown(targetDate, timezone)

  const isLoading = isLoadingTarget || isLoadingTz || isLoadingStyle

  if (isLoading) {
    return <div className="render">Loading...</div>
  }

  // Define CSS Variables for Theming
  const styleVars = {
    '--color-primary': themePrimary || '#ffffff',
    '--color-secondary': themeSecondary || '#F8B334',
    '--bg-color': background.type === 'solid' ? background.color : 'transparent',
    '--bg-opacity': background.opacity / 100,
  } as CSSProperties

  // Unconfigured State check (PRD Requirement #10)
  if (!targetDate) {
    return (
      <div className="render" style={{ ...styleVars, backgroundColor: '#111' }}>
        {/* Diagnostic Status Bar for Render */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          padding: '0.5rem',
          borderRadius: '0.4rem',
          fontSize: '0.8rem',
          textAlign: 'center',
          zIndex: 100,
          backgroundColor: instance ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
          border: `1px solid ${instance ? '#4CAF50' : '#F44336'}`,
          color: instance ? '#4CAF50' : '#888',
        }}>
          {instance ? 'Render View: Linked to Instance' : 'Render View: Waiting for Handshake'} | Date: "{targetDate}"
        </div>
        <div className="render__content">
          <div style={{ fontSize: '2rem', color: '#fff', opacity: 0.8 }}>
            Please set a target date in settings.
          </div>
        </div>
      </div>
    )
  }

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

