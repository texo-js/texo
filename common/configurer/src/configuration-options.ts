export enum ValueType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  FILE = 'FILE',
  FOLDER = 'FOLDER',
  PATH = 'PATH'
}

export enum DemandType {
  REQUIRED = 'REQUIRED',
  OPTIONAL = 'OPTIONAL',
  DEFAULTED = 'DEFAULTED'
}

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>> 
    & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]

type Defaulted<T> = { demand: DemandType.DEFAULTED, default: T };
type NonDefaulted = { demand: DemandType.REQUIRED | DemandType.OPTIONAL, default?: never };

type StringDefaults = ValueType.STRING | ValueType.PATH | ValueType.FILE | ValueType.FOLDER;
type NumberDefaults = ValueType.INTEGER | ValueType.NUMBER;

type DefaultType<T extends ValueType> = T extends StringDefaults ? string : T extends NumberDefaults ? number : boolean;

type BaseConfigurationOption<T extends ValueType> = 
  { type: T, default?: DefaultType<T>, envName?: string; argName?: string; } & (Defaulted<DefaultType<T>> | NonDefaulted) & RequireAtLeastOne<any, 'envName' | 'argName'>;

type StringConfigurationOption = BaseConfigurationOption<ValueType.STRING>;
type NumberConfigurationOption = BaseConfigurationOption<ValueType.NUMBER>;
type IntegerConfigurationOption = BaseConfigurationOption<ValueType.INTEGER>;
type BooleanConfigurationOption = BaseConfigurationOption<ValueType.BOOLEAN>;
type FileConfigurationOption = BaseConfigurationOption<ValueType.FILE>;
type FolderConfigurationOption = BaseConfigurationOption<ValueType.FOLDER>;
type PathConfigurationOption = BaseConfigurationOption<ValueType.PATH>;

export type ConfigurationOption = StringConfigurationOption | NumberConfigurationOption | IntegerConfigurationOption | BooleanConfigurationOption | FileConfigurationOption | FolderConfigurationOption | PathConfigurationOption;

export interface ConfigurationOptions {
  [key: string]: ConfigurationOption
}
