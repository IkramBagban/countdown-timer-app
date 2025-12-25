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
  useCompletionDurationStoreState,
  useUiScaleStoreState,
} from '../hooks/store'
import { useCountdown } from '../hooks/useCountdown'
import { CountdownDisplay } from '../components/CountdownDisplay'
import './Render.css'
import { CSSProperties, useState } from 'react'

import { ErrorBoundary } from '../components/ErrorBoundary'

export function Render() {
  const [isLoadingScale, uiScale] = useUiScaleStoreState()
  useUiScaleToSetRem(uiScale)

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
  const [isLoadingDuration, completionDuration] = useCompletionDurationStoreState()

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

  // Completion Duration Logic
  const [hasExpired, setHasExpired] = useState(false)

  useEffect(() => {
    // Reset expiration if target date changes or countdown is active
    if (!isCompleted) {
      setHasExpired(false)
      return
    }

    // If duration is 0, it stays indefinitely
    if (completionDuration <= 0) {
      setHasExpired(false)
      return
    }

    console.log(`[Timer] Starting completion visibility timer: ${completionDuration} minutes`)
    const timer = setTimeout(() => {
      console.log('[Timer] Completion duration expired. Hiding content.')
      setHasExpired(true)
    }, completionDuration * 60 * 1000)

    return () => clearTimeout(timer)
  }, [isCompleted, completionDuration, targetDate])

  // Define CSS Variables for Theming
  const styleVars = {
    '--color-primary': themePrimary || '#ffffff',
    '--color-secondary': themeSecondary || '#F8B334',
    '--bg-color': background?.type === 'solid' ? background.color : '#111',
    '--bg-opacity': (background?.opacity || 100) / 100,
  } as CSSProperties

  // Media Fetching Logic
  const [backgroundUrl, setBackgroundUrl] = useState<string>('')
  const [completionUrl, setCompletionUrl] = useState<string>('')

  useEffect(() => {
    if (background.type === 'media' && background.mediaId) {
      // DEV: Allow utilizing direct URLs for local testing
      if (background.mediaId.startsWith('http')) {
        setBackgroundUrl(background.mediaId)
      } else {
        media().getById(background.mediaId)
          .then(m => setBackgroundUrl(m.publicUrls[0] || ''))
          .catch(err => console.error('Error fetching background media:', err))
      }
    } else {
      setBackgroundUrl('')
    }
  }, [background.type, background.mediaId])

  useEffect(() => {
    if (completionType === 'media' && completionMediaId) {
      // DEV: Allow utilizing direct URLs for local testing
      if (completionMediaId.startsWith('http')) {
        setCompletionUrl(completionMediaId)
      } else {
        media().getById(completionMediaId)
          .then(m => setCompletionUrl(m.publicUrls[0] || ''))
          .catch(err => console.error('Error fetching completion media:', err))
      }
    } else {
      setCompletionUrl('')
    }
  }, [completionType, completionMediaId])

  // Background Handling
  const renderBackground = () => {
    const opacity = (background?.opacity || 100) / 100

    if (background?.type === 'solid') {
      return (
        <div
          className="render__background"
          style={{ backgroundColor: background.color, opacity }}
        />
      )
    }

    if (background?.type === 'media' && backgroundUrl) {
      const isVideo = backgroundUrl.match(/\.(mp4|webm|ogg)$/i)
      return (
        <div className="render__background" style={{ opacity }}>
          {isVideo ? (
            <video src={backgroundUrl} autoPlay loop muted className="render__media" />
          ) : (
            <img src={backgroundUrl} alt="Background" className="render__media" />
          )}
        </div>
      )
    }

    return <div className="render__background" style={{ opacity }} />
  }

  return (
    <ErrorBoundary location="Render View">
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
                  {!hasExpired ? (
                    <>
                      {completionType === 'text' ? (
                        completionText && <div className="render__completion">{completionText}</div>
                      ) : (
                        completionUrl && (
                          <div className="render__completion-media">
                            {completionUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video src={completionUrl} autoPlay loop muted className="render__media" />
                            ) : (
                              <img src={completionUrl} alt="Completion" className="render__media" />
                            )}
                          </div>
                        )
                      )}
                    </>
                  ) : (
                    <div className="render__expired-placeholder">
                      {/* Blank screen when expired */}
                    </div>
                  )}
                </div>
              )}

              {/* Footer: CTA (Hide on completion) */}
              {!isCompleted && cta && <div className="render__cta">{cta}</div>}
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  )
}

