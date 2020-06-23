import Transport from 'winston-transport';
import { createLogger } from './namespaced-logger';
import { NamespaceFilters } from './namespace-filters';

describe('namespaces are included in log output',  function () {
  test('namespaces are included in the logs', function () {
    const filters = new NamespaceFilters('debug', '*');
    const transport = new VoidTransport();
    const mock = jest.fn();

    const logger = createLogger('test', filters, {
      transports: [ transport ],
      level: 'debug'
    });

    transport.log = mock;
    logger.debug('hello'); 

    const log = mock.mock.calls[0][0];

    expect(log.level).toBe('debug');
    expect(log.message).toBe('hello');
    expect(log.ns).toBe('test');
  });

  test('nested namespaces are included in logs', function () {
    const filters = new NamespaceFilters('debug', '*');
    const transport = new VoidTransport();
    const mock = jest.fn();

    const logger = createLogger('lvl1', filters, {
      transports: [ transport ],
      level: 'debug'
    });

    transport.log = mock;
    const nestedLogger = logger.ns('lvl2');
    nestedLogger.debug('hello lvl2');

    const log = mock.mock.calls[0][0];

    expect(log.level).toBe('debug');
    expect(log.message).toBe('hello lvl2');
    expect(log.ns).toBe('lvl1:lvl2');
  });
});

describe('namespace filters are applied to log entries', () => {
  test('exact filter matches are allowed', function () {
    const filters = new NamespaceFilters('debug', 'TEXO:APOLLO');
    const transport = new VoidTransport();
    const mock = jest.fn();

    const logger = createLogger('TEXO', filters, {
      transports: [ transport ],
      level: 'debug'
    });

    transport.log = mock;
    const nestedLogger = logger.ns('APOLLO');
    nestedLogger.debug('hello apollo');

    const log = mock.mock.calls[0][0];

    expect(log.level).toBe('debug');
    expect(log.message).toBe('hello apollo');
    expect(log.ns).toBe('TEXO:APOLLO');
  });

  test('exact filter misses are suppressed', function () { 
    const filters = new NamespaceFilters('debug', 'TEXO:APOLLO');
    const transport = new VoidTransport();
    const mock = jest.fn();

    const logger = createLogger('TEXO', filters, {
      transports: [ transport ],
      level: 'debug'
    });

    transport.log = mock;
    const nestedLogger = logger.ns('KOA');
    nestedLogger.debug('hello koa');

    expect(mock.mock.calls.length).toBe(0);
  });

  test('wildcard filter matches are allowed', function () {
    const filters = new NamespaceFilters('debug', 'TEXO:*');
    const transport = new VoidTransport();
    const mock = jest.fn();

    const logger = createLogger('TEXO', filters, {
      transports: [ transport ],
      level: 'debug'
    });

    transport.log = mock;
    const nestedLogger = logger.ns('APOLLO');
    nestedLogger.debug('hello apollo');

    const log = mock.mock.calls[0][0];

    expect(log.level).toBe('debug');
    expect(log.message).toBe('hello apollo');
    expect(log.ns).toBe('TEXO:APOLLO');
  });

  test('wildcard filter misses are suppressed', function () {
    const filters = new NamespaceFilters('debug', 'APP:*');
    const transport = new VoidTransport();
    const mock = jest.fn();

    const logger = createLogger('TEXO', filters, {
      transports: [ transport ],
      level: 'debug'
    });

    transport.log = mock;
    const nestedLogger = logger.ns('APOLLO');
    nestedLogger.debug('hello apollo');

    expect(mock.mock.calls.length).toBe(0);
  });
});

describe('level filters are applied to supression rules', function () {
  test('log items below the configured threshold are always allowed even if no filters match', function () {
    const filters = new NamespaceFilters('debug', 'TEXO:*');
    const transport = new VoidTransport();
    const mock = jest.fn();

    const logger = createLogger('APP', filters, {
      transports: [ transport ],
      level: 'debug'
    });

    transport.log = mock;
    logger.info('allowed');

    const log = mock.mock.calls[0][0];

    expect(log.level).toBe('info');
    expect(log.message).toBe('allowed');
    expect(log.ns).toBe('APP');

  });

  test('log items above the configured threshold are suppressed when no filters match', function () {
    const filters = new NamespaceFilters('debug', 'TEXO:*');
    const transport = new VoidTransport();
    const mock = jest.fn();

    const logger = createLogger('APP', filters, {
      transports: [ transport ],
      level: 'debug'
    });

    transport.log = mock;
    logger.debug('blocked'); 

    expect(mock.mock.calls.length).toBe(0);
  });
});

class VoidTransport extends Transport {
  constructor(opts?: any) {
    super(opts);
  }

  log(info: any, callback: any) : void {
    setImmediate(() => {
      this.emit('logged', info);
    });

    callback();
  }
}