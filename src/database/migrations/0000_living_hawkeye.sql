CREATE TABLE "daily_stock" (
	"id" serial PRIMARY KEY NOT NULL,
	"stock_date" date NOT NULL,
	"warehouse_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"opening_cases" integer DEFAULT 0 NOT NULL,
	"opening_bottles" integer DEFAULT 0 NOT NULL,
	"received_cases" integer DEFAULT 0 NOT NULL,
	"received_bottles" integer DEFAULT 0 NOT NULL,
	"issued_cases" integer DEFAULT 0 NOT NULL,
	"issued_bottles" integer DEFAULT 0 NOT NULL,
	"closing_cases" integer DEFAULT 0 NOT NULL,
	"closing_bottles" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'OPEN' NOT NULL,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "daily_stock_stock_date_warehouse_id_item_id_unique" UNIQUE("stock_date","warehouse_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "master_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_code" varchar(50) NOT NULL,
	"item_name" varchar(255) NOT NULL,
	"bottle_per_case" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "master_items_item_code_unique" UNIQUE("item_code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(30) NOT NULL,
	"warehouse_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "warehouses" (
	"id" serial PRIMARY KEY NOT NULL,
	"warehouse_name" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "warehouses_warehouse_name_unique" UNIQUE("warehouse_name")
);
--> statement-breakpoint
ALTER TABLE "daily_stock" ADD CONSTRAINT "daily_stock_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_stock" ADD CONSTRAINT "daily_stock_item_id_master_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."master_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_stock" ADD CONSTRAINT "daily_stock_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;