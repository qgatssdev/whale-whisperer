import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Whale } from '../entity/whale.entity';
import { WhaleRepository } from '../repository/whale.repository';
import { CreateWhaleDto } from '../dto/create-whale.dto';

@Injectable()
export class WhaleService {
  constructor(
    @InjectRepository(Whale)
    private readonly whaleRepository: WhaleRepository,
  ) {}

  async addWhale(payload: CreateWhaleDto): Promise<Whale> {
    const whale = await this.whaleRepository.create({
      walletAddress: payload.walletAddress,
    });

    return this.whaleRepository.save(whale);
  }

  async getWhales(): Promise<Whale[]> {
    const whales = await this.whaleRepository.findAll({});
    return whales;
  }

  async updateWalletData(address: string, update: Partial<Whale>) {
    await this.whaleRepository.findOneAndUpdate(
      { walletAddress: address },
      update,
    );
  }
}
