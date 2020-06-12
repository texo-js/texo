import Router from '@koa/router';
import { ServerMetadata } from '../server-metadata';

export class ServerHealthRouter extends Router {
  constructor(metadata: ServerMetadata) {
    super({ prefix: '/health' });
    this.initialize(metadata);
  }

  initialize(metadata: ServerMetadata) {
    this.get('health', '/', async (ctx) => {
      ctx.body = {
        application: {
          name: metadata.applicationName,
          version: metadata.applicationVersion
        },
        texo: {
          type: metadata.serverType,
          version: metadata.texoVersion
        }
      }
    })
  }
}
