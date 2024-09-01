/*
  Warnings:

  - Added the required column `id_order` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_table` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `id_order` INTEGER NOT NULL,
    ADD COLUMN `id_table` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `payment_status_id_order_id_table_idx` ON `payment`(`status`, `id_order`, `id_table`);

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_id_table_fkey` FOREIGN KEY (`id_table`) REFERENCES `tables`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
