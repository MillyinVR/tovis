CREATE TABLE "licenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"professional_id" uuid,
	"state_code" char(2) NOT NULL,
	"license_number" text NOT NULL,
	"issued_date" date,
	"expires_date" date,
	"front_image_url" text,
	"back_image_url" text,
	"status" text DEFAULT 'pending',
	"replaces_license_id" uuid,
	"reviewer_id" uuid,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "professionals" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"bio" text,
	"business_name" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" text DEFAULT 'client',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_professional_id_professionals_user_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;