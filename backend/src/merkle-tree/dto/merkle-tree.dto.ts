import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class MerkleTreeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    owner: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    network: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    numberOfNodes: number;
}

export class CreateMerkleTreeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    owner: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    maxDepth: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    maxBufferSize: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    network: 'devnet' | 'mainnet';
}