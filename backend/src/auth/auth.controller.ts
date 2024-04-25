import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/user.decorator';
import { UserEntity } from '@/user/entities/user.entity';
import { RefreshTokenGuard } from '@guards/refresh-token.guard';
import { Role } from '@enums/role';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        return await this.authService.signUp(createUserDto);
    }

    @Post('signin')
    async signin(@Body() data: AuthDto) {
        return this.authService.signIn(data);
    }
    
    @Auth()
    @Get('logout')
    async logout(@User() user: UserEntity) {
        await this.authService.logout(user.id);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refreshToken')
    refreshToken(@User() user: UserEntity) {
        const refreshToken = user.refreshToken;
        return this.authService.refreshTokens(user.id, refreshToken);
    }
}
