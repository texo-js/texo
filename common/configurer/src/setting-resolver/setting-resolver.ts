import parser from 'yargs-parser';

import { Setting, Demand } from '../settings';
import { ConfigurationError } from '../configuration-error';
import { ValueType } from '../settings/value-type';
import { isNumber } from 'util';

const parserConfiguration = {
  'camel-case-expansion': false,
  'dot-notation': false,
  'parse-numbers': false,
  'duplicate-arguments-array': false,
  'strip-aliased': true,
  'unknown-options-as-args': false
};

export function resolveSettings(settings: Setting<any>[]): any[] {
  const parameters = parser(process.argv.slice(2), {
    configuration: parserConfiguration
  });

  return settings.map(setting => coerceValue(getValue(setting, parameters), setting));
}

function getValue(setting: Setting<any>, parameters: Record<string, string>): any {
  const parameterValue = setting.parameter && parameters[setting.parameter];

  if (parameterValue) {
    return parameterValue;
  }

  const environmentValue = setting.environment && process.env[setting.environment];
  if (environmentValue) {
    if (setting.type === ValueType.BOOLEAN) {
      return Boolean(environmentValue) ? 'true' : 'false';
    }
    
    return environmentValue;
  }

  if (setting.default !== undefined) {
    return setting.default;
  }

  if (setting.demand === Demand.OPTIONAL) {
    return undefined;
  }

  throw new ConfigurationError('No value could be found for setting.');
}

function coerceValue(value: string, setting: Setting<any>): any {
  switch (setting.type) {
    case ValueType.STRING:
      return value;

    case ValueType.NUMBER:
      if (!isNumber(value)) {
        throw new ConfigurationError(`The value '${value}' is not a valid number`);
      }
      return parseFloat(value);

    case ValueType.INTEGER:
      if (!isInteger(value)) {
        throw new ConfigurationError(`The value '${value}' is not a valid integer`);
      }
      return parseInt(value, 10);

    case ValueType.BOOLEAN:
      return (value === 'true');
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