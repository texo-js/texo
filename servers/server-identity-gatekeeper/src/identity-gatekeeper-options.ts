export interface IdentityGatekeeperOptions {
  accessTokenKeys: KeyPairLocation;
  refreshTokenKeys: KeyPairLocation;
}

export interface KeyPairLocation {
  publicKeysFile: string;
  privateKeyFile: string;
}