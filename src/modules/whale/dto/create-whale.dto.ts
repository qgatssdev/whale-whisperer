import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateWhaleDto {
  @IsString()
  @MinLength(3)
  walletAddress: string;

  @IsNumber()
  @IsOptional()
  balance: string;

  @IsNumber()
  @IsNotEmpty()
  transactionCount: number;
}
