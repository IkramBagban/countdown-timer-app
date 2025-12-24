import { store, media } from '@telemetryos/sdk'
import { useUiScaleToSetRem } from '@telemetryos/sdk/react'
import { useEffect } from 'react'
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

  const instance = { id: (store() as any)._client?.applicationInstance || 'loading...' }

  useEffect(() => {
    console.log('[SDK] Render View Mounting', {
      instanceId: instance.id,
      storeLink: (store() as any)._client?.isConnected ? 'Connected' : 'Connecting...'
    })
  }, [instance.id])

  useEffect(() => {
    if (targetDate) {
      console.log('[Sync] Render Data:', { targetDate, timezone, displayStyle, title })
    }
  }, [targetDate, timezone, displayStyle, title, isLoadingTarget])

  // Countdown Logic
  const { timeLeft, isCompleted } = useCountdown(targetDate, timezone)

  // Define CSS Variables for Theming
  const styleVars = {
    '--color-primary': themePrimary || '#ffffff',
    '--color-secondary': themeSecondary || '#F8B334',
    '--bg-color': background?.type === 'solid' ? background.color : '#111',
    '--bg-opacity': (background?.opacity || 100) / 100,
  } as CSSProperties

  // Background Handling
  const renderBackground = () => {
    if (background?.type === 'solid') {
      return (
        <div
          className="render__background"
          style={{ backgroundColor: background.color, opacity: background.opacity / 100 }}
        />
      )
    }
    return <div className="render__background" style={{ opacity: (background?.opacity || 100) / 100 }} />
  }

  return (
    <div className="render" style={{ ...styleVars, backgroundColor: '#000' }}>
      {!targetDate ? (
        <div className="render__content">
          <div style={{ fontSize: '2rem', color: '#fff', padding: '2rem', textAlign: 'center' }}>
            {/* <div style={{ marginBottom: '1rem' }}>⏰</div> */}
            Please set a target date in settings.
          </div>
        </div>
      ) : (
        <>
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
              <div className="render__completion-container">
                {completionType === 'text' ? (
                  completionText && <div className="render__completion">{completionText}</div>
                ) : (
                  completionMediaId && (
                    <div className="render__media-placeholder">
                      <span style={{ fontSize: '2rem' }}>Media State</span>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Footer: CTA (Hide on completion) */}
            {!isCompleted && cta && <div className="render__cta">{cta}</div>}
          </div>
        </>
      )}
    </div>
  )
}

