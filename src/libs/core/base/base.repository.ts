import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  FindOneOptions,
  FindOptionsOrder,
  Between,
} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { NotFoundException } from '@nestjs/common';
import { CREATED_AT_COLUMN } from 'src/libs/common/constants';
import { PaginatedQuery } from 'src/libs/common/types/global-types';

export abstract class BaseRepository<T extends BaseEntity> {
  private entity: Repository<T>;
  protected constructor(entry: Repository<T>) {
    this.entity = entry;
  }

  async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    const entity = await this.entity.findOne(options);

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
    returnEntity = true,
  ) {
    const updateResult = await this.entity.update(where, partialEntity);

    if (!updateResult.affected) {
      console.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    if (returnEntity) {
      const filter = { ...where, ...partialEntity } as
        | FindOptionsWhere<T>
        | FindOptionsWhere<T>[];
      return await this.findOne({ where: filter });
    }

    return this.findOne({ where });
  }

  async findPaginated(
    { page, size, filter, filterBy, order, orderBy, from, to }: PaginatedQuery,
    options?: FindManyOptions<T>,
  ) {
    size = size ? size : 10;
    page = page ? page : 1;
    const offset = (page - 1) * size;

    let where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {
      ...options?.where,
    };

    const orderRelation = {
      [orderBy ? orderBy : CREATED_AT_COLUMN]: order ? order : 'DESC',
    } as FindOptionsOrder<T>;

    if (filter && filterBy) {
      filter = filter === 'true' ? true : filter === 'false' ? false : filter;
      where = {
        ...where,
        [filterBy]: filter,
      };
    }

    if (from && to) {
      where = {
        ...where,
        [CREATED_AT_COLUMN]: Between(new Date(from), new Date(to)),
      } as FindOptionsWhere<T>;
    }

    const res = await this.entity.findAndCount({
      take: size,
      skip: offset,
      where: {
        ...where,
      },
      order: {
        ...orderRelation,
      },
      ...options,
    });

    const [data, total] = res;

    return {
      data,
      pagination: {
        total,
        size: +size,
        page: +page,
      },
    };
  }

  async delete(where: FindOptionsWhere<T>) {
    const res = await this.entity.delete(where);
    return {
      status: !!res.affected,
    };
  }

  createQueryBuilder(alias?: string) {
    return this.entity.createQueryBuilder(alias);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data);
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    return this.entity.create(data);
  }

  public async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.create(data);
  }

  // public async findOneById(id: any): Promise<T> {
  //   const options: FindOptionsWhere<T> = {
  //     id,
  //   };
  //   return await this.entity.findOneBy(options);
  // }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(filterCondition);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async findWithRelations(relation: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relation);
  }

  public async remove(data: T): Promise<T> {
    return await this.entity.remove(data);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }
}
