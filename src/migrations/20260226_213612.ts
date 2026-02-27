import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_subscription_status" AS ENUM('free', 'active', 'trialing', 'past_due', 'canceled', 'paused');
  CREATE TYPE "public"."enum_users_subscription_plan" AS ENUM('free', 'pro_monthly');
  ALTER TABLE "users" ADD COLUMN "paddle_customer_id" varchar;
  ALTER TABLE "users" ADD COLUMN "paddle_subscription_id" varchar;
  ALTER TABLE "users" ADD COLUMN "subscription_status" "enum_users_subscription_status" DEFAULT 'free';
  ALTER TABLE "users" ADD COLUMN "subscription_plan" "enum_users_subscription_plan" DEFAULT 'free';
  ALTER TABLE "users" ADD COLUMN "subscription_current_period_end" timestamp(3) with time zone;
  ALTER TABLE "audit_reports" ADD COLUMN "analytics_snapshot" jsonb;
  ALTER TABLE "audit_reports" ADD COLUMN "account_info" jsonb;
  ALTER TABLE "audit_reports" ADD COLUMN "data_streams" jsonb;
  CREATE INDEX "users_paddle_customer_id_idx" ON "users" USING btree ("paddle_customer_id");
  CREATE INDEX "users_paddle_subscription_id_idx" ON "users" USING btree ("paddle_subscription_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "users_paddle_customer_id_idx";
  DROP INDEX "users_paddle_subscription_id_idx";
  ALTER TABLE "users" DROP COLUMN "paddle_customer_id";
  ALTER TABLE "users" DROP COLUMN "paddle_subscription_id";
  ALTER TABLE "users" DROP COLUMN "subscription_status";
  ALTER TABLE "users" DROP COLUMN "subscription_plan";
  ALTER TABLE "users" DROP COLUMN "subscription_current_period_end";
  ALTER TABLE "audit_reports" DROP COLUMN "analytics_snapshot";
  ALTER TABLE "audit_reports" DROP COLUMN "account_info";
  ALTER TABLE "audit_reports" DROP COLUMN "data_streams";
  DROP TYPE "public"."enum_users_subscription_status";
  DROP TYPE "public"."enum_users_subscription_plan";`)
}
