import { store } from '@telemetryos/sdk'
import {
  SettingsContainer,
  SettingsField,
  SettingsLabel,
  SettingsInputFrame,
  SettingsSelectFrame,
  SettingsTextAreaFrame,
  SettingsRadioFrame,
  SettingsRadioLabel,
  SettingsCheckboxFrame,
  SettingsCheckboxLabel,
  SettingsSliderFrame,
  SettingsBox,
  SettingsDivider,
} from '@telemetryos/sdk/react'
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
  // useCompletionMediaIdStoreState, // TODO: Add media picker when available
} from '../hooks/store'

// Common IANA timezones (simplified list)
const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
]

// Add user's local timezone if not in list
const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone
if (!TIMEZONES.includes(localTz)) {
  TIMEZONES.unshift(localTz)
}

export function Settings() {
  const instance = store().instance

  const [isLoadingTarget, targetDate, setTargetDate] = useTargetDateStoreState(instance)
  const [isLoadingTz, timezone, setTimezone] = useTimezoneStoreState(instance)
  const [isLoadingStyle, displayStyle, setDisplayStyle] = useDisplayStyleStoreState(instance)
  const [isLoadingUnits, visibleUnits, setVisibleUnits] = useVisibleUnitsStoreState(instance)
  const [isLoadingTitle, title, setTitle] = useTitleStoreState(instance)
  const [isLoadingCta, cta, setCta] = useCtaStoreState(instance)
  const [isLoadingCompType, completionType, setCompletionType] = useCompletionTypeStoreState(instance)
  const [isLoadingCompText, completionText, setCompletionText] = useCompletionTextStoreState(instance)
  const [isLoadingThemePri, themePrimary, setThemePrimary] = useThemePrimaryStoreState(instance)
  const [isLoadingThemeSec, themeSecondary, setThemeSecondary] = useThemeSecondaryStoreState(instance)
  const [isLoadingBg, background, setBackground] = useBackgroundStoreState(instance)

  const isLoading = isLoadingTarget || isLoadingTz || isLoadingStyle || isLoadingUnits || isLoadingTitle

  const handleUnitToggle = (unit: keyof typeof visibleUnits) => {
    setVisibleUnits({
      ...visibleUnits,
      [unit]: !visibleUnits[unit],
    })
  }

  return (
    <SettingsContainer>
      <SettingsField>
        <SettingsLabel>Target Date & Time</SettingsLabel>
        <SettingsInputFrame>
          <input
            type="datetime-local"
            disabled={isLoading}
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </SettingsInputFrame>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Timezone</SettingsLabel>
        <SettingsSelectFrame>
          <select
            disabled={isLoading}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </SettingsSelectFrame>
      </SettingsField>

      <SettingsDivider />

      <SettingsField>
        <SettingsLabel>Display Style</SettingsLabel>
        <SettingsSelectFrame>
          <select
            disabled={isLoading}
            value={displayStyle}
            onChange={(e) => setDisplayStyle(e.target.value as any)}
          >
            <option value="digital">Digital LED</option>
            <option value="flip">Flip Clock</option>
            <option value="circle">Circular Progress</option>
            <option value="card">Cards</option>
          </select>
        </SettingsSelectFrame>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Visible Units</SettingsLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <SettingsCheckboxFrame>
            <input
              type="checkbox"
              checked={visibleUnits.days}
              onChange={() => handleUnitToggle('days')}
              disabled={isLoading}
            />
            <SettingsCheckboxLabel>Days</SettingsCheckboxLabel>
          </SettingsCheckboxFrame>
          <SettingsCheckboxFrame>
            <input
              type="checkbox"
              checked={visibleUnits.hours}
              onChange={() => handleUnitToggle('hours')}
              disabled={isLoading}
            />
            <SettingsCheckboxLabel>Hours</SettingsCheckboxLabel>
          </SettingsCheckboxFrame>
          <SettingsCheckboxFrame>
            <input
              type="checkbox"
              checked={visibleUnits.minutes}
              onChange={() => handleUnitToggle('minutes')}
              disabled={isLoading}
            />
            <SettingsCheckboxLabel>Minutes</SettingsCheckboxLabel>
          </SettingsCheckboxFrame>
          <SettingsCheckboxFrame>
            <input
              type="checkbox"
              checked={visibleUnits.seconds}
              onChange={() => handleUnitToggle('seconds')}
              disabled={isLoading}
            />
            <SettingsCheckboxLabel>Seconds</SettingsCheckboxLabel>
          </SettingsCheckboxFrame>
        </div>
      </SettingsField>

      <SettingsDivider />

      <SettingsField>
        <SettingsLabel>Event Title</SettingsLabel>
        <SettingsInputFrame>
          <input
            type="text"
            placeholder="e.g. Grand Opening"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </SettingsInputFrame>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Call to Action</SettingsLabel>
        <SettingsTextAreaFrame>
          <textarea
            placeholder="e.g. Join us for the celebration!"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            disabled={isLoading}
            rows={2}
          />
        </SettingsTextAreaFrame>
      </SettingsField>

      <SettingsDivider />

      <SettingsField>
        <SettingsLabel>Completion</SettingsLabel>
        <SettingsRadioFrame>
          <input
            type="radio"
            name="completionType"
            value="text"
            checked={completionType === 'text'}
            onChange={() => setCompletionType('text')}
            disabled={isLoading}
          />
          <SettingsRadioLabel>Show Message</SettingsRadioLabel>
        </SettingsRadioFrame>
        <SettingsRadioFrame>
          <input
            type="radio"
            name="completionType"
            value="media"
            checked={completionType === 'media'}
            onChange={() => setCompletionType('media')}
            disabled={isLoading}
          />
          <SettingsRadioLabel>Show Media (Image/Video)</SettingsRadioLabel>
        </SettingsRadioFrame>
      </SettingsField>

      {completionType === 'text' ? (
        <SettingsField>
          <SettingsLabel>Completion Message</SettingsLabel>
          <SettingsTextAreaFrame>
            <textarea
              value={completionText}
              onChange={(e) => setCompletionText(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </SettingsTextAreaFrame>
        </SettingsField>
      ) : (
        <SettingsField>
          <SettingsLabel>Media ID (Placeholder)</SettingsLabel>
          <SettingsInputFrame>
            <input
              type="text"
              placeholder="Enter Media ID"
              disabled={isLoading}
            // value={completionMediaId}
            // onChange={(e) => setCompletionMediaId(e.target.value)}
            />
          </SettingsInputFrame>
          <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem' }}>
            Media picker will be implemented in Stage 2.
          </div>
        </SettingsField>
      )}

      <SettingsDivider />

      <SettingsField>
        <SettingsLabel>Theme Colors</SettingsLabel>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <SettingsLabel>Primary (Text)</SettingsLabel>
            <SettingsInputFrame>
              <input
                type="color"
                value={themePrimary}
                onChange={(e) => setThemePrimary(e.target.value)}
                style={{ width: '100%', height: '40px', padding: 0, border: 'none' }}
                disabled={isLoading}
              />
            </SettingsInputFrame>
          </div>
          <div style={{ flex: 1 }}>
            <SettingsLabel>Secondary (Accents)</SettingsLabel>
            <SettingsInputFrame>
              <input
                type="color"
                value={themeSecondary}
                onChange={(e) => setThemeSecondary(e.target.value)}
                style={{ width: '100%', height: '40px', padding: 0, border: 'none' }}
                disabled={isLoading}
              />
            </SettingsInputFrame>
          </div>
        </div>
      </SettingsField>

      <SettingsDivider />

      <SettingsField>
        <SettingsLabel>Background</SettingsLabel>
        <SettingsSelectFrame>
          <select
            value={background.type}
            onChange={(e) => setBackground({ ...background, type: e.target.value as any })}
            disabled={isLoading}
          >
            <option value="default">Default</option>
            <option value="solid">Solid Color</option>
            <option value="media">Media</option>
          </select>
        </SettingsSelectFrame>
      </SettingsField>

      {background.type === 'solid' && (
        <SettingsField>
          <SettingsLabel>Background Color</SettingsLabel>
          <SettingsInputFrame>
            <input
              type="color"
              value={background.color}
              onChange={(e) => setBackground({ ...background, color: e.target.value })}
              style={{ width: '100%', height: '40px', padding: 0, border: 'none' }}
              disabled={isLoading}
            />
          </SettingsInputFrame>
        </SettingsField>
      )}

      <SettingsField>
        <SettingsLabel>Background Opacity: {background.opacity}%</SettingsLabel>
        <SettingsSliderFrame>
          <input
            type="range"
            min="0"
            max="100"
            value={background.opacity}
            onChange={(e) => setBackground({ ...background, opacity: Number(e.target.value) })}
            disabled={isLoading}
          />
        </SettingsSliderFrame>
      </SettingsField>

    </SettingsContainer>
  )
}
