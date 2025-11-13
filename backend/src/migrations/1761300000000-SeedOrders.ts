import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOrders1761300000000 implements MigrationInterface {
  name = 'SeedOrders1761300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE
        o1 uuid := uuid_generate_v4();
        o2 uuid := uuid_generate_v4();
        o3 uuid := uuid_generate_v4();
        mgr uuid;
      BEGIN
        SELECT id INTO mgr FROM users WHERE username = 'manager' LIMIT 1;
        IF mgr IS NULL THEN
          -- If manager doesn't exist, insert it
          INSERT INTO users(id, username, role) VALUES (uuid_generate_v4(), 'manager', 'MANAGER') ON CONFLICT (username) DO NOTHING;
          SELECT id INTO mgr FROM users WHERE username = 'manager' LIMIT 1;
        END IF;

        -- Insert three orders
        INSERT INTO orders(id, customer_name, status, created_by, updated_by)
        VALUES
          (o1, 'Customer A', 'PENDING', mgr, mgr),
          (o2, 'Customer B', 'PENDING', mgr, mgr),
          (o3, 'Customer C', 'PENDING', mgr, mgr);

        -- Order 1 items
        INSERT INTO order_items(id, order_id, product_id, quantity, price)
        VALUES
          (uuid_generate_v4(), o1, (SELECT id FROM products WHERE sku = 'SKU-IPHONE15PRO' LIMIT 1), 1, (SELECT price FROM products WHERE sku = 'SKU-IPHONE15PRO' LIMIT 1)),
          (uuid_generate_v4(), o1, (SELECT id FROM products WHERE sku = 'SKU-MACBOOKAIRM3' LIMIT 1), 1, (SELECT price FROM products WHERE sku = 'SKU-MACBOOKAIRM3' LIMIT 1)),
          (uuid_generate_v4(), o1, (SELECT id FROM products WHERE sku = 'SKU-AIRPODSPRO2' LIMIT 1), 2, (SELECT price FROM products WHERE sku = 'SKU-AIRPODSPRO2' LIMIT 1));

        -- Order 2 items
        INSERT INTO order_items(id, order_id, product_id, quantity, price)
        VALUES
          (uuid_generate_v4(), o2, (SELECT id FROM products WHERE sku = 'SKU-IPADPRO13' LIMIT 1), 1, (SELECT price FROM products WHERE sku = 'SKU-IPADPRO13' LIMIT 1)),
          (uuid_generate_v4(), o2, (SELECT id FROM products WHERE sku = 'SKU-IPHONE15PRO' LIMIT 1), 1, (SELECT price FROM products WHERE sku = 'SKU-IPHONE15PRO' LIMIT 1)),
          (uuid_generate_v4(), o2, (SELECT id FROM products WHERE sku = 'SKU-MACBOOKAIRM3' LIMIT 1), 1, (SELECT price FROM products WHERE sku = 'SKU-MACBOOKAIRM3' LIMIT 1));

        -- Order 3 items
        INSERT INTO order_items(id, order_id, product_id, quantity, price)
        VALUES
          (uuid_generate_v4(), o3, (SELECT id FROM products WHERE sku = 'SKU-AIRPODSPRO2' LIMIT 1), 3, (SELECT price FROM products WHERE sku = 'SKU-AIRPODSPRO2' LIMIT 1)),
          (uuid_generate_v4(), o3, (SELECT id FROM products WHERE sku = 'SKU-IPADPRO13' LIMIT 1), 1, (SELECT price FROM products WHERE sku = 'SKU-IPADPRO13' LIMIT 1)),
          (uuid_generate_v4(), o3, (SELECT id FROM products WHERE sku = 'SKU-WATCHULTRA2' LIMIT 1), 1, (SELECT price FROM products WHERE sku = 'SKU-WATCHULTRA2' LIMIT 1));

        -- Decrease inventory counts according to inserted items
        UPDATE products SET inventory_count = inventory_count - sub.qty
        FROM (
          SELECT product_id, SUM(quantity) AS qty FROM order_items WHERE order_id IN (o1, o2, o3) GROUP BY product_id
        ) AS sub
        WHERE products.id = sub.product_id;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE
        r RECORD;
      BEGIN
        -- Restore inventory by adding back quantities from these orders
        FOR r IN SELECT product_id, SUM(quantity) AS qty FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.customer_name IN ('Customer A','Customer B','Customer C') GROUP BY product_id LOOP
          UPDATE products SET inventory_count = inventory_count + r.qty WHERE id = r.product_id;
        END LOOP;

        -- Delete the order items and orders
        DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE customer_name IN ('Customer A','Customer B','Customer C'));
        DELETE FROM orders WHERE customer_name IN ('Customer A','Customer B','Customer C');
      END $$;
    `);
  }
}
