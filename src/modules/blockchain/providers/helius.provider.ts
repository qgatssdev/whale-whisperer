import { Provider } from '@nestjs/common';
import { Helius } from 'helius-sdk';
import { Config } from 'src/config';

export const HELIUS_PROVIDER = 'HELIUS_CONNECTION';

export const HeliusProvider: Provider = {
  provide: HELIUS_PROVIDER,
  useFactory: () => new Helius(Config.HELIUS_API_KEY),
};
