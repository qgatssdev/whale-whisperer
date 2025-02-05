import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Whale } from '../entity/whale.entity';
import { WhaleRepository } from '../repository/whale.repository';
import { AddWhale } from '../interface';

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

  async addWhale(payload: AddWhale): Promise<Whale> {
    const whale = await this.whaleRepository.create({
      walletAddress: payload.address,
      detectionSource: payload.source,
      confidence: payload.confidence,
      tradingStyle: payload.tradingStyle,
      strengths: payload.strengths,
      riskScore: payload.riskScore,
      profitabilityScore: payload.profitabilityScore,
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
