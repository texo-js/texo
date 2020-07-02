import { TransformableInfo } from 'logform';
import { LEVEL, MESSAGE } from 'triple-beam';
import { Format } from '@texo/logging';

import { Loggers, getSystemLogger, setSystemLogger, Defaults } from './logger';
import { stringify } from 'querystring';

describe('logger', () => {
  describe('the default logger can be managed', function () {
    it('correctly manages the system logger', function () {
        const logger = Loggers.create({ options: { level: 'info' } });
        setSystemLogger(logger);

        expect(getSystemLogger()).toBe(logger);
    });
  });

  describe('The default console format rendering', () => {
    const format = Defaults.DefaultConsoleFormat;
    let timestamp: string, now: Date, spy: jest.SpyInstance;

    beforeEach(() => {
      timestamp = '2020-07-02T16:00:04.102Z';
      now = new Date(timestamp);

      spy = jest.spyOn<any, any>(global, 'Date').mockImplementationOnce(() => now);
    });

    afterEach(() => {
      spy.mockRestore();
    })

    it('correctly formats the log output', () => {
      const info = objectToInfo({
        level: 'info',
        message: 'hello',
        ns: '/level-2/level-2',
        something: 'else'
      });
      
      const result = getTransformedMessage(format, info) as string;
      expect(result).toMatchSnapshot();
    });
  });
});

function objectToInfo(obj: TransformableInfo) : TransformableInfo {
  return { ...obj, [LEVEL]: obj.level };
}

function getTransformedMessage(format: Format, info: TransformableInfo): string | boolean {
  const transform = format.transform(objectToInfo(info));
  if (transform === false) {
    return false;
  }

  return (transform as TransformableInfo)[MESSAGE as any];
}