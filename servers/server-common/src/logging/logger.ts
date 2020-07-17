import { EOL } from 'os';

import { Logger, Loggers, transports, format, Filters, Format, NamespaceSet } from '@texo/logging';

namespace Defaults {
  let _defaultLogger: Logger;

  export const DefaultNamespaceSet = new NamespaceSet();

  export const DefaultConsoleFormat: Format = format.combine(
    Filters.create({ filterLevel: 'info', namespaces: DefaultNamespaceSet }),
    format.timestamp(),
    format.colorize({ level: true, all: false, message: false }),
    format.metadata({ fillExcept: [ 'level', 'ns', 'timestamp', 'message' ] }),
    format.printf(info => `${info.timestamp} ${info.level} [${info.ns}] ${info.message}${EOL}${JSON.stringify(info.metadata)}${EOL}`)
  );

  export function getDefaultLogger() : Logger {
    if (!_defaultLogger) {
      _defaultLogger = createDefaultLogger();
    }
  
    return _defaultLogger;
  }

  function createDefaultLogger() : Logger {
    return Loggers.create({ options: { level: 'debug', format: DefaultConsoleFormat, transports: transports.Console  } })
  }
}

let _systemLogger: Logger;

function getSystemLogger() : Logger {
  if (!_systemLogger) {
    _systemLogger = Defaults.getDefaultLogger();
  }

  return _systemLogger;
}

function setSystemLogger(logger: Logger) {
  _systemLogger = logger;
}

export {
  Logger,
  Loggers,
  Filters,
  NamespaceSet,
  Defaults,
  format as Formats,
  transports as Transports,
  getSystemLogger,
  setSystemLogger
};
