import { QueryContextAdaptor } from './adaptors/query-context/query-context-adaptor';
import { AuthorizationAdaptor } from './adaptors/authorization';

export interface GatewayServerOptions {
  gatewayTokenKeys: KeyPairLocation // The location of the public/private keys for generating gateway tokens
  authorizationAdaptor: AuthorizationAdaptor; // Provider of authorisation logic to determine the requesting identity scope
  queryContextAdaptor: QueryContextAdaptor // The factory for creating context builders
}

export interface KeyPairLocation {
  publicKeysFile: string;
  privateKeyFile: string;
}