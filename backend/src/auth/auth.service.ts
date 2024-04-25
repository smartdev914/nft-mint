import { MessageName } from '@/message';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UserService } from '@/user/user.service';
import { JWT_TYPE } from '@enums/jwt.type';
import { ExistsException } from '@exceptions/exists.exception';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { NotfoundException } from '@exceptions/not-found.exception';
import { IncorrectException } from '@exceptions/incorrect.exception';
import { AccessDeniedException, } from '@exceptions/access-deined.exception';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async signUp(createUserDto: CreateUserDto) {
        const userExist = await this.userService.findByEmail(createUserDto.email);

        if(userExist) {
            throw new ExistsException(MessageName.USER);
        }

        const hash = this.hashData(createUserDto.password);

        const newUser = await this.userService.create({
            ...createUserDto,
            password: hash,
        });
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);

        return {
            ...tokens,
            user: newUser
        }
    }

    async signIn(data: AuthDto) {
        const user = await this.userService.findByEmail(data.email);

        if(!user) {
            throw new NotfoundException(MessageName.USER);
        }

        const passwordMatches = user.comparePassword(data.password);
        if(!passwordMatches) {
            throw new IncorrectException(MessageName.USER);
        }

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            ...tokens,
            user
        }
    }

    async logout(userId: number) {
        this.userService.update(userId, { refreshToken: null });
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.userService.findById(userId);

        if(!user || !user.refreshToken) {
            throw new AccessDeniedException();
        }

        const refreshTokenMatches = bcrypt.compareSync(refreshToken, user.refreshToken);

        if(!refreshTokenMatches) {
            throw new AccessDeniedException();
        }

        const tokens = await this.getTokens(user.id, user.email);

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    hashData(data: string) {
        return bcrypt.hashSync(data, 10);
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashRefreshToken = this.hashData(refreshToken);
        await this.userService.update(userId, {
            refreshToken: hashRefreshToken
        })
    }

    async getTokens(userId: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                }, 
                {
                    secret: this.configService.get<string>(JWT_TYPE.JWT_ACCESS_SECRET),
                    expiresIn: '15m'
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                }, 
                {
                    secret: this.configService.get<string>(JWT_TYPE.JWT_REFRESH_SECRET),
                    expiresIn: '7d'
                }
            ),
        ]);

        return {
            accessToken,
            refreshToken
        }
    }    
}
