import { Module } from '@nestjs/common';
import { AIMonitorAgentService } from './services/ai-monitor-model.service';
import { BirdeyeService } from '../whale-detector/services/birdeye.service';

@Module({
  imports: [BirdeyeService],
  providers: [AIMonitorAgentService],
  exports: [AIMonitorAgentService],
})
export class AIModelModule {}
