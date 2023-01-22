import {
  Body,
  Get,
  Post,
  Param,
  Query,
  Patch,
  Delete,
  Session,
  UseGuards,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

import { Serialize } from 'src/interceptor/serialize.interceptor';

import { UserDto } from './dtos/user-dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUser } from './decorators/current-user.decorators';

import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  me(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  async signOut(@Session() session: any) {
    return (session.userId = null);
  }

  @Post('/signup')
  async createUser(
    @Body() { email, password }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signUp(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async loginUser(
    @Body() { email, password }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signIn(email, password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  findAllUser(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
