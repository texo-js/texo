import 'dotenv/config';
import yargs, { Options } from 'yargs';
import { resolve } from 'path';
import { existsSync, statSync } from 'fs';

import { ConfigurationOptions, ConfigurationOption, DemandType, ValueType } from './configuration-options';
import { ConfigurationMapper } from './configuration-mapper';
import { ConfigurationError } from './configuration-error';

const FLOAT_REGEX: RegExp = /^[-+]?[0-9]*\.?[0-9]+$/;
const INTEGER_REGEX: RegExp = /^[-+]?[0-9]+$/;

function isInteger(value: string) : boolean {
  return INTEGER_REGEX.test(value);
}

function isFloat(value: string) : boolean {
  return FLOAT_REGEX.test(value);
}

export async function buildConfiguration<TConfiguration>(options: ConfigurationOptions, mapper?: ConfigurationMapper<TConfiguration>) : Promise<TConfiguration> {
  const [ commandLineValues, environmentValues ] = await Promise.all([ getCommandLineValues(options), getEnvironmentValues(options) ]);

  const x = await processOptionValues(options, commandLineValues, environmentValues);
  return mapper!.map(x);
}

async function processOptionValues(options: ConfigurationOptions, commandLineValues: Record<string, string>, environmentValues: Record<string, string>): Promise<Record<string, string | number | boolean>> {
  const result: Record<string, string | number | boolean> = {};

  Object.entries(options).forEach(([key, option]) => {
    let value: string = commandLineValues[key] || environmentValues[key];

    switch (option.demand) {
      case DemandType.REQUIRED:
        if (value === undefined) {
          throw new ConfigurationError(`A value for the '${key}' option is required.`);
        }
        break;

      case DemandType.DEFAULTED:
        if (value === undefined) {
          result[key] = option.default;
          return;
        }
        break;

      case DemandType.OPTIONAL:
        if (value === undefined) {
          return;
        }
        break;
    }

    value = value.trim();

    switch (option.type) {
      case ValueType.INTEGER: {
        if (!isInteger(value)) {
          throw new ConfigurationError(`The value '${value}' in option '${key}' is not a valid integer`);
        }
        result[key] = parseInt(value, 10);
        return;
      }
        
      case ValueType.NUMBER: {
        if (!isFloat(value)) {
          throw new ConfigurationError(`The value '${value}' in option '${key}' is not a valid number`);
        }
        result[key] = parseFloat(value);
        return;
      }

      case ValueType.BOOLEAN: {
        result[key] = (value === 'true') ? true : false;
        return;
      }

      case ValueType.FILE: {
        const path = resolve(value);
        if (!existsSync(path)) {
          throw new ConfigurationError(`The file '${value}' does not exist.`);
        }

        const stat = statSync(path);
        if (!stat.isFile()) {
          throw new ConfigurationError(`The path '${value}' is not a file.`);
        }
        
        result[key] = value;
        return;
      }

      case ValueType.FOLDER: {
        const path = resolve(value);
        if (!existsSync(path)) {
          throw new ConfigurationError(`The file '${value}' does not exist.`);
        }

        const stat = statSync(path);
        if (!stat.isDirectory()) {
          throw new ConfigurationError(`The path '${value}' is not a file.`);
        }
        
        result[key] = value;
        return;
      }

      case ValueType.PATH: {
        
      }

      case ValueType.STRING: {
        result[key] = value;
      }
    }

    return value;
  });

  return result;
}

async function getCommandLineValues(options: ConfigurationOptions) : Promise<Record<string, string>> {
  Object.entries(options).forEach(([key, value]) => {
    if (value.argName) {
      const opt = getYargConfigForOption(value);
      yargs.option(value.argName, opt);
    }
  });

  const args = yargs.parse(process.argv);

  const result: Record<string, string> = {};
  Object.entries(options).forEach(([key, option]) => {
    if (option.argName) {
      const arg = args[option.argName];
      if (arg !== undefined) {
        if (typeof arg === 'string') {
          result[key] = arg;
        } else if (typeof arg === 'boolean') {
          result[key] = arg ? 'true' : 'false';
        }
      }
    }
  });

  return result;
}

function getYargConfigForOption(option: ConfigurationOption) : Options {
  const opt: Options = {};

  switch (option.type) {
    case ValueType.BOOLEAN:
      opt.type = 'boolean';
      break;

    default:
      opt.type = 'string';
  }

  return opt;
}

async function getEnvironmentValues(options: ConfigurationOptions) : Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  Object.entries(options).forEach(([key, option]) => {
    if (option.envName) {
      const value = process.env[option.envName];
      if (value !== undefined) {
        result[key] = option.type === ValueType.BOOLEAN ? (Boolean(value) ? 'true' : 'false') : value;
      }
    }
  });

  return result;
}