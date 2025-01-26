import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { BaseRepository } from 'src/libs/core/base/base.repository';
import { Whale } from '../entity/whale.entity';

export class WhaleRepository extends BaseRepository<Whale> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(entityManager.getRepository(Whale));
  }
}
