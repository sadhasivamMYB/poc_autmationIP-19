CREATE TABLE "initial_stock" (
	"id" serial PRIMARY KEY NOT NULL,
	"warehouse_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"opening_cases" integer DEFAULT 0 NOT NULL,
	"opening_bottles" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "initial_stock_warehouse_id_item_id_unique" UNIQUE("warehouse_id","item_id")
);
--> statement-breakpoint
ALTER TABLE "initial_stock" ADD CONSTRAINT "initial_stock_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "initial_stock" ADD CONSTRAINT "initial_stock_item_id_master_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."master_items"("id") ON DELETE no action ON UPDATE no action;