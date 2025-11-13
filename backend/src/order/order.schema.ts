import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order_item.schema';
import { User } from 'src/user/user.schema';

export enum OrderStatus {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Fulfilled = 'FULFILLED',
  Cancelled = 'CANCELLED',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'customer_name',
  })
  customerName: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
    name: 'status',
  })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
