-- DropForeignKey
ALTER TABLE `queue` DROP FOREIGN KEY `queue_id_table_fkey`;

-- AddForeignKey
ALTER TABLE `queue` ADD CONSTRAINT `queue_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `order_item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
