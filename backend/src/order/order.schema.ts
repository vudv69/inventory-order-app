import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './order_item.schema';
import { User } from 'src/user/user.schema';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}
