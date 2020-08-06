import { configure } from './configurer';
import { literal, setting, construct, provider } from '../configuration';
import { Demand } from '../settings';
import { withArgv, withEnv, withArgvAndEnv } from '../test-helpers';
import { ValueType } from '../settings/value-type';
import { ConfigurationError } from '../configuration-error';

interface ExampleConfiguration {
  name?: string;
  age?: number;
  length?: number;
  isHuman?: boolean;
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

describe('@texo/configurer', () => {
  describe('literals', () => {
    it('resolves literal placeholders', async () => {
      const configuration = await configure<ExampleConfiguration>({
        name: literal('Adam'),
        age: literal(40),
        isHuman: literal(false)
      });

      expect(configuration).toEqual({ name: 'Adam', age: 40, isHuman: false });
    });
  });

  describe('settings', () => {
    it('correctly resolves setting configuration values from parameters', async () => {
      await withArgv([ '--name', 'Gavin', '--age', '40', '--is-human', 'false', '--length', '35.4' ], async () => {
        const configuration = await configure<ExampleConfiguration>({
          name: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, parameter: 'name' }),
          age: setting({ type: ValueType.INTEGER, demand: Demand.REQUIRED, parameter: 'age' }),
          length: setting({ type: ValueType.NUMBER, demand: Demand.REQUIRED, parameter: 'length' }),
          isHuman: setting({ type: ValueType.BOOLEAN, demand: Demand.REQUIRED, parameter: 'is-human'})
        });

        expect(configuration).toEqual({ name: 'Gavin', age: 40, isHuman: false, length: 35.4 });
      });
    });

    it('correctly resolves setting configuration values from environment variables', async () => {
      await withEnv({ 'TEXO_NAME': 'Kevin', 'TEXO_AGE': '40', 'TEXO_IS_HUMAN': 'false', 'TEXO_LENGTH': '47.5' }, async () => {
        const configuration = await configure<ExampleConfiguration>({
          name: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, environment: 'TEXO_NAME' }),
          age: setting({ type: ValueType.INTEGER, demand: Demand.REQUIRED, environment: 'TEXO_AGE' }),
          length: setting({ type: ValueType.NUMBER, demand: Demand.REQUIRED, environment: 'TEXO_LENGTH' }),
          isHuman: setting({ type: ValueType.BOOLEAN, demand: Demand.REQUIRED, environment: 'TEXO_IS_HUMAN'})
        });

        expect(configuration).toEqual({ name: 'Kevin', age: 40, isHuman: false, length: 47.5 });
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
        age: setting({ type: ValueType.INTEGER, demand: Demand.REQUIRED, environment: 'TEXO_AGE', default: 34 }),
        isHuman: setting({ type: ValueType.BOOLEAN, demand: Demand.REQUIRED, environment: 'TEXO_IS_HUMAN', default: true })
      });

      expect(configuration).toEqual({ name: 'Harry', age: 34, isHuman: true });
    });

    it('ignores missing optionals', async () => {
      const configuration = await configure<ExampleConfiguration>({
        name: setting({ type: ValueType.STRING, demand: Demand.OPTIONAL, environment: 'TEXO_NAME' })
      });

      expect(configuration).toEqual({});
    });

    it('throws for missing required settings with no default', () => {
      return configure<ExampleConfiguration>({
        name: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, environment: 'TEXO_NAME' })
      }).catch(e => expect(e).toBeInstanceOf(ConfigurationError));
    });

    it('throws for invalid integers', () => {
      return withEnv({ 'TEXO_AGE': 'stuart' }, async () => {
        return await configure<ExampleConfiguration>({
          age: setting({ type: ValueType.INTEGER, demand: Demand.REQUIRED, environment: 'TEXO_AGE' })
        });
      }).catch(e => expect(e).toBeInstanceOf(ConfigurationError));
    });

    it('throws for invalid numbers', () => {
      return withEnv({ 'TEXO_AGE': 'eleven' }, async () => {
        return await configure<ExampleConfiguration>({
          age: setting({ type: ValueType.NUMBER, demand: Demand.REQUIRED, environment: 'TEXO_AGE' })
        });
      }).catch(e => expect(e).toBeInstanceOf(ConfigurationError));
    });
  });

  describe('nested objects', () => {
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

    it('traverses nested options with settings', () => {
      const result = withArgv([ '--age', '93' ], async () => {
        return await configure<NestedConfiguration>({
          color: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, default: 'green'}),
          child: {
            name: literal('Claude'),
            age: setting({ type: ValueType.NUMBER, demand: Demand.REQUIRED, parameter: 'age' })
          }
        });
      });

      expect(result).resolves.toEqual({ color: 'green', child: { name: 'Claude', age: 93 } });
    });
  });

  describe('provide', () => {
    it('creates provided classes', async () => {
      class ProvidedThing {
        #name: string;

        constructor() {
          this.#name = 'the-name'
        }

        get name() { return this.#name; }
      }

      interface PT {
        thing: ProvidedThing
      }

      const result = await configure<PT>({
        thing: construct(ProvidedThing)
      });

      expect(result.thing).toBeInstanceOf(ProvidedThing);
      expect(result.thing.name).toBe('the-name');
    });

    it('creates configurable provided classes', async () => {
      class ProvidedConfiguredThing {
        #name: string;

        constructor({ name }: { name: string }) {
          this.#name = name;
        }

        get name() { return this.#name; }
      }

      interface PT {
        thing: ProvidedConfiguredThing
      }

      const result = await configure<PT>({
        thing: construct(ProvidedConfiguredThing).withOptions({ name: literal('configured-thing') })
      });

      expect(result.thing).toBeInstanceOf(ProvidedConfiguredThing);
      expect(result.thing.name).toBe('configured-thing');
    });
  });

  describe('providers', () => {
    it('populates providers', async () => {
      interface ThingOptions {
        isWeird: boolean;
      }

      interface Thing {
        name: string;
      }

      const ThingProvider = (options: ThingOptions): Thing => {
        return { name: options.isWeird ? 'A Weird Thing' : 'A normal thing' };
      }


      const configuration = await configure<ExampleWithProvider>({
        name: literal('Adam'),
        thing: provider(ThingProvider).withOptions({ isWeird: literal(false) })
      });

      expect(configuration).toEqual({ name: 'Adam', thing: { name: 'A normal thing' } });
    });

    it('populates providers without options', async () => {
      interface Thing {
        name: string;
      }

      const ThingProvider = (): Thing => {
        return { name: 'set locally' };
      }

      const configuration = await configure<ExampleWithProvider>({
        name: literal('Adam'),
        thing: provider(ThingProvider)
      });

      expect(configuration).toEqual({ name: 'Adam', thing: { name: 'set locally' } });
    });
  });

  describe('inferred placeholders', () => {
    it('infers literals', async () => {
      const configuration = await configure<ExampleConfiguration>({
        name: 'Adam',
        age: 40,
        isHuman: false
      });

      expect(configuration).toEqual({ name: 'Adam', age: 40, isHuman: false });
    });
  });
});