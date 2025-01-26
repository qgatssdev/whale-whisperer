import { Module } from '@nestjs/common';
import { WhaleRepository } from './repository/whale.repository';
import { WhaleService } from './services/whale.service';

@Module({
  providers: [WhaleRepository, WhaleService],
  exports: [WhaleRepository, WhaleService],
})
export class WhaleModule {}
