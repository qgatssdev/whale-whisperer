import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common';
import { WhaleService } from '../services/whale.service';
import { CreateWhaleDto } from '../dto/create-whale.dto';
import { AuthGuard } from 'src/libs/common/guards/auth.guard';

@Controller({
  path: 'yadsale',
  version: '1',
})
@UseGuards(AuthGuard)
export class WhaleController {
  constructor(private readonly whaleService: WhaleService) {}

  @Post('')
  async createYadsale(@Body() createWhaleDto: CreateWhaleDto) {
    return await this.whaleService.addWhale(createWhaleDto);
  }

  @Get('')
  async getUserYadsales() {
    return await this.whaleService.getWhales();
  }
}
