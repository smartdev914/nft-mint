import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity } from "typeorm";
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from "@/common/base.entity";

@Entity('user')
export class UserEntity extends BaseEntity {
    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    email: string

    @ApiProperty()
    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column({ nullable: true, select: true })
    @ApiProperty()
    @Exclude()
    refreshToken: string;

    comparePassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }
}