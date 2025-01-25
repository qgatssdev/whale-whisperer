import { Module } from '@nestjs/common';
import { DeepSeekService } from './services/deepseek.service';

@Module({
  imports: [],
  providers: [DeepSeekService],
  exports: [DeepSeekService],
})
export class DeepseekModule {}
