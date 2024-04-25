import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@/common/base.entity";

@Entity('collection')
export class CollectionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  uri: string;

  @ApiProperty()
  @Column()
  owner: string;

  @ApiProperty()
  @Column()
  sellerFeeBasisPoints: number;

  @ApiProperty()
  @Column()
  addressCreator: string;

  @ApiProperty()
  @Column()
  collectionMint: string;

  @ApiProperty()
  @Column()
  metadataAccount: string;

  @ApiProperty()
  @Column()
  masterEditionAccount: string;
}