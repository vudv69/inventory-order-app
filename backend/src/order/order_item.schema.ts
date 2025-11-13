import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.schema';
import { Product } from 'src/product/product.schema';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({
    type: 'int',
    name: 'quantity',
    default: 1,
  })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'price',
  })
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'subtotal',
    generatedType: 'STORED',
    asExpression: '"price" * "quantity"',
  })
  subtotal: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}