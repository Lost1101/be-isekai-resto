/*
  Warnings:

  - A unique constraint covering the columns `[id_payment]` on the table `queue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `menu` ADD COLUMN `category` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `name` INTEGER NOT NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `queue_id_payment_key` ON `queue`(`id_payment`);
