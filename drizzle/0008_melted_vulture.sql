CREATE TABLE IF NOT EXISTS "message_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"number_of_messages" integer NOT NULL
);
