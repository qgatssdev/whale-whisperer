import { Module } from '@nestjs/common';
import { WhaleDetectorService } from './services/whale-detector.service';
import { WhaleService } from '../whale/services/whale.service';
import { BirdeyeService } from './services/birdeye.service';
import { AIMonitorAgentService } from '../ai-models/services/ai-monitor-model.service';

@Module({
  imports: [AIMonitorAgentService],
  providers: [WhaleDetectorService, WhaleService],
  exports: [WhaleDetectorService, BirdeyeService],
})
export class WhaleDetectorModule {}
