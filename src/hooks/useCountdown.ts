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
                // 1. Get current time in correct timezone
                // We use Intl.DateTimeFormat to get the parts of the current time in the target timezone
                // into a string format that Date can parse, or use the difference in offsets.
                // A robust way without external libs like date-fns-tz is to use the difference in standard UTC time.

                // However, a simpler "good enough" approach for MVP using native APIs:
                // Get "now" in UTC
                const now = new Date()

                // Ensure targetDate is treated as relative to the configured timezone if it doesn't have offset info,
                // OR rely on the fact that input[type="datetime-local"] returns 'YYYY-MM-DDTHH:mm'.
                // If we want that specific "Wall Clock Time" to happen in "America/New_York",
                // we need to construct a Date object that Represents that moment.

                // Strategy: 
                // 1. Create a Date object for the Target assuming it is in the target timezone.
                //    (We can cheat by constructing a string with the timezone offset if we knew it, but we don't easily).
                //    Alternative: Use 'targetDateStr' + 'timezone' to get the epoch timestamp.

                // Let's use `toLocaleString` to find the offset difference or just use the browser's ability to convert.
                // Actually, the simplest standard way to get "Now" in a specific timezone for comparison is tricky without libraries.
                // BUT, we can convert both to their UTC timestamps.

                // Step A: Parse Target Date as if it were in the Selected Timezone.
                // Since the input `2025-01-01T10:00` is "floating", we need to say "This is 10AM in New York".
                // `new Date("2025-01-01T10:00")` uses LOCAL browser time. That's wrong if we selected a different TZ.
                // We can use `new Date("2025-01-01T10:00").toLocaleString('en-US', { timeZone: 'America/New_York' })` 
                // ... to see what that LOCAL time is in NY, but that's the inverse.

                // Correct approach for parsing Floating Time to Specific Timezone without libraries:
                // 1. Create a UTC date from the ISO string: `new Date(targetDateStr + "Z")` (Treat input as UTC)
                // 2. Adjust by the inverse of the target timezone offset relative to UTC.
                // Too complex to get right manually.

                // SIMPLIFIED APPROACH:
                // Treat everything as Local Device Time for Stage 1 if timezone parsing is blocked,
                // BUT the requirements say "Handle timezone conversion via Intl.DateTimeFormat".

                // Let's try to get the Target Date Timestamp:
                // We will construct a string that `new Date()` might accept with timezone, or use `toLocaleString`.
                // Actually, we can use the `timeZone` option of `toLocaleString` to get the CURRENT time in that zone,
                // but creating a Date FROM that zone is hard.

                // MVP COMPROMISE:
                // Input `2025-03-15T10:00`.
                // If user selects "America/New_York", we assume they mean 10:00 AM New York Time.
                // We calculate "Seconds remaining until 10:00 AM NY Time".

                // 1. Get `now` timestamp.
                // 2. We need `target` timestamp.
                //    Let's use a trick: `new Date(targetDateStr).toLocaleString('en-US', { timeZone: timezoneString })`
                //    gives us "What time is it inside the timezone X when it is this Local Date?". That doesn't help.

                //    Let's flip it. We loop until we find a UTC timestamp that matches our target wall-clock time in the target TZ? No.

                //    Let's go strict interpretation:
                //    If `timezone` matches browser logic, easy.
                //    If not, we just compare UTC to UTC.
                //    For `datetime-local`, the value is YYYY-MM-DDTHH:mm. 
                //    Let's assume this is UTC for calculations to ensure absolute consistency if we can.
                //    OR: Just rely on the browser's `new Date(targetDateStr)` which creates a local date object,
                //    and effectively ignores the timezone selector for calculation purposes in MVP version 
                //    unless we do complex offset math.

                //    WAIT! The user selected a timezone.
                //    Let's grab the offset of that timezone safely.

                const nowMs = new Date().getTime()

                // We need the Target Time in MS.
                // `new Date(targetDateStr)` assumes local time.
                // If we want "Time in New York", we can't easily force that constructor.

                // Let's use a library-less approach recommended for this:
                // "Project" the current UTC time into the target timezone string, parse it back to get the offset.
                // (Too risky for bugs).

                // DECISION for STAGE 1 (as per implementation plan "Handle timezone conversion via Intl.DateTimeFormat"):
                // We will use the provided `timezoneString` to Format the current time for display,
                // but for the COUNTDOWN itself, if specific timezone arithmetic is hard, 
                // we might stick to "Treat Input as Local Time" OR "Treat Input as UTC".
                // HOWEVER, the requirement is specific.

                // Let's try this:
                // Calculate "Now" in the target timezone.
                // Calculate "Target" (which is already in "Target Timezone" units).
                // Difference is simple subtraction of their components.

                // 1. Get current time parts in target Timezone.
                const formatter = new Intl.DateTimeFormat('en-US', {
                    timeZone: timezoneString,
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                    hour12: false
                });

                const parts = formatter.formatToParts(new Date());
                const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');

                // Construct a "Floating" Date object representing "Now in Target TZ" (but physically local/UTC values)
                // Note: Months are 0-indexed in JS Date
                const nowInTargetTz = new Date(
                    getPart('year'),
                    getPart('month') - 1,
                    getPart('day'),
                    getPart('hour'),
                    getPart('minute'),
                    getPart('second')
                );

                // Construct "Target" Date object (Input string is YYYY-MM-DDTHH:mm)
                // We treat this string as "Local" to match the "Now in Target TZ" object above.
                const targetDateObj = new Date(targetDateStr);

                // Difference
                const difference = targetDateObj.getTime() - nowInTargetTz.getTime();

                if (difference <= 0) {
                    setIsCompleted(true)
                    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                    return
                }

                setIsCompleted(false)

                const days = Math.floor(difference / (1000 * 60 * 60 * 24))
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
                const minutes = Math.floor((difference / 1000 / 60) % 60)
                const seconds = Math.floor((difference / 1000) % 60)

                setTimeLeft({ days, hours, minutes, seconds })
            } catch (e) {
                console.error("Error calculating countdown:", e)
                // Fallback or safety
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [targetDateStr, timezoneString])

    return { timeLeft, isCompleted }
}
