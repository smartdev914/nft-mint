import { UserService } from "@/user/user.service";
import { JWT_ACCESS_SECRET } from "@environments";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';

type JWTPayload = {
    sub: string;
    email: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_ACCESS_SECRET
        });
    }

    validate(payload: JWTPayload) {
        return this.userService.findById(+payload.sub);
    }
}