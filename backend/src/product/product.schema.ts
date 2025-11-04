import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ProductStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: ProductStatus.Active,
  })
  status: ProductStatus;

  @Column({ type: 'integer', default: 0, name: 'inventory_count' })
  inventoryCount: number;
}
