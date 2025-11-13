import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from 'src/utils/constants';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    name: 'email',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'password',
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.WarehouseStaff,
    name: 'role',
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
