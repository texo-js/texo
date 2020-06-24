export interface IdentityGatekeeperServerOptions {
  accessTokenKeys: KeyPairLocation;
  refreshTokenKeys: KeyPairLocation;
}

export interface KeyPairLocation {
  publicKeysFile: string;
  privateKeyFile: string;
}