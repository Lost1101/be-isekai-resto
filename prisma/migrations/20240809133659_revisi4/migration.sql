-- DropIndex
DROP INDEX `queue_id_table_fkey` ON `queue`;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
