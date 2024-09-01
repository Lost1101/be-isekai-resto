/*
  Warnings:

  - Added the required column `waiter` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `waiter` VARCHAR(191) NOT NULL;
