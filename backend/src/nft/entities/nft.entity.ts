import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@/common/base.entity";
import { MerkleTreeEntity } from "@/merkle-tree/entities/merkle-tree.entity";
import { CollectionEntity } from "@/collection/entities/collection.entity";

@Entity('nft')
export class NftEntity extends BaseEntity {
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
  symbol: string;

  @ApiProperty()
  @Column()
  owner: string;

  @OneToOne(() => CollectionEntity)
  @ApiProperty()
  @Column()
  collectionId: number;

  @OneToOne(() => MerkleTreeEntity)
  @ApiProperty()
  @Column()
  treeId: number;
}