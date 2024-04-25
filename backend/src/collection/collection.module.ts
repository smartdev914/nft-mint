import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { CollectionEntity } from './entities/collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionEntity])],
  providers: [CollectionService],
  controllers: [CollectionController],
  exports: [CollectionService]
})
export class CollectionModule {}
