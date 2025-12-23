import { store, media } from '@telemetryos/sdk'
import { useUiScaleToSetRem } from '@telemetryos/sdk/react'
import {
  useTargetDateStoreState,
  useTimezoneStoreState,
  useDisplayStyleStoreState,
  useVisibleUnitsStoreState,
  useTitleStoreState,
  useCtaStoreState,
  useCompletionTypeStoreState,
  useCompletionTextStoreState,
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
  const [isLoadingTitle, title] = useTitleStoreState(instance)
  const [isLoadingCta, cta] = useCtaStoreState(instance)
  const [isLoadingCompType, completionType] = useCompletionTypeStoreState(instance)
  const [isLoadingCompText, completionText] = useCompletionTextStoreState(instance)
  const [isLoadingThemePri, themePrimary] = useThemePrimaryStoreState(instance)
  const [isLoadingThemeSec, themeSecondary] = useThemeSecondaryStoreState(instance)
  const [isLoadingBg, background] = useBackgroundStoreState(instance)

  // Countdown Logic
  const { timeLeft, isCompleted } = useCountdown(targetDate, timezone)

  const isLoading = isLoadingTarget || isLoadingTz || isLoadingStyle

  if (isLoading) {
    return <div className="render">Loading...</div>
  }

  // Define CSS Variables for Theming
  const styleVars = {
    '--color-primary': themePrimary || '#ffffff',
    '--color-text': themeSecondary || '#000000', // Used for contrast or accents
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
        {/* Header: Title */}
        {title && <h1 className="render__title">{title}</h1>}

        {/* Main: Timer or Completion */}
        {!isCompleted ? (
          <CountdownDisplay
            timeLeft={timeLeft}
            style={displayStyle}
            visibleUnits={visibleUnits}
            primaryColor={themePrimary}
          />
        ) : (
          <div className="render__completion-container">
            {completionType === 'text' ? (
              <div className="render__completion">{completionText || 'Time is up!'}</div>
            ) : (
              // Media Placeholder
              <div className="render__media-placeholder">
                {/* Img tag for now if we had a URL, but we only have ID. */}
                {/* Future: <MediaComponent id={completionMediaId} /> */}
                <span style={{ fontSize: '2rem' }}>Media Display (Stage 2)</span>
              </div>
            )}
          </div>
        )}

        {/* Footer: CTA */}
        {cta && <div className="render__cta">{cta}</div>}
      </div>
    </div>
  )
}

