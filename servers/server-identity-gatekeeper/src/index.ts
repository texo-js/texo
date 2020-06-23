export * from './server';
export * from './server-config';

import { JWKS, JSONWebKeySet, JWK, JSONWebKey } from 'jose';
import { readFileSync } from 'fs';

function loadKeyStore(path: string) : JWKS.KeyStore {
  const jwks = loadFile<JSONWebKeySet>(path);

  return JWKS.asKeyStore(jwks);
}

function loadKey(path: string) : JWK.Key {
  const jwk : JSONWebKey = loadFile(path);

  return JWK.asKey(jwk as any);
}

function loadFile<T>(path: string) : T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

