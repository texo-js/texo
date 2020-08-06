import Koa from 'koa';
import JwksRsa from 'jwks-rsa'
import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import { Loggers, Logger } from '@texo/logging';

import { AuthorizationAdaptor } from './authorization-adaptor';
import { GatewayUser } from '../../gateway-user';
import { promisify } from 'util';
import { AuthorizationError } from './authorization-error';

export interface TokenAuthorizationAdaptorOptions {
  authCookieName: string,
  accessTokenJwksUrl: string,
  issuer: string,
  audience: string
}

const verify = promisify(jwt.verify);

export class TokenAuthorizationAdaptor implements AuthorizationAdaptor {
  #cookieName: string;
  #getKey: jwt.GetPublicKeyOrSecret;
  #logger: Logger;

  constructor(options: TokenAuthorizationAdaptorOptions) {
    this.#logger = Loggers.namespace('texo/authorization');

    const { authCookieName, accessTokenJwksUrl } = options;
    const jwksClient = JwksRsa({ jwksUri: accessTokenJwksUrl });

    this.#cookieName = authCookieName;
   
    this.#getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
      jwksClient.getSigningKey(header.kid!, (err, key) => {
        callback(err, err ? undefined : key.getPublicKey());
      });
    }
  }

  async authorize(ctx: Koa.Context): Promise<GatewayUser> {
    const token = getBearerToken(ctx) || getCookieToken(ctx, this.#cookieName);
    if (!token) {
      this.#logger.warn(`No token was present in the 'authorisation' header or the '${this.#cookieName}' cookie.`)
      throw new AuthorizationError(`No token was present in the 'authorisation' header or the '${this.#cookieName}' cookie.`);
    }

    let verifiedToken;
    try {
      verifiedToken = await verify(token, this.#getKey);
    } catch (e) {
      throw new AuthorizationError(e);
    }

    return { username: 'fred', roles: [] };
  }
}

function getBearerToken(ctx: Koa.Context): string | undefined {
  const value = ctx.req.headers.authorization;
  if (value) {
    const fields = value.split(' ');
    if (fields.length !== 2 || fields[0] !== 'Bearer') {
      throw new AuthorizationError(`Invalid authorisation header '${value}'.`);
    }

    return fields[1];
  }

  return undefined;
}

function getCookieToken(ctx: Koa.Context, cookieName: string): string | undefined {
  return ctx.cookies.get(cookieName);
}
