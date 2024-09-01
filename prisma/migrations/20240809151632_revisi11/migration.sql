/*
  Warnings:

  - You are about to drop the column `id_queue` on the `order_item` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `order_item_id_queue_fkey` ON `order_item`;

-- AlterTable
ALTER TABLE `order_item` DROP COLUMN `id_queue`;
