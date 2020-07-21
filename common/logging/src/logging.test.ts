import { TransformableInfo } from 'logform';
import { LEVEL, MESSAGE } from 'triple-beam';
import { Format } from '@texo/logging';

import { Loggers } from './logging';

describe('logger', () => {
  describe('the default logger can be managed', function () {
    it('correctly manages the system logger', function () {
        const logger = Loggers.create({ options: { level: 'info' } });
        Loggers.setSystem(logger);

        expect(Loggers.getSystem()).toBe(logger);
    });
  });
});
