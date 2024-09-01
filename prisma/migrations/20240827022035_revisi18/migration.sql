/*
  Warnings:

  - Added the required column `img` to the `menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `waiter` to the `order_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `menu` ADD COLUMN `img` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `order_item` ADD COLUMN `waiter` VARCHAR(191) NOT NULL;
