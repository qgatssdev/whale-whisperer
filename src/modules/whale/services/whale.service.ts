import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Whale } from '../entity/whale.entity';
import { WhaleRepository } from '../repository/whale.repository';

@Injectable()
export class WhaleService {
  constructor(
    @InjectRepository(Whale)
    private readonly whaleRepository: WhaleRepository,
  ) {}

  async isKnownWhale(address: string): Promise<boolean> {
    return !!(await this.whaleRepository.findOne({
      where: { walletAddress: address },
    }));
  }

  async addWhale(
    address: string,
    source: Whale['detectionSource'],
    confidence?: number,
  ): Promise<Whale> {
    const whale = await this.whaleRepository.create({
      walletAddress: address,
      detectionSource: source,
      confidence,
      isActive: true,
    });

    return this.whaleRepository.save(whale);
  }

  async updateWalletData(address: string, update: Partial<Whale>) {
    await this.whaleRepository.findOneAndUpdate(
      { walletAddress: address },
      update,
    );
  }

  async getActiveWhales(): Promise<Whale[]> {
    return this.whaleRepository.findAll({
      where: { isActive: true },
      order: { balance: 'DESC' },
    });
  }
}
