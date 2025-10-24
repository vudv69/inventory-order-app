import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedProductList1761298947374 implements MigrationInterface {
  name = 'SeedProductList1761298947374';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO products ("name", "sku", "price", "status", "inventory_count")
      VALUES
      ('iPhone 15 Pro', 'SKU-IPHONE15PRO', 1200, 'active', 50),
      ('MacBook Air M3', 'SKU-MACBOOKAIRM3', 1600, 'active', 20),
      ('Apple Watch Ultra 2', 'SKU-WATCHULTRA2', 899, 'inactive', 0),
      ('iPad Pro 13', 'SKU-IPADPRO13', 1300, 'active', 10),
      ('AirPods Pro 2', 'SKU-AIRPODSPRO2', 249, 'active', 100);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM products
      WHERE "sku" IN (
        'SKU-IPHONE15PRO',
        'SKU-MACBOOKAIRM3',
        'SKU-WATCHULTRA2',
        'SKU-IPADPRO13',
        'SKU-AIRPODSPRO2'
      );
    `);
  }
}
