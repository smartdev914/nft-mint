import { BaseFilterDto } from "@/common/base-filter.dto";
import { OrderType } from "@enums/order";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { UserEntity } from "../entities/user.entity";
import { Expose } from 'class-transformer';

class OrderDto {
    @ApiPropertyOptional({ enum: OrderType, name: 'order[name]' })
    @IsEnum(OrderType)
    name?: OrderType;

    @ApiPropertyOptional({ enum: OrderType, name: 'order[created]' })
    @IsEnum(OrderType)
    createdAt?: OrderType;

    @ApiPropertyOptional({ enum: OrderType, name: 'order[updatedAt]' })
    @IsEnum(OrderType)
    updatedAt?: OrderType;
}

export class FilterUserDto extends BaseFilterDto<UserEntity> {
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    order?: OrderDto;
}