import { Body, Controller, Get, Param, Post  } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMerkleTreeDto } from './dto/merkle-tree.dto';
import { MerkleTreeService } from './merkle-tree.service';

@Controller('merkel-tree')
@ApiTags('merkel-tree')
export class MerkleTreeController {
  constructor(private readonly merkleTreeService: MerkleTreeService) {}

  @Post()
  createMerkleTree(@Body() createMerkleTreeDto: CreateMerkleTreeDto) {
    return this.merkleTreeService.createMerkleTree(createMerkleTreeDto);
  }

  @Get(':addressOwner')
  async getMerkleTreeByOwner(@Param() params: { addressOwner: string }) {
    return this.merkleTreeService.getMerkleTreesByOwner(params.addressOwner);
  }
}
