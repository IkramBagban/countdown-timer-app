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

  const instance = { id: (store() as any)._client?.applicationInstance || 'loading...' }

  useEffect(() => {
    console.log('Render View Mounted', { hasInstance: !!instance, isLoadingTarget })
  }, [instance, isLoadingTarget])

  // Countdown Logic
  const { timeLeft, isCompleted } = useCountdown(targetDate, timezone)

  // Robust loading check with safety timeout
  const [isSyncing, setIsSyncing] = useState(true)
  useEffect(() => {
    // If we have data OR any of the main loaders finished, we can stop the "blocking" spinner
    if (!isLoadingTarget || targetDate) setIsSyncing(false)
    const timer = setTimeout(() => setIsSyncing(false), 5000) // 5s safety cap
    return () => clearTimeout(timer)
  }, [isLoadingTarget, targetDate])

  // Define CSS Variables for Theming (even during loading)
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

  // Render Diagnostics and Logic
  return (
    <div className="render" style={{ ...styleVars, backgroundColor: '#000' }}>
      {/* Diagnostic Status Bar for Render - ALWAYS VISIBLE */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        right: '1rem',
        padding: '0.5rem',
        borderRadius: '0.4rem',
        fontSize: '0.8rem',
        textAlign: 'center',
        zIndex: 1000,
        backgroundColor: instance.id !== 'loading...' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
        border: `1px solid ${instance.id !== 'loading...' ? '#4CAF50' : '#F44336'}`,
        color: instance.id !== 'loading...' ? '#4CAF50' : '#FF5252',
      }}>
        {instance.id !== 'loading...' ? `Linked: ${instance.id.substring(0, 8)}...` : 'Connecting to Telemetry Bridge...'} | Sync: {isSyncing ? 'Wait' : 'Done'} | Date: {targetDate || 'None'}
      </div>

      {isSyncing ? (
        <div className="render__content">
          <div style={{ fontSize: '2rem', color: '#fff', textAlign: 'center' }}>
            Initializing Countdown...<br />
            <span style={{ fontSize: '1rem', opacity: 0.6 }}>Waiting for platform handshake</span>
          </div>
        </div>
      ) : !targetDate ? (
        <div className="render__content">
          <div style={{ fontSize: '2rem', color: '#fff', padding: '2rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>⏰</div>
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

