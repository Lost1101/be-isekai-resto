/*
  Warnings:

  - Added the required column `change` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `change` DOUBLE NOT NULL;
