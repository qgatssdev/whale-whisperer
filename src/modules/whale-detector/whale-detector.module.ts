import { Module } from '@nestjs/common';
import { WhaleDetectorService } from './services/whale-detector.service';

@Module({
  imports: [],
  providers: [WhaleDetectorService],
  exports: [WhaleDetectorService],
})
export class WhaleDetectorModule {}
