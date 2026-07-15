CREATE TABLE "compare_stock" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_code" varchar(255) NOT NULL,
	"warehouse_code" varchar(255) NOT NULL,
	"physical_stock" integer,
	"system_stock" integer,
	"manual" integer,
	"sales_return" integer,
	"blocked" integer,
	"sto_pending" integer,
	"grn_pending" integer,
	"damages" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "compare_stock" ADD CONSTRAINT "compare_stock_item_code_master_items_item_code_fk" FOREIGN KEY ("item_code") REFERENCES "public"."master_items"("item_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compare_stock" ADD CONSTRAINT "compare_stock_warehouse_code_warehouses_warehouse_code_fk" FOREIGN KEY ("warehouse_code") REFERENCES "public"."warehouses"("warehouse_code") ON DELETE no action ON UPDATE no action;