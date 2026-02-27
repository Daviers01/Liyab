import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "gtm_audit_reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"container_name" varchar NOT NULL,
  	"container_id" varchar NOT NULL,
  	"public_id" varchar NOT NULL,
  	"health_score" numeric NOT NULL,
  	"checks" jsonb NOT NULL,
  	"summary" jsonb NOT NULL,
  	"martech" jsonb,
  	"container_type" jsonb,
  	"tag_count" numeric,
  	"trigger_count" numeric,
  	"variable_count" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "gtm_audit_reports_id" integer;
  ALTER TABLE "gtm_audit_reports" ADD CONSTRAINT "gtm_audit_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "gtm_audit_reports_user_idx" ON "gtm_audit_reports" USING btree ("user_id");
  CREATE INDEX "gtm_audit_reports_container_id_idx" ON "gtm_audit_reports" USING btree ("container_id");
  CREATE INDEX "gtm_audit_reports_updated_at_idx" ON "gtm_audit_reports" USING btree ("updated_at");
  CREATE INDEX "gtm_audit_reports_created_at_idx" ON "gtm_audit_reports" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gtm_audit_reports_fk" FOREIGN KEY ("gtm_audit_reports_id") REFERENCES "public"."gtm_audit_reports"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_gtm_audit_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("gtm_audit_reports_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "gtm_audit_reports" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "gtm_audit_reports" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_gtm_audit_reports_fk";
  
  DROP INDEX "payload_locked_documents_rels_gtm_audit_reports_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "gtm_audit_reports_id";`)
}
