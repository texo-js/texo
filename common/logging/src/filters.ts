import tripleBeam from 'triple-beam';
import winston from 'winston';
import { TransformableInfo } from 'logform';

import { NamespaceSet } from './namespace-set';

const { LEVEL } = tripleBeam;
const { config } = winston

export interface LoggingLevels {
  [key: string]: number;
}

export interface FilterOptions {
  levels?: LoggingLevels
  filterLevel: string;
  namespaces: NamespaceSet
}

export interface Format {
  transform(info: TransformableInfo) :  TransformableInfo | boolean;
}

export class FilterError extends Error { }

export namespace Filters {
  class Filter implements Format {
    private levels: LoggingLevels;
    private namespaces: NamespaceSet;
    private levelIndex: number;

    constructor(options: FilterOptions) {
      this.levels = options.levels || config.npm.levels;
      this.namespaces = options.namespaces;

      const levelIndex = this.getLevelValue(this.levels, options.filterLevel);
      if (levelIndex === null) {
        throw new FilterError(`The level '${options.filterLevel}' is unknown.`);
      } 

      this.levelIndex = levelIndex;
    }

    public transform(info: TransformableInfo) : TransformableInfo | boolean {
      const infoLevel = this.getLevelValue(this.levels, info[LEVEL as any]);
      if (infoLevel === null) {
        return false;
      }

      if (infoLevel <= this.levelIndex) {
        return info;
      }

      return this.namespaces.matches(info.ns) ? info : false;
    }

    private getLevelValue(levels: LoggingLevels, level: string) : number | null {
      const value = levels[level];

      return (!value && value !== 0) ? null : value;
    }
  }

  export const create = (options: FilterOptions) => new Filter(options);
}
