/*
  Warnings:

  - You are about to drop the column `def_frequency` on the `MandarinMeaning` table. All the data in the column will be lost.
  - Added the required column `def_frequency` to the `MandarinWord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MandarinMeaning" DROP COLUMN "def_frequency";

-- AlterTable
ALTER TABLE "MandarinWord" ADD COLUMN     "def_frequency" INTEGER NOT NULL;
