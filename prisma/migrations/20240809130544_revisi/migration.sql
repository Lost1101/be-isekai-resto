-- CreateTable
CREATE TABLE `payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `payment` DOUBLE NOT NULL,
    `total_cash` DOUBLE NOT NULL,
    `status` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_payment` INTEGER NOT NULL,
    `id_menu` INTEGER NOT NULL,
    `id_table` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `pcs` INTEGER NOT NULL,

    INDEX `order_item_id_menu_idx`(`id_menu`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_id_payment_fkey` FOREIGN KEY (`id_payment`) REFERENCES `payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
