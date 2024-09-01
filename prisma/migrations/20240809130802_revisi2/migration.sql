-- CreateTable
CREATE TABLE `queue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_order` INTEGER NOT NULL,
    `id_table` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `queue` ADD CONSTRAINT `queue_id_table_fkey` FOREIGN KEY (`id_table`) REFERENCES `order_item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
