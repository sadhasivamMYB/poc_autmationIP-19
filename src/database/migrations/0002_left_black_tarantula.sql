ALTER TABLE "warehouses" ADD COLUMN "warehouse_code" varchar(50);--> statement-breakpoint
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_warehouse_code_unique" UNIQUE("warehouse_code");