/*
  Warnings:

  - Added the required column `customer` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer` to the `queue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_item` ADD COLUMN `customer` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `customer` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `queue` ADD COLUMN `customer` VARCHAR(191) NOT NULL;
