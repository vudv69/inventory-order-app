import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.schema';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findByUsername(username);
  }
}
