CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."replies"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "content" text NOT NULL, "comment_id" uuid NOT NULL, "author_id" integer NOT NULL, "created_at" Timestamp NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
