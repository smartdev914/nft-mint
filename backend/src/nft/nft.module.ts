import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftEntity } from './entities/nft.entity';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';

@Module({
  imports: [TypeOrmModule.forFeature([NftEntity])],
  providers: [NftService],
  controllers: [NftController],
  exports: [NftService]
})
export class NftModule {}
