export interface ServerMetadata {
  applicationName: string;
  applicationVersion: string;
  serverType: string;
  texoVersion: string;
  attributes: { name: string, value: string }[]
}
