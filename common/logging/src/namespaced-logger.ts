import winston, { Logger, LoggerOptions, LogEntry } from 'winston';
import tripleBeam from 'triple-beam';

import { NamespaceFilters } from './namespace-filters';

const { createLogger: createWinstonLogger } = winston;

const LEVEL = tripleBeam.LEVEL;

export interface NamespacedLogger extends Logger {
  ns(name: string) : NamespacedLogger;
}

export function createLogger(namespace: string, filters: NamespaceFilters, options: LoggerOptions) : NamespacedLogger {
  const logger = createWinstonLogger(options);
  return upgradeLogger(namespace, filters, logger);
}

export function upgradeLogger(namespace: string, filters: NamespaceFilters, logger: Logger) : NamespacedLogger {
  const filter = filters.create(namespace);
  const level: string = filters.level || logger.level;
  const levelIndex : number = logger.levels[level];

  const nsLogger = Object.create(logger, {
    _ns: {
      value: namespace
    },

    ns: {
      value: function (namespace: String) : NamespacedLogger {
        const newNamespace = `${this._ns}:${namespace}`;

        const filter = filters.create(newNamespace);
        
        return Object.create(this, {
          _ns: {
            value: newNamespace
          },

          write: {
            value: function (info: LogEntry) {
              const write = (levelIndex > logger.levels[info[LEVEL]]) || filter.isEnabled;

              if (write) {
                info.ns = newNamespace;
                // @ts-ignore we know this exists in the impl
                logger.write(info);
              }
            }
          }
        });
      }
    },

    write: {
      value: function (info: LogEntry) {
        const write = (levelIndex > logger.levels[info[LEVEL]]) || filter.isEnabled;

        if (write) {
          info.ns = namespace;
          // @ts-ignore we know this exists in the impl
          logger.write(info);
        }
      }
    }
  });

  return nsLogger;
}

export { LoggerOptions };
