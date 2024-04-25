import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';

import { loadKeypairFromFile } from '../../utils/helpers';

import { createCollection, mintCompressedNFT } from '../../utils/compression';

import { ReadApiError, WrapperConnection } from '../../ReadApi/WrapperConnection';
import { CreateMetadataAccountArgsV3 } from '@metaplex-foundation/mpl-token-metadata';
import { NftEntity } from './entities/nft.entity';
import { CreateNFTDto } from './dto/nft.dto';
import {
  MetadataArgs,
  TokenProgramVersion,
  TokenStandard,
} from '@metaplex-foundation/mpl-bubblegum';
import { IncorrectException } from '@exceptions/incorrect.exception';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(NftEntity)
    private nftRepository: Repository<NftEntity>,
  ) {}

  async createNft(createNftDto: CreateNFTDto): Promise<NftEntity> {
    const payer = loadKeypairFromFile(process.env?.LOCAL_PAYER_JSON_ABSPATH);

    const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl('devnet');

    const connection = new WrapperConnection(CLUSTER_URL, 'confirmed');

    const compressedNFTMetadata: MetadataArgs = {
      name: createNftDto.name,
      symbol: createNftDto.symbol,
      // specific json metadata for each NFT
      uri: createNftDto.uri,
      creators: [
        {
          address: new PublicKey(createNftDto.owner),
          verified: false,
          share: 100,
        },
      ], // or set to null
      editionNonce: 0,
      uses: null,
      collection: null,
      primarySaleHappened: false,
      sellerFeeBasisPoints: 0,
      isMutable: false,
      // these values are taken from the Bubblegum package
      tokenProgramVersion: TokenProgramVersion.Original,
      tokenStandard: TokenStandard.NonFungible,
    };

    await mintCompressedNFT(
      connection,
      payer,
      new PublicKey(createNftDto.treeKeypair),
      new PublicKey(createNftDto.collectionMint),
      new PublicKey(createNftDto.metadataAccount),
      new PublicKey(createNftDto.masterEditionAccount),
      compressedNFTMetadata,
      // mint to this specific wallet (in this case, airdrop to `testWallet`)
      new PublicKey(createNftDto.owner),
    ).then((tx) => {
      console.log(tx);
    }).catch(() => {
      throw new ReadApiError('Failed to mint NFT');
    });

    try {
      const nftStored = await this.nftRepository.save({
        name: createNftDto.name,
        symbol: createNftDto.symbol,
        uri: createNftDto.uri,
        collectionId: 1,
        treeId: 1,
        owner: createNftDto.owner,
      });

      return nftStored;
    } catch (error) {
      throw new ReadApiError('Failed to mint NFT');
    }
  }

  async getNftsByOwner(addressOwner: string): Promise<any> {
    const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl('devnet');

    const connection = new WrapperConnection(CLUSTER_URL);

    const response: any = await connection
      .getAssetsByOwner({
        ownerAddress: addressOwner,
      })
      .then((res) => {
        return res;
      });

    return response;
  }
}
