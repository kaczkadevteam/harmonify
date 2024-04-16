export function useSimpleTimer(time_ms: number, onFinish: () => void) {
  let timeout: NodeJS.Timeout
  let isRunning = false
  let timeLeft = time_ms
  let timestamp: number

  function start() {
    isRunning = true
    timestamp = new Date().getTime()
    timeout = setTimeout(() => {
      timeLeft = 0
      onFinish()
    }, timeLeft)
  }

  function pause() {
    isRunning = false
    clearTimeout(timeout)
    timeLeft = time_ms - (new Date().getTime() - timestamp)
  }

  function restart() {
    timeLeft = time_ms
    clearTimeout(timeout)
    start()
  }

  function getTime() {
    if (isRunning)
      return (time_ms - timeLeft) + (new Date().getTime() - timestamp)
    else
      return time_ms - timeLeft
  }

  return { start, pause, restart, getTime }
}
