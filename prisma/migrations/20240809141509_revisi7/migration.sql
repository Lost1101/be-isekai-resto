-- DropForeignKey
ALTER TABLE `order_item` DROP FOREIGN KEY `order_item_id_menu_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `payment_id_table_fkey`;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_id_table_fkey` FOREIGN KEY (`id_table`) REFERENCES `tables`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
