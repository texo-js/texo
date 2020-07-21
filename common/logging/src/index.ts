export * from './logging';
export * from './filters';
export * from './namespace-set';
export * from './defaults';
 
import winston, { Logger } from 'winston';

export { Logger };
export const { format, transports } = winston;
