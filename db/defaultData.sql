

/*
  User
*/
INSERT INTO "user" ("id", "email", "password")
VALUES (
  'd500a1a7-e4a3-4471-aebc-d0903208c419',
  'jane@doe.com',
  '$2a$10$6/IYuuUmYSjRJM0CFNQGZumhPRJaCFr7VVI/VTMrr5b6nIEP70/qG' -- 1234
);

/*
  Transaction
*/
INSERT INTO "transaction" ("id", "authorUserId", "title", "amount", "description")
VALUES ('13911f34-d626-489b-be38-a68a63f3cf25', 'd500a1a7-e4a3-4471-aebc-d0903208c419', 'Car insurance', 1000, 'Monthly payment of insurance to TheInsuranceCorp');
INSERT INTO "transaction" ("id", "authorUserId", "title", "amount", "description")
VALUES ('2fa4ae80-38c7-4774-8087-429aba2a36f7', 'bc79214b-3361-4f30-8411-d31b66e15873', 'Window cleaning', 400, 'Random occasional payment for window cleaner');