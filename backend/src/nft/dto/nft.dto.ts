import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateNFTDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  treeKeypair: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collectionMint: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  metadataAccount: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  masterEditionAccount: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uri: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  owner: string;
}