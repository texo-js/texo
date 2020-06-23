export interface IServerConfig {
  accessTokenKeys: IKeyLocation;
  refreshTokenKeys: IKeyLocation;
}

export interface IKeyLocation {
  publicKeysFile: string;
  privateKeyFile: string;
}