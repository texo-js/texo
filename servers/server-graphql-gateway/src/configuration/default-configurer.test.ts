import { configure } from './default-configurer';
describe('@texo/server-graphql-gateway', () => {
  describe('configuration', () => {
    const validEnv = {
      TEXO_ACCESS_TOKEN_JWKS_URL: 'https://something/',
      TEXO_GATEWAY_TOKEN_PUBLIC_KEYS: './public-keys.jwks',
      TEXO_GATEWAY_TOKEN_PRIVATE_KEY: './private-key.jwks'
    };

    const validCommandline = [
      '--access-token-jwks-url', 'https://something/',
      '--gateway-token-public-keys', './public-keys.jwks',
      '--gateway-token-private-key', './private-key.jwks'
    ];

    it('builds configuration from environment variables', async () => {
      const env = withEnvironment(validEnv);
      const config = await configure();
      env.reset();

      expect (config).toEqual({
        accessTokenJwksUrl: 'https://something/',
        gatewayTokenKeys: {
          publicKeysFile: './public-keys.jwks',
          privateKeyFile: './private-key.jwks'
        }
      });
    });

    it('builds configuration from commandline parameters', async () => {
      const env = withCommandline(validCommandline);
      const config = await configure();
      env.reset();

      expect (config).toEqual({
        accessTokenJwksUrl: 'https://something/',
        gatewayTokenKeys: {
          publicKeysFile: './public-keys.jwks',
          privateKeyFile: './private-key.jwks'
        }
      });
    });
  });
});

function withEnvironment(environment: Record<string, string>): { reset: () => void } {
  const orignal = process.env;

  process.env = { ...orignal, ...environment };

  return { reset: () => { process.env = orignal } };
}

function withCommandline(args: string[]): { reset: () => void } {
  const orignal = process.argv;

  process.argv = [ ...orignal.slice(0, 2), ...args ];

  return { reset: () => { process.argv = orignal } };
}