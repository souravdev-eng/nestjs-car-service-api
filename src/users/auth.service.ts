import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(email: string, password: string) {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('email already in use');
    }

    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex'); // return as a buffer(buffer hold some raw data) almost like an array

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer; // 32 is the length of the hash

    // Join the hashed result and salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.userService.create(email, result);
    // return the user
    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new BadRequestException('invalid credential');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('invalid credential');
    }

    return user;
  }
}
