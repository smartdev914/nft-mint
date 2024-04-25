import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@/common/base.entity";

@Entity('merkle_tree')
export class MerkleTreeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  treeAddress: string;

  @ApiProperty()
  @Column()
  treeAuthority: string;

  @ApiProperty()
  @Column()
  maxDepth: number;

  @ApiProperty()
  @Column()
  maxBufferSize: number;

  @ApiProperty()
  @Column()
  treeKeypair: string;

  @ApiProperty()
  @Column()
  owner: string;

  @ApiProperty()
  @Column()
  network: string;
}