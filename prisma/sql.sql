/*model users {
  id    String @id @default(uuid())
  email String @unique
  name  String?
  password String 
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}*/

/*model mandarin_words {
  id    String @id @default(uuid())
  hanzi String 
  pinyin String
  meaning String

  email String @unique
  name  String?
  password String 
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}*/


/*HSK DIFICULTY*/

UPDATE "MandarinWord" mw
SET difficulty =
(
    0.5 * (
        mw."hskLevel"::float / 7.0
    )
)
+
(
    0.5 * (
        1 - COALESCE(ms."log10W",0) / 6.226
    )
)
FROM "MandarinSubtlex" ms
WHERE ms."wordId" = mw.id;

CREATE TABLE "SystemConfig" (
  id UUID PRIMARY KEY,
  "currentReviewDate" TIMESTAMP
);

INSERT INTO "User"
(
  id,
  email,
  name,
  password,
  role,
  created_at,
  updated_at
)
VALUES
(
  gen_random_uuid(),
  'admin@gmail.com',
  'Admin',
  '$2a$10$dHyhhy8mvrj8Mkua8znKheU6jxOndZ.4rA79tuOIxrPSymjH4.KdO',
  'ADMIN',
  NOW(),
  NOW()
);

INSERT INTO "User"
(
  id,
  email,
  name,
  password,
  role,
  created_at,
  updated_at
)
VALUES
(
  gen_random_uuid(),
  'teacher@gmail.com',
  'Teacher',
  '$2a$10$4PEXT3sNe/FD1zv36pMHn.GvBeb9qoU255CZcRWeLvop7Yw4/H9x2',
  'TEACHER',
  NOW(),
  NOW()
);