import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionDto } from './dto/collection.dto';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';

import { loadKeypairFromFile } from '../../utils/helpers';

import { createCollection } from '../../utils/compression';

import { WrapperConnection } from '../../ReadApi/WrapperConnection';
import { CollectionEntity } from './entities/collection.entity';
import { CreateMetadataAccountArgsV3 } from '@metaplex-foundation/mpl-token-metadata';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private collectionRepository: Repository<CollectionEntity>,
  ) {}

  async createCollection(
    createCollectionDto: CreateCollectionDto,
  ): Promise<CollectionEntity> {
    const payer = loadKeypairFromFile(process.env?.LOCAL_PAYER_JSON_ABSPATH);

    const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl('devnet');

    const connection = new WrapperConnection(CLUSTER_URL, 'confirmed');

    const collectionMetadataV3: CreateMetadataAccountArgsV3 = {
      data: {
        name: createCollectionDto.name,
        symbol: createCollectionDto.symbol,
        // specific json metadata for the collection
        uri: createCollectionDto.uri,
        sellerFeeBasisPoints: createCollectionDto.sellerFeeBasisPoints,
        creators: [
          {
            address: new PublicKey(createCollectionDto.addressCreator),
            verified: false,
            share: 100,
          },
        ], // or set to `null`
        collection: null,
        uses: null,
      },
      isMutable: false,
      collectionDetails: null,
    };

    const collection = await createCollection(
      connection,
      payer,
      collectionMetadataV3,
    );

    try {
      const collectionStored = await this.collectionRepository.save({
        name: createCollectionDto.name,
        uri: createCollectionDto.uri,
        sellerFeeBasisPoints: createCollectionDto.sellerFeeBasisPoints,
        addressCreator: createCollectionDto.addressCreator,
        collectionMint: collection.mint.toBase58(),
        metadataAccount: collection.metadataAccount.toBase58(),
        masterEditionAccount: collection.masterEditionAccount.toBase58(),
        owner: createCollectionDto.addressCreator,
      });

      return collectionStored;
    } catch (error) {
      console.log(error);
    }
  }

  async getCollectionsByOwner(
    addressOwnwer: string,
  ): Promise<CollectionEntity[]> {
    try {
      const collectionStored = await this.collectionRepository.findBy({
        owner: addressOwnwer,
      });

      return collectionStored;
    } catch (error) {
      console.log(error);
    }
  }
}
