/*
  Warnings:

  - Added the required column `id_queue` to the `order_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `queue` DROP FOREIGN KEY `queue_id_order_fkey`;

-- DropIndex
DROP INDEX `payment_id_table_fkey` ON `payment`;

-- AlterTable
ALTER TABLE `order_item` ADD COLUMN `id_queue` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_id_queue_fkey` FOREIGN KEY (`id_queue`) REFERENCES `queue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
