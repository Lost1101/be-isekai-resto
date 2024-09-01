-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `order_item_id_table_fkey`;

-- DropIndex
DROP INDEX `queue_id_order_fkey` ON `queue`;
