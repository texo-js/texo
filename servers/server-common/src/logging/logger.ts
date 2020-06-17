import { NamespacedLogger } from '@texo/logging';

let _logger: NamespacedLogger | null = null;

function setLogger(logger: NamespacedLogger) {
  _logger = logger;
}

export { _logger as logger, setLogger };
