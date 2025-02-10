import {
  Body,
  Controller,
  UseGuards,
  Patch,
  Post,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUsernameDto } from '../dto/update-username.dto';
import { CurrentUser } from 'src/libs/common/decorators/current-user.decorator';
import { User } from '../entity/user.entity';
import { AuthGuard } from 'src/libs/common/guards/auth.guard';
import { PaginatedQuery } from 'src/libs/common/types/global-types';
import { YadsaleService } from 'src/modules/yadsale/services/yadsale.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly yadsaleService: YadsaleService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('')
  async getAuthenticatedUser(@CurrentUser() user: User) {
    return await this.userService.getAuthenticatedUser(user);
  }

  @UseGuards(AuthGuard)
  @Get('offers')
  async getYadsaleOffers(
    @Query() data: PaginatedQuery,
    @CurrentUser() user: User,
  ) {
    return await this.userService.getUserOffers(data, user);
  }

  @Get('username/:username')
  async checkUsernameAvailability(@Param('username') username: string) {
    return await this.userService.checkUsernameAvailability(username);
  }

  @UseGuards(AuthGuard)
  @Patch('username')
  async updateUsername(
    @Body() { username }: UpdateUsernameDto,
    @CurrentUser() user: User,
  ) {
    return await this.userService.updateUsername(username, user);
  }
}
