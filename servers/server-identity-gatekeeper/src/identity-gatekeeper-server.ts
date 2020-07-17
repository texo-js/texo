import { Logger, Loggers } from '@texo/logging';
import { getSystemLogger, ServerMetadata, ServerType, printWelcome } from '@texo/server-common';
import Koa from 'koa'

import { IdentityGatekeeperOptions } from "./identity-gatekeeper-options";


export class IdentityGatekeeperServer {

  private app: Koa;
  private metadata: ServerMetadata;
  private options: IdentityGatekeeperOptions;
  private logger: Logger;

  constructor({ options, metadata }: { options: IdentityGatekeeperOptions, metadata: ServerMetadata }) {
    this.logger = Loggers.createChild({ parent: getSystemLogger(), namespace: 'TEXO' });

    this.options = options;
    this.metadata = { ...metadata, serverType: ServerType.IDENTITY_GATEKEEPER, texoVersion: '%{{TEXO_VERSION}}' };

    console.dir(options);
    this.app = new Koa();

    printWelcome('Texo', this.metadata);
  }

  public listen({ port }:  { port: number }) {
    this.app.listen(port);
  }
}

// import { JWKS, JSONWebKeySet, JWK, JSONWebKey } from 'jose';
// import { readFileSync } from 'fs';

// function loadKeyStore(path: string) : JWKS.KeyStore {
//   const jwks = loadFile<JSONWebKeySet>(path);

//   return JWKS.asKeyStore(jwks);
// }

// function loadKey(path: string) : JWK.Key {
//   const jwk : JSONWebKey = loadFile(path);

//   return JWK.asKey(jwk as any);
// }

// function loadFile<T>(path: string) : T {
//   return JSON.parse(readFileSync(path, 'utf8')) as T;
// }