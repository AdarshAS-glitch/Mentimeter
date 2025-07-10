/*
  Warnings:

  - You are about to drop the column `option1` on the `Questions` table. All the data in the column will be lost.
  - You are about to drop the column `option2` on the `Questions` table. All the data in the column will be lost.
  - You are about to drop the column `option3` on the `Questions` table. All the data in the column will be lost.
  - You are about to drop the column `option4` on the `Questions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Questions" DROP COLUMN "option1",
DROP COLUMN "option2",
DROP COLUMN "option3",
DROP COLUMN "option4";

-- CreateTable
CREATE TABLE "Options" (
    "id" TEXT NOT NULL,
    "option1" TEXT NOT NULL,
    "option2" TEXT NOT NULL,
    "option3" TEXT NOT NULL,
    "option4" TEXT NOT NULL,
    "questionid" TEXT NOT NULL,

    CONSTRAINT "Options_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Options" ADD CONSTRAINT "Options_questionid_fkey" FOREIGN KEY ("questionid") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
