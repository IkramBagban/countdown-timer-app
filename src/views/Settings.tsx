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
  const [isLoadingLabels, unitLabels, setUnitLabels] = useUnitLabelsStoreState(instance)
  const [isLoadingTitle, title, setTitle] = useTitleStoreState(instance)
  const [isLoadingCta, cta, setCta] = useCtaStoreState(instance)
  const [isLoadingCompType, completionType, setCompletionType] = useCompletionTypeStoreState(instance)
  const [isLoadingCompText, completionText, setCompletionText] = useCompletionTextStoreState(instance)
  const [isLoadingThemePri, themePrimary, setThemePrimary] = useThemePrimaryStoreState(instance)
  const [isLoadingThemeSec, themeSecondary, setThemeSecondary] = useThemeSecondaryStoreState(instance)
  const [isLoadingBg, background, setBackground] = useBackgroundStoreState(instance)

  // Use a softer loading check: only if we don't even have an instance ID yet
  const isSyncing = !instance && isLoadingTarget

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
            disabled={isSyncing}
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
            disabled={isSyncing}
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
            disabled={isSyncing}
            value={displayStyle}
            onChange={(e) => setDisplayStyle(e.target.value as any)}
          >
            <option value="card">Cards</option>
            <option value="circle">Circular Progress</option>
            <option value="digital">Digital LED</option>
            <option value="flip">Flip Clock</option>
          </select>
        </SettingsSelectFrame>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Visible Units & Labels</SettingsLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { id: 'days', label: 'Days' },
            { id: 'hours', label: 'Hours' },
            { id: 'minutes', label: 'Minutes' },
            { id: 'seconds', label: 'Seconds' },
          ].map((unit) => (
            <div key={unit.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: '0 0 auto' }}>
                <SettingsCheckboxFrame>
                  <input
                    type="checkbox"
                    checked={visibleUnits[unit.id as keyof typeof visibleUnits]}
                    onChange={() => handleUnitToggle(unit.id as keyof typeof visibleUnits)}
                    disabled={isSyncing}
                  />
                </SettingsCheckboxFrame>
              </div>
              <div style={{ flex: 1 }}>
                <SettingsInputFrame>
                  <input
                    type="text"
                    value={unitLabels[unit.id as keyof typeof unitLabels]}
                    onChange={(e) => setUnitLabels({ ...unitLabels, [unit.id]: e.target.value })}
                    placeholder={unit.label}
                    disabled={isSyncing || !visibleUnits[unit.id as keyof typeof visibleUnits]}
                  />
                </SettingsInputFrame>
              </div>
            </div>
          ))}
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
            disabled={isSyncing}
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
            disabled={isSyncing}
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
            disabled={isSyncing}
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
            disabled={isSyncing}
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
              disabled={isSyncing}
              rows={3}
            />
          </SettingsTextAreaFrame>
        </SettingsField>
      ) : (
        <SettingsField>
          <SettingsLabel>Media</SettingsLabel>
          {/* <SettingsInputFrame>
            <input
              type="text"
              placeholder="Enter Media ID"
              disabled={isSyncing}
            // value={completionMediaId}
            // onChange={(e) => setCompletionMediaId(e.target.value)}
            />
          </SettingsInputFrame> */}
          <div style={{ fontSize: '1.3rem', opacity: 0.7, marginTop: '.2rem' }}>
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
                style={{ width: '100%', height: '4rem', padding: 0, border: 'none' }}
                disabled={isSyncing}
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
                style={{ width: '100%', height: '4rem', padding: 0, border: 'none' }}
                disabled={isSyncing}
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
            disabled={isSyncing}
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
              style={{ width: '100%', height: '4rem', padding: 0, border: 'none' }}
              disabled={isSyncing}
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
            disabled={isLoadingTarget}
          />
        </SettingsSliderFrame>
      </SettingsField>

    </SettingsContainer>
  )
}
