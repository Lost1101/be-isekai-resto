/*
  Warnings:

  - You are about to drop the column `id_order` on the `payment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `payment_status_id_order_id_table_idx` ON `payment`;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `id_order`;

-- CreateIndex
CREATE INDEX `payment_status_id_table_idx` ON `payment`(`status`, `id_table`);
