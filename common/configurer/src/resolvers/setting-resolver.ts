import parser from 'yargs-parser';

import { Setting, Demand } from '../settings';
import { ConfigurationError } from '../configuration-error';
import { ValueType } from '../settings/value-type';
import { BatchProcessor, Item } from '../batch-processor';

export class SettingResolver {
  #batch: BatchProcessor<Setting<any>, any>;

  constructor() {
    this.#batch = new BatchProcessor(settingBatchExecutor);
  }

  resolve<T>(setting: Setting<T>): Promise<T> {
    return this.#batch.enqueue(setting);
  }
}

function settingBatchExecutor(items: Item<Setting<any>, any>[]) {

  const values = resolveSettings(items.map(item => item.value));
  
  for (let i = 0; i < items.length; i++) {
    const value = values[i];
    const item = items[i];

    if (value instanceof Error) {
      item.reject(value);
    } else {
      item.resolve(value);
    }
  }
}

const parserConfiguration = {
  'camel-case-expansion': false,
  'dot-notation': false,
  'parse-numbers': false,
  'duplicate-arguments-array': false,
  'strip-aliased': true,
  'unknown-options-as-args': false
};

function resolveSettings(settings: Setting<any>[]): any[] {
  const parameters = parser(process.argv.slice(2), {
    configuration: parserConfiguration
  });

  return settings.map(setting => {
    try {
      return coerceValue(getValue(setting, parameters), setting)
    } catch (e) {
      return e;
    }
  });
}

function getValue(setting: Setting<any>, parameters: Record<string, string>): any {
  const parameterValue = setting.parameter && parameters[setting.parameter];
  if (parameterValue) {
    return parameterValue;
  }

  const environmentValue = setting.environment && process.env[setting.environment];
  if (environmentValue) {
    if (setting.type === ValueType.BOOLEAN) {
      return environmentValue.toUpperCase() === 'TRUE' ? 'true' : 'false';
    }
    
    return environmentValue;
  }

  if (setting.default !== undefined) {
    return setting.default;
  }

  if (setting.demand === Demand.OPTIONAL) {
    return undefined;
  }

  throw new ConfigurationError(getMissingSettingErrorMessage(setting));
}

function getMissingSettingErrorMessage(setting: Setting<any>): string {
  const isBoth = (setting.parameter && setting.environment);
  if (isBoth) {
    return `A required setting was not provided. Either the configuration parameter '${setting.parameter}' or the environment variable '${setting.environment}' must be set.`;
  }

  if (setting.parameter) {
    return `A required setting was not provided. The configuration parameter '${setting.parameter}' must be set.`;
  }

  return `A required setting was not provided. The environment variable '${setting.environment}' must be set.`;
}

function coerceValue(value: any, setting: Setting<any>): any {
  switch (setting.type) {
    case ValueType.STRING:
      return value;

    case ValueType.NUMBER:
      if (!isFloat(value)) {
        throw new ConfigurationError(`The value '${value}' is not a valid number`);
      }
      return parseFloat(value);

    case ValueType.INTEGER:
      if (!isInteger(value)) {
        throw new ConfigurationError(`The value '${value}' is not a valid integer`);
      }
      return parseInt(value, 10);

    case ValueType.BOOLEAN:
      return (value === true || value === 'true');
  }

  throw new ConfigurationError(`Unknown setting type '${setting.type}'`);
}

const FLOAT_REGEX: RegExp = /^[-+]?[0-9]*\.?[0-9]+$/;
const INTEGER_REGEX: RegExp = /^[-+]?[0-9]+$/;

function isInteger(value: string) : boolean {
  return INTEGER_REGEX.test(value);
}

function isFloat(value: string) : boolean {
  return FLOAT_REGEX.test(value);
}