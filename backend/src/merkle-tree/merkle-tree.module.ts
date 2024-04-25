import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerkleTreeEntity } from './entities/merkle-tree.entity';
import { MerkleTreeController } from './merkle-tree.controller';
import { MerkleTreeService } from './merkle-tree.service';

@Module({
  imports: [TypeOrmModule.forFeature([MerkleTreeEntity])],
  providers: [MerkleTreeService],
  controllers: [MerkleTreeController],
  exports: [MerkleTreeService]
})
export class MerkleTreeModule {}
