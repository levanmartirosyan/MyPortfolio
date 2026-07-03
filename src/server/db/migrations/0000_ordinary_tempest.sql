CREATE TABLE "portfolio_experiences" (
	"id" text PRIMARY KEY NOT NULL,
	"company" text NOT NULL,
	"position" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"current" boolean DEFAULT false NOT NULL,
	"description" text NOT NULL,
	"tech" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_profile" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"intro" text NOT NULL,
	"about" text NOT NULL,
	"cv_url" text DEFAULT '' NOT NULL,
	"avatar" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_projects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"long_description" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"live_url" text,
	"github_url" text,
	"tech" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 99 NOT NULL,
	"features" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_social" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"linkedin" text DEFAULT '' NOT NULL,
	"github" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"website" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
