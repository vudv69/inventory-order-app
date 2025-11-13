import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1761294560442 implements MigrationInterface {
  name = 'InitSchema1761294560442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" VARCHAR(100) UNIQUE NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "role" VARCHAR(20) NOT NULL DEFAULT 'USER',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "products" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "sku" VARCHAR(100) UNIQUE NOT NULL,
        "price" DECIMAL(10, 2) NOT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        "inventory_count" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "orders" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "customer_name" VARCHAR(255) NOT NULL,
        "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
        "created_by" uuid NULL,
        "updated_by" uuid NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        FOREIGN KEY ("created_by") REFERENCES "users"("id"),
        FOREIGN KEY ("updated_by") REFERENCES "users"("id")
      );

      CREATE TABLE IF NOT EXISTS "order_items" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
        "product_id" uuid NOT NULL REFERENCES "products"("id"),
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "price" DECIMAL(10, 2) NOT NULL,
        "subtotal" DECIMAL(10,2) GENERATED ALWAYS AS ("price" * "quantity") STORED,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      INSERT INTO "users" ("email", "password", "role")
      VALUES
        ('manager@gmail.com', '$2b$10$zKSFBKfOXC.pJiEDlaVvZ.I0ICe2qKSjs1M557TIc8HEfANr55RI6', 'MANAGER'),
        ('warehouse@gmail.com', '$2b$10$zKSFBKfOXC.pJiEDlaVvZ.I0ICe2qKSjs1M557TIc8HEfANr55RI6', 'WAREHOUSE_STAFF'),
        ('user@gmail.com', '$2b$10$zKSFBKfOXC.pJiEDlaVvZ.I0ICe2qKSjs1M557TIc8HEfANr55RI6', 'USER');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
