import { configure } from './configurer';
import { literal, setting, provider } from '../configuration';
import { Demand } from '../settings';
import { withArgv, withEnv, withArgvAndEnv } from '../test-helpers';
import { ValueType } from '../settings/value-type';
import { Provider } from '../provider';

interface ExampleConfiguration {
  name?: string;
  age?: number;
}

interface NestedConfiguration {
  color: string;
  child: ExampleConfiguration;
}

interface ThingOptions {
  isWeird: boolean;
}

class ThingProvider {
  constructor(options: ThingOptions) {

  }
}

interface ExampleWithProvider {
  name: string;
  thing: ThingProvider;
}

describe('resolution of configuration placeholders', () => {
  it('correctly resolves literal configuration values', async () => {
    const configuration = await configure<ExampleConfiguration>({
      name: literal('Adam'),
      age: literal(40)
    });

    expect(configuration).toEqual({ name: 'Adam', age: 40 });
  });

  it('correctly resolves setting configuration values from parameters', async () => {
    await withArgv([ '--name', 'Gavin', '--age', '40' ], async () => {
      const configuration = await configure<ExampleConfiguration>({
        name: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, parameter: 'name' }),
        age: setting({ type: ValueType.INTEGER, demand: Demand.REQUIRED, parameter: 'age' })
      });

      expect(configuration).toEqual({ name: 'Gavin', age: 40 });
    });
  });

  it('correctly resolves setting configuration values from environment variables', async () => {
    await withEnv({ 'TEXO_NAME': 'Kevin', 'TEXO_AGE': '40' }, async () => {
      const configuration = await configure<ExampleConfiguration>({
        name: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, environment: 'TEXO_NAME' }),
        age: setting({ type: ValueType.INTEGER, demand: Demand.REQUIRED, environment: 'TEXO_AGE' })
      });

      expect(configuration).toEqual({ name: 'Kevin', age: 40 });
    });
  });

  it('prioritises parameters over environment values', async () => {
    await withArgvAndEnv([ '--name', 'Gavin', '--age', '60' ], { 'TEXO_NAME': 'Kevin', 'TEXO_AGE': '40' }, async () => {
      const configuration = await configure<ExampleConfiguration>({
        name: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, parameter: 'name', environment: 'TEXO_NAME' }),
        age: setting({ type: ValueType.INTEGER, demand: Demand.REQUIRED, parameter: 'age', environment: 'TEXO_AGE' })
      });

      expect(configuration).toEqual({ name: 'Gavin', age: 60 });
    });    
  });

  it('applies defaults', async () => {
    const configuration = await configure<ExampleConfiguration>({
      name: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, environment: 'TEXO_NAME', default: 'Harry' }),
      age: setting({ type: ValueType.INTEGER, demand: Demand.REQUIRED, environment: 'TEXO_AGE', default: 34 })
    });

    expect(configuration).toEqual({ name: 'Harry', age: 34 });
  });

  it('traverses nested options', async () => {
    const configuration = await configure<NestedConfiguration>({
      color: literal('red'),
      child: {
        name: literal('Barry'),
        age: literal(12)
      }
    });

    expect(configuration).toEqual({ color: 'red', child: { name: 'Barry', age: 12 } });
  });

  it('traverses nested options with settings', async () => {
    await withArgv([ '--age', '93' ], async () => {
      const configuration = await configure<NestedConfiguration>({
        color: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, default: 'green'}),
        child: {
          name: literal('Claude'),
          age: setting({ type: ValueType.NUMBER, demand: Demand.REQUIRED, parameter: 'age' })
        }
      });

      expect(configuration).toEqual({ color: 'green', child: { name: 'Claude', age: 93 } });
    });
  });

  it('populates providers', async () => {
    interface ThingOptions {
      isWeird: boolean;
    }

    interface Thing {
      name: string;
    }

    class ThingProvider implements Provider<Thing, ThingOptions> {
      provide(options: ThingOptions): Thing {
        return { name: options.isWeird ? 'A Weird Thing' : 'A normal thing' };
      }
    }

    const configuration = await configure<ExampleWithProvider>({
      name: literal('Adam'),
      thing: provider(new ThingProvider()).withOptions({ isWeird: literal(false) })
    });

    expect(configuration).toEqual({ name: 'Adam', thing: { name: 'A normal thing' } });
  });
});