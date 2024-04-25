import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCollectionDto {
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
    @IsNumber()
    @IsNotEmpty()
    sellerFeeBasisPoints: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    addressCreator: string;
}

export class GetCollectionByOwnerDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    owner: string;
}