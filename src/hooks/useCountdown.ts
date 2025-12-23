import { useState, useEffect } from 'react'

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

interface UseCountdownResult {
    timeLeft: TimeLeft
    isCompleted: boolean
}

export function useCountdown(
    targetDateStr: string | undefined,
    timezoneString: string
): UseCountdownResult {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [isCompleted, setIsCompleted] = useState(false)

    useEffect(() => {
        if (!targetDateStr) {
            setIsCompleted(false)
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            return
        }

        const calculateTimeLeft = () => {
            try {
                const now = new Date()

                // 1. Calculate the offset difference between Local Browser Time and Target Timezone
                // This correctly maps the "Floating" time typed in the settings to its absolute UTC moment.
                const localNowInTargetStr = now.toLocaleString('en-US', { timeZone: timezoneString })
                const localNowInTarget = new Date(localNowInTargetStr)
                const diffMs = localNowInTarget.getTime() - now.getTime()

                // 2. Parse the target date (User types "11:51 PM", Date parses as "11:51 PM Local")
                const localTargetEpoch = new Date(targetDateStr).getTime()

                // 3. Subtract the offset to get the real UTC epoch of that "Wall Clock Time"
                const targetEpoch = localTargetEpoch - diffMs

                // 4. Final Difference
                const difference = targetEpoch - now.getTime()

                if (difference <= 0) {
                    setIsCompleted(true)
                    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                    return
                }

                setIsCompleted(false)

                const d = Math.floor(difference / (1000 * 60 * 60 * 24))
                const h = Math.floor((difference / (1000 * 60 * 60)) % 24)
                const m = Math.floor((difference / 1000 / 60) % 60)
                const s = Math.floor((difference / 1000) % 60)

                setTimeLeft({ days: d, hours: h, minutes: m, seconds: s })
            } catch (e) {
                console.error("Error calculating countdown:", e)
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [targetDateStr, timezoneString])

    return { timeLeft, isCompleted }
}
