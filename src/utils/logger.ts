type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const isDev = import.meta.env.DEV;

const getColor = (level: LogLevel): string => {
  switch (level) {
    case 'debug':
      return '#808080';
    case 'info':
      return '#0066cc';
    case 'warn':
      return '#ff9900';
    case 'error':
      return '#cc0000';
  }
};

const formatMessage = (level: LogLevel, message: string, context?: LogContext): string => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${
    context ? '\n' + JSON.stringify(context, null, 2) : ''
  }`;
};

const log = (level: LogLevel, message: string, context?: LogContext) => {
  const formattedMessage = formatMessage(level, message, context);
  const color = getColor(level);

  if (isDev) {
    console.log(`%c${formattedMessage}`, `color: ${color}`);
  }

  // In production, you might want to send logs to a service
  if (level === 'error') {
    // TODO: Send to error reporting service
  }
};

export const logError = (error: Error, context?: LogContext) => {
  log('error', error.message, {
    stack: error.stack,
    ...context,
  });
};

export const logInfo = (message: string, context?: LogContext) => {
  log('info', message, context);
};

export const logDebug = (message: string, context?: LogContext) => {
  if (isDev) {
    log('debug', message, context);
  }
};

export const logWarn = (message: string, context?: LogContext) => {
  log('warn', message, context);
};

// Create a stream for Morgan middleware
export const stream = {
  write: (message: string) => {
    logInfo(message.trim());
  },
};

export default {
  error: logError,
  info: logInfo,
  debug: logDebug,
  warn: logWarn,
};
