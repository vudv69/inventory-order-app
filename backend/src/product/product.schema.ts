import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'name',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    name: 'sku',
  })
  sku: string;

  @Column({
    type: 'text',
    name: 'description',
  })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'price',
  })
  price: number;

  @Column({
    type: 'boolean',
    default: 0,
    name: 'is_active',
  })
  isActive: boolean;

  @Column({
    type: 'integer',
    default: 0,
    name: 'inventory_count',
  })
  inventoryCount: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
