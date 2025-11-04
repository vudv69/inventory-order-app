import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1761294560442 implements MigrationInterface {
  name = 'InitSchema1761294560442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" VARCHAR(100) UNIQUE NOT NULL,
        "role" VARCHAR(20) NOT NULL DEFAULT 'USER',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "products" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "sku" VARCHAR(100) UNIQUE NOT NULL,
        "price" DECIMAL(10, 2) NOT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        "inventory_count" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "orders" (
        "id" SERIAL PRIMARY KEY,
        "customer_name" VARCHAR(255) NOT NULL,
        "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "order_items" (
        "id" SERIAL PRIMARY KEY,
        "order_id" INTEGER NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
        "product_id" INTEGER NOT NULL REFERENCES "products"("id"),
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "price" DECIMAL(10, 2) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      INSERT INTO "users" ("username", "role")
      VALUES
        ('manager', 'MANAGER'),
        ('user', 'USER');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
