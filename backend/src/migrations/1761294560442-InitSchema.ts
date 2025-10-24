import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1761294560442 implements MigrationInterface {
  name = 'InitSchema1761294560442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" VARCHAR(100) UNIQUE NOT NULL,
        "role" VARCHAR(20) NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
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
