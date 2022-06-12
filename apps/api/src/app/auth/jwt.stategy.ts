import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getUserDetails } from '../core/utils/payload.util';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AZB2C_URL}${process.env.AZB2C_TENANT_NAME}/${process.env.AZB2C_SIGNIN_POLICY}/discovery/v2.0/keys`
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: `${process.env.AZB2C_APP_CLIENT_ID}`,
      issuer: `${process.env.AZB2C_URL}${process.env.AZB2C_ISSUER_ID}/v2.0/`,
      algorithms: ['RS256']
    });
  }

  validate(payload: any): any {
    const { userId, org } = getUserDetails(payload);
    if (userId == null && org == null) {
      throw new UnauthorizedException('Token not valid');
    }
    return payload;
  }
}
