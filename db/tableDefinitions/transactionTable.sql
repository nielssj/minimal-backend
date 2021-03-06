CREATE TABLE transaction (
  "id" VARCHAR (255) PRIMARY KEY NOT NULL,
  "authorUserId" VARCHAR (255) NOT NULL,
  "title" VARCHAR (255) NOT NULL,
  "amount" INTEGER NOT NULL,
  "description" TEXT,
  "created" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  "updated" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);
