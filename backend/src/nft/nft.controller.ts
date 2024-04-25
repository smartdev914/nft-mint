import { Body, Controller, Get, Param, Post, Req  } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateNFTDto } from './dto/nft.dto';
import { NftService } from './nft.service';

@Controller('nft')
@ApiTags('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post()
  createNft(@Body() createNftDto: CreateNFTDto) {
    return this.nftService.createNft(createNftDto);
  }

  @Get(':addressOwner')
  async getNftByOwner(@Param() params: { addressOwner: string }) {
    return this.nftService.getNftsByOwner(params.addressOwner);
  }
}
