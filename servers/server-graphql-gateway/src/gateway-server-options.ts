export interface GatewayServerOptions {
  accessTokenJwksUrl: string; // Where to look for the JWKS for verifying client access tokens
  gatewayTokenKeys: KeyPairLocation // The location of the public/private keys for generating gateway tokens
}

export interface KeyPairLocation {
  publicKeysFile: string;
  privateKeyFile: string;
}