import { Body, Controller, Get, Param, Post  } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCollectionDto } from './dto/collection.dto';
import { CollectionService } from './collection.service';

@Controller('collection')
@ApiTags('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  async createCollectionTree(@Body() createCollectionTreeDto: CreateCollectionDto) {
    return this.collectionService.createCollection(createCollectionTreeDto);
  }

  @Get(':addressOwner')
  async getCollectionTreeByOwner(@Param() params: { addressOwner: string }) {
    return this.collectionService.getCollectionsByOwner(params.addressOwner);
  }
}
