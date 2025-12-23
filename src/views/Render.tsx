import { store } from '@telemetryos/sdk'
import { useUiScaleToSetRem } from '@telemetryos/sdk/react'
import { useTitleStoreState, useTargetDateStoreState, useDisplayStyleStoreState } from '../hooks/store'
import './Render.css'

export function Render() {
  // Use a fixed scale for now, or implement a scale hook if needed. 
  // The original template had useUiScaleStoreState which we removed.
  // We can default to 1 or add a scale hook later if required by guidelines.
  useUiScaleToSetRem(1)

  const instance = store().instance
  const [isLoadingTitle, title] = useTitleStoreState(instance)
  const [isLoadingTarget, targetDate] = useTargetDateStoreState(instance)
  const [isLoadingStyle, displayStyle] = useDisplayStyleStoreState(instance)

  if (isLoadingTitle || isLoadingTarget || isLoadingStyle) {
    return <div className="render">Loading...</div>
  }

  return (
    <div className="render">
      <div className="render__hero">
        <div className="render__hero-title">{title}</div>
        <div className="render__hero-subtitle">
          {targetDate ? `Target: ${new Date(targetDate).toLocaleString()}` : 'No target date set'}
        </div>
        <div className="render__docs-information-text">
          Style: {displayStyle}
        </div>
      </div>
    </div>
  )
}
