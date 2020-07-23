import { TransformableInfo, Format } from 'logform';
import { LEVEL, MESSAGE } from 'triple-beam';
import { EOL } from 'os';
import colors from 'colors/safe';

import { Defaults } from './defaults';

describe('@texo/logging', () => {
  let timestamp: string, now: Date, spy: jest.SpyInstance;

  beforeEach(() => {
    timestamp = '2020-07-02T16:00:04.102Z';
    now = new Date(timestamp);

    spy = jest.spyOn<any, any>(global, 'Date').mockImplementationOnce(() => now);
  });

  afterEach(() => {
    spy.mockRestore();
  });

  describe('default console format', () => {  
    it('correctly formats the log output', () => {
      const format = Defaults.DefaultConsoleFormat;

      const info = objectToInfo({
        level: 'info',
        message: 'hello',
        ns: 'level-2/level-2',
        something: 'else'
      });
      
      const result = getTransformedMessage(format, info) as string;
      expect(result).toBe(`2020-07-02T16:00:04.102Z ${colors.green('info')} [level-2/level-2] hello${EOL}{"something":"else"}`);
    });
  });

  describe('default console logger', () => {
    it('logs correctly to the console', () => {
      const spy = jest.spyOn((global.console as any)._stdout, 'write').mockImplementation();

      const logger = Defaults.createDefaultConsoleLogger('test');
      logger.info('this is a test');
      
      expect(spy).toHaveBeenCalledWith(`2020-07-02T16:00:04.102Z ${colors.green('info')} [test] this is a test${EOL}{}${EOL}`);

      spy.mockRestore();
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
