import { Format } from "logform";
import { format, Logger, transports } from "winston";
import { Filters } from "./filters";
import { NamespaceSet } from "./namespace-set";
import { Loggers } from "./logging";
import { EOL } from "os";

export namespace Defaults {
  export const DefaultNamespaceSet = new NamespaceSet();

  export const DefaultConsoleFormat: Format = format.combine(
    Filters.create({ filterLevel: 'info', namespaces: DefaultNamespaceSet }),
    format.timestamp(),
    format.colorize({ level: true, all: false, message: false }),
    format.metadata({ fillExcept: [ 'level', 'ns', 'timestamp', 'message' ] }),
    format.printf(info => `${info.timestamp} ${info.level} [${info.ns}] ${info.message}${EOL}${JSON.stringify(info.metadata)}`)
  );

  export function createDefaultConsoleLogger(namespace?: string): Logger {
    return Loggers.create({ options: { level: 'debug', format: DefaultConsoleFormat, transports: new transports.Console() }, namespace })
  }
}