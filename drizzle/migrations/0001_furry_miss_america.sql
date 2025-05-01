CREATE TABLE "scan_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scan_id" uuid NOT NULL,
	"is_helpful" boolean NOT NULL,
	"result_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "scans" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "scan_feedback" ADD CONSTRAINT "scan_feedback_scan_id_scans_id_fk" FOREIGN KEY ("scan_id") REFERENCES "public"."scans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "scan_feedback_scan_id_idx" ON "scan_feedback" USING btree ("scan_id");