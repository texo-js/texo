import Router from '@koa/router';

import { ServerMetadata } from '../server-metadata';
import { ServerHealthRouter } from './server-health-router';
import { ServerStatusRouter } from './server-status-router';

export class MetadataRouter extends Router {
  constructor(metadata: ServerMetadata) {
    super({ prefix: '/meta' });
    this.initialize(metadata)
  }

  private initialize(metadata: ServerMetadata) : void {
    const serverHealthRouter = new ServerHealthRouter(metadata);
    this.use(serverHealthRouter.routes(), serverHealthRouter.allowedMethods());

    const serverStatusRouter = new ServerStatusRouter(metadata);
    this.use(serverStatusRouter.routes(), serverStatusRouter.allowedMethods());
  }
}