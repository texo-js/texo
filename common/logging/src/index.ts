export * from './logging';
export * from './filters';
export * from './namespace-set';
 
import winston, { Logger } from 'winston';

export { Logger };
export const { format, transports } = winston;
