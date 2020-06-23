import { ConfigurationOptions, ValueType, DemandType } from './configuration-options';
import { buildConfiguration } from './configurer';
import { ConfigurationMapper } from './configuration-mapper';
import { withArgv, withEnv } from './test-helpers';

describe('configuration is processed correctly', () => {
  describe('environment variables are applied', () => {
    it('applies string variables', async () => {
      const options: ConfigurationOptions = {
        'option1': {
          type: ValueType.STRING,
          demand: DemandType.REQUIRED,
          envName: 'OPTION_1',
        }
      }
      
      await withEnv({ OPTION_1: 'from-env' }, async () => {
        const config = await buildConfiguration(options, passThroughMapper);
        expect(config).toStrictEqual({ option1: "from-env" });
      });
    });

    it('applies integer variables', async () => {
      const options: ConfigurationOptions = {
        'option1': {
          type: ValueType.INTEGER,
          demand: DemandType.REQUIRED,
          envName: 'OPTION_1',
        }
      }
      
      await withEnv({ OPTION_1: '123' }, async () => {
        const config = await buildConfiguration(options, passThroughMapper);
        expect(config).toStrictEqual({ option1: 123 });
      });
    });

    it('applies number variables', async () => {
      const options: ConfigurationOptions = {
        'option1': {
          type: ValueType.NUMBER,
          demand: DemandType.REQUIRED,
          envName: 'OPTION_1',
        }
      }
      
      await withEnv({ OPTION_1: '123.45' }, async () => {
        const config = await buildConfiguration(options, passThroughMapper);
        expect(config).toStrictEqual({ option1: 123.45 });
      });
    });

    it('applies boolean variables', async () => {
      const options: ConfigurationOptions = {
        'option1': {
          type: ValueType.BOOLEAN,
          demand: DemandType.REQUIRED,
          envName: 'OPTION_1',
        }
      }
      
      await withEnv({ OPTION_1: 'true' }, async () => {
        const config = await buildConfiguration(options, passThroughMapper);
        expect(config).toStrictEqual({ option1: true });
      });
    });
  });

  describe('command line parameters are applied', () => {
    it('applies string arguments', async () => {
      const options: ConfigurationOptions = {
        'option1': {
          type: ValueType.STRING,
          demand: DemandType.REQUIRED,
          argName: 'option-1',
        }
      }
      
      await withArgv([ '--option-1', 'from-cmd-line' ], async () => {
        const config = await buildConfiguration(options, passThroughMapper);
        expect(config).toStrictEqual({ option1: "from-cmd-line" });
      });
    });
  });

  describe('defaults are applied correctly', () => {
    it('applies default strings when no value is available', async () => {
      const options: ConfigurationOptions = {
        'option1': {
          type: ValueType.STRING,
          demand: DemandType.DEFAULTED,
          argName: 'option-1',
          default: 'default-value'
        }
      }

      const config = await buildConfiguration(options, passThroughMapper);
      expect(config).toStrictEqual({ option1: "default-value" });
    });

    it('applies default numbers when no value is available', async () => {
      const options: ConfigurationOptions = {
        'option1': {
          type: ValueType.NUMBER,
          demand: DemandType.DEFAULTED,
          argName: 'option-1',
          default: 1.235
        }
      }

      const config = await buildConfiguration(options, passThroughMapper);
      expect(config).toStrictEqual({"option1": 1.235});
    });

    it('applies default integers when no value is available', async () => {
      const options: ConfigurationOptions = {
        'option1': {
          type: ValueType.INTEGER,
          demand: DemandType.DEFAULTED,
          argName: 'option-1',
          default: 45
        }
      }

      const config = await buildConfiguration(options, passThroughMapper);
      expect(config).toStrictEqual({"option1": 45});
    });

    it('does not apply the default when a matching environment variable is present', async () => {
      const options: ConfigurationOptions = {
        'option1': {
          type: ValueType.INTEGER,
          demand: DemandType.DEFAULTED,
          envName: 'OPTION_A',
          default: 45
        }
      }

      withEnv({ OPTION_A: '67' }, async () => {
        const config = await buildConfiguration(options, passThroughMapper);
        expect(config).toStrictEqual({ option1: 67 });
      });
    });
  });
});

const passThroughMapper: ConfigurationMapper<object> = {
  map(items: Record<string, string | number | boolean>): object {
    return items;
  }
}