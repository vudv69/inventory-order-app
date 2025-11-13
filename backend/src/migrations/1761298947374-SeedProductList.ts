import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedProductList1761298947374 implements MigrationInterface {
  name = 'SeedProductList1761298947374';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO products ("name", "sku", "description", "price", "is_active", "inventory_count")
      VALUES
        ('iPhone 15 Pro', 'SKU-IPHONE15PRO', 'Latest Apple iPhone 15 Pro with A17 chip, improved camera, and OLED display.', 1200, true, 50),
        ('MacBook Air M3', 'SKU-MACBOOKAIRM3', 'Lightweight MacBook Air with M3 chip, perfect for everyday tasks and coding.', 1600, true, 20),
        ('Apple Watch Ultra 2', 'SKU-WATCHULTRA2', 'Advanced smartwatch with fitness tracking, GPS, and health monitoring features.', 899, false, 0),
        ('iPad Pro 13', 'SKU-IPADPRO13', 'High-performance tablet with M3 chip, Liquid Retina XDR display, and Apple Pencil support.', 1300, true, 10),
        ('AirPods Pro 2', 'SKU-AIRPODSPRO2', 'Noise-cancelling wireless earbuds with spatial audio and long battery life.', 249, true, 100),
        ('Samsung Galaxy S25', 'SKU-GALAXYS25', 'Latest Samsung flagship smartphone with AMOLED display and high-end camera.', 1100, true, 30),
        ('Dell XPS 15', 'SKU-DELLXPS15', 'Powerful laptop with Intel i9, 32GB RAM, and 1TB SSD for professional use.', 2000, true, 15),
        ('Sony WH-1000XM5', 'SKU-SONYWH1000XM5', 'Industry-leading noise-cancelling headphones with premium sound.', 350, true, 40),
        ('Google Pixel 9', 'SKU-PIXEL9', 'Google smartphone with pure Android experience and excellent camera quality.', 950, true, 25),
        ('Logitech MX Master 3', 'SKU-MXMASTER3', 'Ergonomic wireless mouse with high-precision tracking, perfect for work.', 100, true, 60),
        ('Kindle Paperwhite', 'SKU-KINDLEPW', 'E-reader with high-resolution display, long battery life, and waterproof design.', 130, true, 70),
        ('Nintendo Switch OLED', 'SKU-SWITCHOLED', 'Versatile gaming console with OLED screen and Joy-Con controllers.', 350, true, 40),
        ('MacBook Pro 16', 'SKU-MBP16', 'High-performance MacBook Pro with M3 Max chip, ideal for creative professionals.', 3000, true, 10),
        ('Bose QuietComfort Earbuds', 'SKU-BOSEQC', 'Wireless earbuds with noise cancellation and rich audio.', 280, true, 50),
        ('Samsung Galaxy Tab S9', 'SKU-TABS9', 'High-end Android tablet with AMOLED display and stylus support.', 850, true, 20),
        ('Apple Magic Keyboard', 'SKU-MAGICKEY', 'Wireless keyboard with rechargeable battery, ideal for Mac users.', 120, true, 80),
        ('Fitbit Charge 6', 'SKU-FITBITC6', 'Fitness tracker with heart rate monitoring and sleep tracking.', 150, true, 60),
        ('Razer Blade 17', 'SKU-RAZERB17', 'Gaming laptop with RTX 4090, Intel i9, and 32GB RAM.', 3500, true, 8),
        ('DJI Mini 4', 'SKU-DJIMINI4', 'Compact drone with 4K camera and intelligent flight modes.', 500, true, 15),
        ('GoPro Hero 12', 'SKU-GOPROH12', 'Action camera with waterproof design and 5.3K video recording.', 450, true, 25);
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
        'SKU-AIRPODSPRO2',
        'SKU-GALAXYS25',
        'SKU-DELLXPS15',
        'SKU-SONYWH1000XM5',
        'SKU-PIXEL9',
        'SKU-MXMASTER3',
        'SKU-KINDLEPW',
        'SKU-SWITCHOLED',
        'SKU-MBP16',
        'SKU-BOSEQC',
        'SKU-TABS9',
        'SKU-MAGICKEY',
        'SKU-FITBITC6',
        'SKU-RAZERB17',
        'SKU-DJIMINI4',
        'SKU-GOPROH12'
      );
    `);
  }
}
