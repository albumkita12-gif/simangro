CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" varchar(50) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "monitoring_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"kabupaten" varchar(200) NOT NULL,
	"provinsi" varchar(200),
	"luas_target" integer,
	"luas_tanam" integer,
	"tahun" integer
);
--> statement-breakpoint
CREATE TABLE "quiz_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct" integer NOT NULL,
	"explanation" text,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "regulations" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"title" varchar(300) NOT NULL,
	"description" text,
	"points" jsonb
);
--> statement-breakpoint
CREATE TABLE "species" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"local_names" text,
	"intro" text,
	"morphology" jsonb,
	"taxonomy" jsonb,
	"habitat" text,
	"images" jsonb,
	"category" varchar(100),
	CONSTRAINT "species_slug_unique" UNIQUE("slug")
);
