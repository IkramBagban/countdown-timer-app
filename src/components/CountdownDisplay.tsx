import React from 'react'

interface CountdownDisplayProps {
    timeLeft: {
        days: number
        hours: number
        minutes: number
        seconds: number
    }
    style: 'digital' | 'flip' | 'circle' | 'card'
    visibleUnits: {
        days: boolean
        hours: boolean
        minutes: boolean
        seconds: boolean
    }
    unitLabels: {
        days: string
        hours: string
        minutes: string
        seconds: string
    }
    // Theme color for circles/svgs
    primaryColor: string
}

export function CountdownDisplay({ timeLeft, style, visibleUnits, unitLabels, primaryColor }: CountdownDisplayProps) {

    // Stage 1 Limit: Disable Digital and Flip
    if (style === 'digital' || style === 'flip' || style === 'circle') {
        let styleText = style === 'digital' ? 'Digital LED' : style === 'flip' ? 'Flip Clock' : 'Circular Progress'
        return (
            <div className="stage-placeholder" style={{
                fontSize: '1.5rem',
                opacity: 0.7,
                border: '0.0625rem dashed currentColor',
                padding: '2rem',
                borderRadius: '0.5rem'
            }}>
                {styleText} Style Coming in Stage 2
            </div>
        )
    }

    // Helper to pad numbers
    const pad = (num: number) => num.toString().padStart(2, '0')

    // "Round Up" Logic Handling for Display
    // Requirement: "The countdown should never display zero for the smallest visible unit until the countdown is over. 
    // Instead, show "1" until the hidden seconds reach zero".

    // Implementation:
    // We need to look at the hidden units BELOW the current unit.
    // If ANY hidden unit below is > 0, we add 1 to the current unit IF it is the smallest visible one.

    // Let's calculate effective display values.
    const { days, hours, minutes, seconds } = timeLeft

    let d = days
    let h = hours
    let m = minutes
    let s = seconds

    // Determine smallest visible unit
    const showS = visibleUnits.seconds
    const showM = visibleUnits.minutes
    const showH = visibleUnits.hours
    const showD = visibleUnits.days

    // Apply Round Up Logic
    // If Seconds are HIDDEN, we might need to bump Minutes
    if (!showS && s > 0) {
        // Seconds are hidden but non-zero.
        // If Minutes are visible, bump them.
        if (showM) {
            m += 1
            // Handle overflow (e.g. 59m + 1 -> 60m? Or 0m + 1h? Usually 60m is fine or rollover)
            // Ideally rollover: if m becomes 60, m=0, h+=1.
            if (m === 60) {
                m = 0
                h += 1
                if (h === 24) {
                    h = 0
                    d += 1
                }
            }
        } else if (showH) {
            // Minutes also hidden (or bump logic propagated), bump Hours
            // But we assume if M is hidden, we check if M>0 OR S>0
            // Let's simplify: Accumulate total "remainder" time from hidden lower units?
        }
    }

    // Wait, the logic is strictly: "until the hidden seconds reach zero".
    // This implies we function like a ceil().
    // If S is hidden: m = Math.ceil(m + s/60) basically.

    // Correct Waterfall Logic for "Ceiling" the smallest visible unit:

    let bumpedM = m
    let bumpedH = h
    let bumpedD = d

    // 1. Seconds
    if (!showS && s > 0) {
        bumpedM += 1
    }

    // 2. Minutes (Check if we need to roll over or if M is hidden)
    if (!showM) {
        if (bumpedM > 0) {
            bumpedH += 1 // M is hidden (and was non-zero), so we bump H
            bumpedM = 0  // Reset M (conceptually)
        }
        // If we bumped M because of S, then bumpedH gets bumped. 
        // If S was 30, M was 0. BumpedM = 1. M is hidden. BumpedH = H+1. Correct.
    } else {
        // M is visible. Handle rollover 60?
        if (bumpedM >= 60) {
            bumpedM -= 60
            bumpedH += 1
        }
    }

    // 3. Hours
    if (!showH) {
        if (bumpedH > 0) {
            bumpedD += 1
            bumpedH = 0
        }
    } else {
        if (bumpedH >= 24) {
            bumpedH -= 24
            bumpedD += 1
        }
    }

    const displayValues = {
        days: bumpedD,
        hours: bumpedH,
        minutes: bumpedM,
        seconds: s // Seconds is never bumped by anything lower
    }

    const renderItem = (value: number, label: string, max: number) => {
        return (
            <div className={`countdown-item`}>
                <div className="countdown-value">{pad(value)}</div>
                <div className="countdown-label">{label}</div>
                {/* {style === 'circle' && (
                    <svg viewBox="0 0 100 100" className="countdown-circle-svg">
                        <circle className="bg-circle" cx="50" cy="50" r="40" />
                        <circle
                            className="progress-circle"
                            cx="50" cy="50" r="40"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={(2 * Math.PI * 40) - ((value / max) * (2 * Math.PI * 40))}
                        />
                    </svg>
                )} */}
            </div>
        )
    }

    return (
        <div className={`countdown-container style-${style}`}>
            {showD && renderItem(displayValues.days, unitLabels.days, 365)}
            {showH && renderItem(displayValues.hours, unitLabels.hours, 24)}
            {showM && renderItem(displayValues.minutes, unitLabels.minutes, 60)}
            {showS && renderItem(displayValues.seconds, unitLabels.seconds, 60)}
        </div>
    )
}
