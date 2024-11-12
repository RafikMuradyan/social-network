import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitializeDatabase1731252208553 implements MigrationInterface {
  name = 'InitializeDatabase1731252208553';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."friend_requests_status_enum" AS ENUM('pending', 'accepted', 'declined')`,
    );
    await queryRunner.query(
      `CREATE TABLE "friend_requests" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "status" "public"."friend_requests_status_enum" NOT NULL DEFAULT 'pending', "sender_id" integer, "receiver_id" integer, CONSTRAINT "PK_3827ba86ce64ecb4b90c92eeea6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, "age" smallint NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_c034dd387df6cd4ce9aaebdd480" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_781744f1014838837741581a8b7" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_781744f1014838837741581a8b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_c034dd387df6cd4ce9aaebdd480"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "friend_requests"`);
    await queryRunner.query(`DROP TYPE "public"."friend_requests_status_enum"`);
  }
}
