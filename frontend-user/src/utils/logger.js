const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 }
const CURRENT_LEVEL = import.meta.env.PROD ? LOG_LEVELS.warn : LOG_LEVELS.debug

function log(level, ...args) {
  if (LOG_LEVELS[level] >= CURRENT_LEVEL) {
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info
    fn(`[${level.toUpperCase()}]`, ...args)
  }
}

export default {
  debug: (...args) => log('debug', ...args),
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args)
}
