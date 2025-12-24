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
  const instance = { id: (store() as any)._applicationInstance || 'loading...' }

  // Instance scoping is now handled automatically by use...InstanceStoreState hooks
  const [isLoadingTarget, targetDate, setTargetDate] = useTargetDateStoreState()
  const [isLoadingTz, timezone, setTimezone] = useTimezoneStoreState()
  const [isLoadingStyle, displayStyle, setDisplayStyle] = useDisplayStyleStoreState()
  const [isLoadingUnits, visibleUnits, setVisibleUnits] = useVisibleUnitsStoreState()
  const [isLoadingLabels, unitLabels, setUnitLabels] = useUnitLabelsStoreState()
  const [isLoadingTitle, title, setTitle] = useTitleStoreState()
  const [isLoadingCta, cta, setCta] = useCtaStoreState()
  const [isLoadingCompType, completionType, setCompletionType] = useCompletionTypeStoreState()
  const [isLoadingCompText, completionText, setCompletionText] = useCompletionTextStoreState()
  const [isLoadingThemePri, themePrimary, setThemePrimary] = useThemePrimaryStoreState()
  const [isLoadingThemeSec, themeSecondary, setThemeSecondary] = useThemeSecondaryStoreState()
  const [isLoadingBg, background, setBackground] = useBackgroundStoreState()

  // Robust loading check with safety timeout
  const [isSyncing, setIsSyncing] = useState(true)
  useEffect(() => {
    if (!isLoadingTarget) setIsSyncing(false)
    const timer = setTimeout(() => setIsSyncing(false), 5000) // 5s safety cap
    return () => clearTimeout(timer)
  }, [isLoadingTarget])

  const handleUnitToggle = (unit: keyof typeof visibleUnits) => {
    setVisibleUnits({
      ...visibleUnits,
      [unit]: !visibleUnits[unit],
    })
  }

  useEffect(() => {
    console.log('Settings View Mounted', { hasInstance: !!instance, isLoadingTarget })
  }, [instance, isLoadingTarget])

  return (
    <SettingsContainer>
      {/* Diagnostic Status Bar */}
      <div style={{
        padding: '0.75rem',
        marginBottom: '1rem',
        borderRadius: '0.4rem',
        fontSize: '1rem',
        backgroundColor: instance.id !== 'loading...' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
        border: `1px solid ${instance.id !== 'loading...' ? '#4CAF50' : '#F44336'}`,
        color: instance.id !== 'loading...' ? '#4CAF50' : '#444',
      }}>
        {instance.id !== 'loading...' ? `Linked to Studio: ${instance.id.substring(0, 8)}...` : 'Connecting to Platform SDK...'} | Sync: {isSyncing ? 'Wait' : 'Done'}
      </div>

      <SettingsField>
        <SettingsLabel>Target Date & Time</SettingsLabel>
        <SettingsInputFrame>
          <input
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            disabled={isSyncing}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </SettingsInputFrame>
      </SettingsField>

      <SettingsField>
        <SettingsLabel>Timezone</SettingsLabel>
        <SettingsSelectFrame>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            disabled={isSyncing}
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
            value={displayStyle}
            onChange={(e) => setDisplayStyle(e.target.value as any)}
            disabled={isSyncing}
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
          <div style={{ fontSize: '1.2rem', opacity: 0.7, padding: '0.5rem 0' }}>
            Media picker will be implemented in Stage 2.
          </div>
        </SettingsField>
      )}

      <SettingsDivider />

      <SettingsField>
        <SettingsLabel>Theme Colors</SettingsLabel>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <SettingsLabel>Primary (Text/Cards)</SettingsLabel>
            <SettingsInputFrame>
              <input
                type="color"
                value={themePrimary}
                onChange={(e) => setThemePrimary(e.target.value)}
                style={{ width: '100%', height: '3rem', padding: 0 }}
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
                style={{ width: '100%', height: '3rem', padding: 0 }}
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
              style={{ width: '100%', height: '3rem', padding: 0 }}
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
            disabled={isSyncing}
          />
        </SettingsSliderFrame>
      </SettingsField>

    </SettingsContainer>
  )
}
