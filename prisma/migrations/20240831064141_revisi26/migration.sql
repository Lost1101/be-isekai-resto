/*
  Warnings:

  - Added the required column `status_ord` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `status_ord` BOOLEAN NOT NULL;
