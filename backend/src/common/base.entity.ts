import { ApiProperty } from "@nestjs/swagger";
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty()
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ApiProperty()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ApiProperty()
    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;
}