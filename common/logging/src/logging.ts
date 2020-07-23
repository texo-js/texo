import winston, { Logger, LoggerOptions } from 'winston';

const { createLogger: createWinstonLogger, transports, format } = winston;

interface Metadata extends Record<string, any> {
  ns?: string;
}

interface LoggerEx extends Logger {
  defaultMeta: Metadata | undefined;
}

namespace Loggers {
  export function create({ options = {}, namespace = '' } : { options?: LoggerOptions, namespace?: string } = {}) : Logger {
    options.defaultMeta = { ns: namespace, ...(options.defaultMeta || {}) };
    const logger = createWinstonLogger(options);
    
    return logger;
  }

  export function createChild({ parent, namespace } : { parent: Logger, namespace: string }) {
    const logger = parent.child({}) as LoggerEx;

    const metadata = logger.defaultMeta || {};
    const namespaceRoot = metadata.ns || '';
    const ns = `${namespaceRoot}/${namespace}`;
    
    logger.defaultMeta = { ...metadata, ns };

    return logger;
  }

  let systemLogger = createNullLogger();

  export function setSystem(logger: Logger) {
    systemLogger = logger;
  }

  export function getSystem() {
    return systemLogger;
  }

  function createNullLogger(): Logger {
    return Loggers.create({ options: { level: 'debug', transports: [] } });
  }
}

export { Loggers, LoggerOptions, transports, format }