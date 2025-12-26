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
import { MarkdownEditor } from '../components/MarkdownEditor'
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
  useCompletionDurationStoreState,
  useUiScaleStoreState,
  useCompletionMediaIdStoreState,
} from '../hooks/store'

// Common IANA timezones (simplified list)
const TIMEZONES = [
  'Device Time',
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

import { ErrorBoundary } from '../components/ErrorBoundary'

export function Settings() {
  const instance = { id: (store() as any)._client?.applicationInstance || 'loading...' }

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
  const [isLoadingDuration, completionDuration, setCompletionDuration] = useCompletionDurationStoreState()
  const [isLoadingScale, uiScale, setUiScale] = useUiScaleStoreState()
  const [isLoadingCompMedia, completionMediaId, setCompletionMediaId] = useCompletionMediaIdStoreState()

  useEffect(() => {
    console.log('[SDK] Settings View Mounting', {
      instanceId: instance.id,
      storeLink: (store() as any)._client?.isConnected ? 'Connected' : 'Connecting...'
    })
  }, [instance.id])

  useEffect(() => {
    console.log('[Sync] Data Loaded:', { targetDate, timezone, displayStyle, title, visibleUnits, unitLabels, cta, completionType, completionText, themePrimary, themeSecondary, background, completionDuration, uiScale })
  }, [targetDate, timezone, displayStyle, title, visibleUnits, unitLabels, cta, completionType, completionText, themePrimary, themeSecondary, background, isLoadingTarget, completionDuration, uiScale])

  const handleUnitToggle = (unit: keyof typeof visibleUnits) => {
    setVisibleUnits({
      ...visibleUnits,
      [unit]: !visibleUnits[unit],
    })
  }


  return (
    <ErrorBoundary location="Settings Panel">
      <SettingsContainer>

        <SettingsField>
          <SettingsLabel>Target Date & Time</SettingsLabel>
          <SettingsInputFrame>
            <input
              type="datetime-local"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </SettingsInputFrame>
          {!targetDate && (
            <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              lease set a target date to start the countdown.
            </div>
          )}
        </SettingsField>

        <SettingsField>
          <SettingsLabel>Timezone</SettingsLabel>
          <SettingsSelectFrame>
            <select
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
          <SettingsLabel>UI Scale: {uiScale}x</SettingsLabel>
          <SettingsSliderFrame>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={uiScale}
              onChange={(e) => setUiScale(parseFloat(e.target.value))}
            />
          </SettingsSliderFrame>
        </SettingsField>

        <SettingsField>
          <SettingsLabel>Display Style</SettingsLabel>
          <SettingsSelectFrame>
            <select
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
                      disabled={!visibleUnits[unit.id as keyof typeof visibleUnits]}
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
          <MarkdownEditor
            value={title}
            onChange={setTitle}
            placeholder="e.g. Grand Opening"
            multiline={false}
          />
        </SettingsField>

        <SettingsField>
          <SettingsLabel>Call to Action</SettingsLabel>
          <MarkdownEditor
            value={cta}
            onChange={setCta}
            placeholder="e.g. Join us for the celebration!"
            multiline={true}
            rows={2}
          />
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
            />
            <SettingsRadioLabel>Show Media (Image/Video)</SettingsRadioLabel>
          </SettingsRadioFrame>
        </SettingsField>

        {completionType === 'text' ? (
          <SettingsField>
            <SettingsLabel>Completion Message</SettingsLabel>
            <MarkdownEditor
              value={completionText}
              onChange={setCompletionText}
              multiline={true}
              rows={3}
            />
          </SettingsField>
        ) : (
          <SettingsField>
            <SettingsLabel>Completion Media ID</SettingsLabel>
            <SettingsInputFrame>
              <input
                type="text"
                placeholder="Enter Media ID from Library"
                value={completionMediaId}
                onChange={(e) => setCompletionMediaId(e.target.value)}
              />
            </SettingsInputFrame>
            <div style={{ fontSize: '1.2rem', opacity: 0.6, marginTop: '0.4rem' }}>
              Enter the ID of the image or video from your TelemetryOS Media Library.
            </div>
          </SettingsField>
        )}

        <SettingsField>
          <SettingsLabel>Display Duration (Minutes)</SettingsLabel>
          <SettingsInputFrame>
            <input
              type="number"
              min={0}
              step={1}
              value={completionDuration}
              onChange={(e) => setCompletionDuration(parseInt(e.target.value) || 0)}
              placeholder="0 for Indefinite"
            />
          </SettingsInputFrame>
          <div style={{ fontSize: '1.2rem', opacity: 0.6, marginTop: '0.4rem' }}>
            How long to show the completion message before clearing the screen. Use 0 for indefinite.
          </div>
        </SettingsField>

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
              />
            </SettingsInputFrame>
          </SettingsField>
        )}
        {background.type === 'media' && (
          <SettingsField>
            <SettingsLabel>Background Media ID</SettingsLabel>
            <SettingsInputFrame>
              <input
                type="text"
                placeholder="Enter Media ID from Library"
                value={background.mediaId}
                onChange={(e) => setBackground({ ...background, mediaId: e.target.value })}
              />
            </SettingsInputFrame>
            <div style={{ fontSize: '1.2rem', opacity: 0.6, marginTop: '0.4rem' }}>
              Enter the ID of the background image or video.
            </div>
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
            />
          </SettingsSliderFrame>
        </SettingsField>

      </SettingsContainer>
    </ErrorBoundary>
  )
}
