/*
  Warnings:

  - You are about to drop the column `id_order` on the `queue` table. All the data in the column will be lost.
  - Added the required column `id_payment` to the `queue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `queue` DROP FOREIGN KEY `queue_id_order_fkey`;

-- DropIndex
DROP INDEX `queue_id_order_id_table_idx` ON `queue`;

-- AlterTable
ALTER TABLE `queue` DROP COLUMN `id_order`,
    ADD COLUMN `id_payment` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `queue_id_payment_id_table_idx` ON `queue`(`id_payment`, `id_table`);

-- AddForeignKey
ALTER TABLE `queue` ADD CONSTRAINT `queue_id_payment_fkey` FOREIGN KEY (`id_payment`) REFERENCES `payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
