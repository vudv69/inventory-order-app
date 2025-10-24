import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }
}
