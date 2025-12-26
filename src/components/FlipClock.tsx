import React, { useState, useRef, useLayoutEffect } from 'react'
import './FlipClock.css'

interface FlipUnitProps {
    value: string | number
    label: string
}

const pad = (num: string | number) => num.toString().padStart(2, '0')

const FlipUnit: React.FC<FlipUnitProps> = ({ value, label }) => {
    // We store the "current" settled value and the "previous" value to manage the flip
    // actually, to match the physics:
    // We want to flip FROM 'prev' TO 'current'.

    // State 1: Stable. display = 5.
    // Prop update: value = 6.
    // State 2: Flipping. prev = 5, current = 6.
    // Animation ends.
    // State 3: Stable. prev = 6, current = 6 (or just reset).

    const [currentValue, setCurrentValue] = useState(value) // The value we are flipping TO
    const [prevValue, setPrevValue] = useState(value)       // The value we are flipping FROM
    const [isFlipping, setIsFlipping] = useState(false)

    // We trace the prop 'value'.
    useLayoutEffect(() => {
        if (value !== currentValue) {
            // Start flip sequence
            setPrevValue(currentValue)
            setCurrentValue(value)
            setIsFlipping(true)
        }
    }, [value, currentValue])

    const handleAnimationEnd = () => {
        setIsFlipping(false)
        setPrevValue(value) // Clean up, make them equal
    }

    // derived for rendering
    // If flipping:
    // Top Static: currentValue (Top half of 6)
    // Bottom Static: prevValue (Bottom half of 5)
    // Flap Front: prevValue (Top half of 5)
    // Flap Back: currentValue (Bottom half of 6)

    // If NOT flipping:
    // Everything is currentValue.

    const valTopStatic = isFlipping ? currentValue : currentValue
    const valBottomStatic = isFlipping ? prevValue : currentValue
    const valFlapFront = isFlipping ? prevValue : currentValue
    const valFlapBack = isFlipping ? currentValue : currentValue

    return (
        <div className="flip-unit-container">
            <div className={`flip-container ${isFlipping ? 'flipping' : ''}`}>

                {/* Layer 1: Static Top (The Next Number) */}
                <div className="flip-card-part static-top">
                    <span>{pad(valTopStatic)}</span>
                </div>

                {/* Layer 2: Static Bottom (The Current Number) */}
                <div className="flip-card-part static-bottom">
                    <span>{pad(valBottomStatic)}</span>
                </div>

                {/* Layer 3: The Rotating Flap */}
                <div className="flap-wrapper" onAnimationEnd={handleAnimationEnd}>
                    {/* Front Face: The Old Top */}
                    <div className="flip-card-part flap-front">
                        <span>{pad(valFlapFront)}</span>
                    </div>
                    {/* Back Face: The New Bottom */}
                    <div className="flip-card-part flap-back">
                        <span>{pad(valFlapBack)}</span>
                    </div>
                </div>

                <div className="flip-hinge"></div>

            </div>
            <div className="flip-label">{label}</div>
        </div>
    )
}

interface FlipClockProps {
    days: number
    hours: number
    minutes: number
    seconds: number
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
    primaryColor?: string
    secondaryColor?: string
}

export const FlipClock: React.FC<FlipClockProps> = ({
    days, hours, minutes, seconds,
    visibleUnits, unitLabels,
    primaryColor, secondaryColor
}) => {

    // Theme mapping
    const style = {
        '--flip-text': primaryColor,
        // If secondary color is provided, maybe use it for BG? 
        // Otherwise default or use surface color. 
        // For now let's stick to standard dark cards for readability 
        // unless specifically requested to override.
        // Actually, let's allow secondary to be the card bg if present, 
        // but default to #222 if it's undefined/white/light.
    } as React.CSSProperties

    return (
        <div className="flip-clock" style={style}>
            {visibleUnits.days && <FlipUnit value={days} label={unitLabels.days} />}
            {visibleUnits.hours && <FlipUnit value={hours} label={unitLabels.hours} />}
            {visibleUnits.minutes && <FlipUnit value={minutes} label={unitLabels.minutes} />}
            {visibleUnits.seconds && <FlipUnit value={seconds} label={unitLabels.seconds} />}
        </div>
    )
}
