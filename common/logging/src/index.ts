export * from './logging';
export * from './filters';
export * from './namespace-set';
export * from './defaults';
export * from './profiler';
 
import winston, { Logger } from 'winston';

export { Logger };
export const { format: Formats, transports: Transports } = winston;
