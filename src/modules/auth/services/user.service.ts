import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { handleErrorCatch } from 'src/libs/common/helpers/utils';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
  private logger: Logger;
  constructor() {
    this.logger = new Logger();
  }

  @Inject()
  private readonly userRepository: UserRepository;

  async getAuthenticatedUser(user: User) {
    try {
      return this.userRepository.findOne({
        where: { id: user.id },
        select: ['id', 'email', 'isActive', 'emailVerified', 'lastLoginAt'],
      });
    } catch (error) {
      handleErrorCatch(error);
    }
  }
}
