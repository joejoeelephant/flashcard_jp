export function useTimeGapCalculator() {
    const timeGap = ref<number>(-1)

    const calculateTimeGap = (timeStamp: Date) => {
        if (!(timeStamp instanceof Date)) {
            timeStamp = new Date(timeStamp)
        }

        const now = new Date()
        const daysDifference = Math.floor((now.getTime() - timeStamp.getTime()) / (1000 * 3600 * 24))

        timeGap.value = daysDifference
    }

    return { timeGap, calculateTimeGap }
}
