import { Logger } from '@nestjs/common';
import { IsBoolean, IsInt, IsString, validateSync } from 'class-validator';

import { config } from 'dotenv';
config();

class Configuration {
  private readonly logger = new Logger(Configuration.name);

  @IsString()
  readonly DATABASE_HOST = process.env.DATABASE_HOST as string;

  @IsInt()
  readonly DATABASE_PORT = Number(process.env.DATABASE_PORT);

  @IsString()
  readonly DATABASE_NAME = process.env.DATABASE_NAME as string;

  @IsString()
  readonly DATABASE_USER = process.env.DATABASE_USER as string;

  @IsString()
  readonly DATABASE_PASSWORD = process.env.DATABASE_PASSWORD as string;

  @IsString()
  readonly DATABASE_SSL_CA_CERT = process.env.DATABASE_SSL_CA_CERT as string;

  @IsBoolean()
  readonly DATABASE_SYNC = process.env.DATABASE_SYNC === 'true';

  @IsInt()
  readonly PORT = Number(process.env.PORT);

  @IsString()
  readonly JWT_SECRET = process.env.JWT_SECRET as string;

  @IsString()
  readonly HELIUS_API_KEY = process.env.HELIUS_API_KEY as string;

  @IsString()
  readonly DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY as string;

  @IsString()
  readonly DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL as string;

  constructor() {
    const error = validateSync(this);

    if (!error.length) return;
    this.logger.error(`Config validation error: ${JSON.stringify(error[0])}`);
    process.exit(1);
  }
}

export const Config = new Configuration();
