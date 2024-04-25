import { BaseService, Pagination } from '@/common/base.service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { MessageName } from '@/message';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService extends BaseService<
    UserEntity,
    CreateUserDto,
    UpdateUserDto
> {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {
        super(MessageName.USER, userRepository);
    }

    async findAll(filterDto: FilterUserDto): Promise<Pagination<UserEntity>> {
        const [data, total] = await this.userRepository.findAndCount({
            take: filterDto.limit,
            skip: filterDto.skip,
            order: filterDto.order,
        });

        return {
            data, 
            total
        }
    }

    async findByEmail(email: string, options?: FindOneOptions<UserEntity>): Promise<UserEntity> {
        return this.userRepository.findOne({where: { email }, ...options });
    }

    async findOneBy(options?: FindOneOptions<UserEntity>): Promise<UserEntity> {
        return this.userRepository.findOne(options);
    }
}
