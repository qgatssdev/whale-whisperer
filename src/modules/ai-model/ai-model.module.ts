import { Module } from '@nestjs/common';
import { AIModelService } from './services/ai-model.service';

@Module({
  imports: [],
  providers: [AIModelService],
  exports: [AIModelService],
})
export class AIModelModule {}
