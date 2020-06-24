export interface ServerMetadata extends Record<string, string | undefined> {
  applicationName: string;
  applicationVersion: string;
  serverType?: string;
  texoVersion?: string;
}
