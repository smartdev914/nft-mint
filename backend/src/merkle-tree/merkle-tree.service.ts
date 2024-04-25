import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerkleTreeEntity } from './entities/merkle-tree.entity';
import { CreateMerkleTreeDto } from './dto/merkle-tree.dto';
import { Keypair, clusterApiUrl } from '@solana/web3.js';
import {
  ValidDepthSizePair,
} from '@solana/spl-account-compression';

import { loadKeypairFromFile } from '../../utils/helpers';

import { createTree } from '../../utils/compression';

import { WrapperConnection } from '../../ReadApi/WrapperConnection';

@Injectable()
export class MerkleTreeService {
  constructor(
    @InjectRepository(MerkleTreeEntity)
    private merkleTreeRepository: Repository<MerkleTreeEntity>,
  ) {}

  async createMerkleTree(
    createMerkleTreeDto: CreateMerkleTreeDto,
  ): Promise<MerkleTreeEntity> {
    const payer = loadKeypairFromFile(process.env?.LOCAL_PAYER_JSON_ABSPATH);

    const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl('devnet');

    const connection = new WrapperConnection(CLUSTER_URL, 'confirmed');

    const treeKeypair = Keypair.generate();

    const maxDepthSizePair: ValidDepthSizePair = {
      // max=8 nodes
      // maxDepth: 3,
      // maxBufferSize: 8,

      // max=16,384 nodes
      maxDepth: 14,
      maxBufferSize: 64,

      // max=131,072 nodes
      // maxDepth: 17,
      // maxBufferSize: 64,

      // max=1,048,576 nodes
      // maxDepth: 20,
      // maxBufferSize: 256,

      // max=1,073,741,824 nodes
      // maxDepth: 30,
      // maxBufferSize: 2048,
    };
    const canopyDepth = maxDepthSizePair.maxDepth - 5;

    const tree = await createTree(
      connection,
      payer,
      treeKeypair,
      maxDepthSizePair,
      canopyDepth,
    );

    try {
      const merkleTree = await this.merkleTreeRepository.save({
        treeAddress: tree.treeAddress.toString(),
        treeAuthority: tree.treeAuthority.toString(),
        treeKeypair: treeKeypair.publicKey.toBase58(),
        network: 'devnet',
        owner: createMerkleTreeDto.owner,
        maxDepth: createMerkleTreeDto.maxDepth,
        maxBufferSize: createMerkleTreeDto.maxBufferSize,
      });

      return merkleTree;
    } catch (error) {
      console.log(error);
    }
  }

  async getMerkleTreesByOwner(
    addressOwner: string,
  ): Promise<MerkleTreeEntity[]> {
    try {
      const merkleTreeStored = await this.merkleTreeRepository.findBy({
        owner: addressOwner,
      });

      return merkleTreeStored;
    } catch (error) {
      console.log(error);
    }
  }
}
