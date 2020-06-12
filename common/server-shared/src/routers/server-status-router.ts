import Router from '@koa/router';
import os from 'os';

import { ServerMetadata } from '../server-metadata';

export class ServerStatusRouter extends Router {
  constructor(metadata: ServerMetadata) {
    super({ prefix: '/status' });
    this.initalize(metadata);
  }

  private initalize(metadata: ServerMetadata) : void {
    this.get('status', '/', async (ctx) => {
      ctx.body = {
        application: {
          name: metadata.applicationName,
          version: metadata.applicationVersion
        },
        texo: {
          type: metadata.serverType,
          version: metadata.texoVersion
        },
        host: {
          server: os.hostname(),
          node: process.version
        }
      };
    })
  }
}