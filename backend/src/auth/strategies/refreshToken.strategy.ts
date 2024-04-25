import { UserService } from "@/user/user.service";
import { JWT_REFRESH_SECRET } from "@environments";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_REFRESH_SECRET,
            passReqToCallback: true,
        })
    }

    async validate(req: Request, payload: any) {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        const user = await this.userService.findById(+payload.sub);
        return {...user, refreshToken}
    }
}