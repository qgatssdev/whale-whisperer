import { Module } from '@nestjs/common';
import { WhaleDetectorService } from './services/whale-detector.service';
import { WhaleService } from '../whale/services/whale.service';

@Module({
  imports: [],
  providers: [WhaleDetectorService, WhaleService],
  exports: [WhaleDetectorService],
})
export class WhaleDetectorModule {}
