import { NamespacedLogger, createLogger, NamespaceFilters, transports, format } from '@texo/logging';

let _logger: NamespacedLogger = createDefaultServerLogger();

function setLogger(logger: NamespacedLogger) {
  _logger = logger;
}

function createDefaultServerLogger() : NamespacedLogger {
  const consoleFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.metadata({fillExcept: [ 'level', 'ns', 'timestamp', 'message' ]}),
    format.printf(info => `${info.level} ${info.timestamp} ${info.ns} ${info.message} ${JSON.stringify(info.metadata)}`)
  );

  const filters = new NamespaceFilters('debug', '*');
  return createLogger('ROOT', filters, {
    level: 'debug',
    format: consoleFormat,
    transports: [ new transports.Console() ]
  });
}

export { _logger as logger, setLogger };
