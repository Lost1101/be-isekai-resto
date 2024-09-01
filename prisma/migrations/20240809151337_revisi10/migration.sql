-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `order_item_id_queue_fkey`;

-- DropIndex
DROP INDEX `order_item_id_table_fkey` ON `order_item`;

-- AddForeignKey
ALTER TABLE `queue` ADD CONSTRAINT `queue_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `order_item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
