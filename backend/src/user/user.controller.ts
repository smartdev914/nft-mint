import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from '@decorators/auth.decorator';

@Controller('user')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Auth()
    @Get(':id')
    findById(@Param('id') id: number) {
        return this.userService.findById(id);
    }

    @Auth()
    @Patch(":id")
    update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update;
    }
}
