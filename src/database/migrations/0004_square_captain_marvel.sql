ALTER TABLE "compare_stock" DROP CONSTRAINT "compare_stock_item_code_master_items_item_code_fk";
--> statement-breakpoint
ALTER TABLE "compare_stock" DROP CONSTRAINT "compare_stock_warehouse_code_warehouses_warehouse_code_fk";
--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "warehouse_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "physical_stock" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "physical_stock" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "system_stock" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "system_stock" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "manual" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "manual" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "sales_return" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "sales_return" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "blocked" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "blocked" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "sto_pending" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "sto_pending" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "grn_pending" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "grn_pending" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "damages" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "compare_stock" ALTER COLUMN "damages" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "compare_stock" ADD COLUMN "date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "compare_stock" ADD COLUMN "warehouse_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "compare_stock" ADD COLUMN "item_name" varchar(255);--> statement-breakpoint
ALTER TABLE "compare_stock" ADD COLUMN "difference" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "compare_stock" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "compare_stock" ADD CONSTRAINT "compare_stock_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;