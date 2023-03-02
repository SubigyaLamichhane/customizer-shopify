/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `Profile`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `art_category` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(50) NULL,
    `backgroud_image` TEXT NULL,
    `status` TINYINT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `art_sub_category` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `art_category_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `art_sub_category_list` (
    `id` BIGINT UNSIGNED NOT NULL,
    `art_sub_category_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(50) NULL,
    `image_src` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `art_sub_category_sub_list` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `art_sub_category_list_id` BIGINT UNSIGNED NULL,
    `image_src` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NULL,
    `product_id` BIGINT NULL,
    `product_title` VARCHAR(255) NULL,
    `product_image` TEXT NULL,
    `product_color` VARCHAR(50) NULL,
    `front_image_left` INTEGER NULL,
    `front_image_top` INTEGER NULL,
    `front_crop_width` INTEGER NULL,
    `front_crop_height` VARCHAR(50) NULL,
    `front_image_width` VARCHAR(50) NULL,
    `front_image_height` VARCHAR(50) NULL,
    `front_scale_x` VARCHAR(50) NULL,
    `front_scale_y` VARCHAR(50) NULL,
    `back_image_left` VARCHAR(50) NULL,
    `back_image_top` VARCHAR(50) NULL,
    `back_crop_width` VARCHAR(50) NULL,
    `back_crop_height` VARCHAR(50) NULL,
    `back_image_width` VARCHAR(50) NULL,
    `back_image_height` VARCHAR(50) NULL,
    `back_scale_x` VARCHAR(50) NULL,
    `back_scale_y` VARCHAR(50) NULL,
    `left_image_left` VARCHAR(50) NULL,
    `left_image_top` VARCHAR(50) NULL,
    `left_crop_width` VARCHAR(50) NULL,
    `left_crop_height` VARCHAR(50) NULL,
    `left_image_width` VARCHAR(50) NULL,
    `left_image_height` VARCHAR(50) NULL,
    `left_scale_x` VARCHAR(50) NULL,
    `left_scale_y` VARCHAR(50) NULL,
    `right_image_left` VARCHAR(50) NULL,
    `right_image_top` VARCHAR(50) NULL,
    `right_crop_width` VARCHAR(50) NULL,
    `right_crop_height` VARCHAR(50) NULL,
    `right_image_width` VARCHAR(50) NULL,
    `right_image_height` VARCHAR(50) NULL,
    `right_scale_x` VARCHAR(50) NULL,
    `right_scale_y` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` BIGINT NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `text` VARCHAR(20) NULL,
    `use_greek_letter` TINYINT NULL DEFAULT 1,
    `font_setting` TINYINT NULL DEFAULT 1,
    `text_color_setting` TINYINT NULL DEFAULT 1,
    `rotation_setting` TINYINT NULL DEFAULT 1,
    `outline_setting` TINYINT NULL DEFAULT 1,
    `text_shape_setting` TINYINT NULL DEFAULT 1,
    `text_size_setting` TINYINT NULL DEFAULT 1,
    `upload_video` TINYINT NULL DEFAULT 1,
    `status` TINYINT NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shopify_sessions` (
    `id` VARCHAR(255) NOT NULL,
    `shop` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `isOnline` INTEGER NOT NULL,
    `expires` INTEGER NULL,
    `scope` VARCHAR(1024) NULL,
    `accessToken` VARCHAR(255) NULL,
    `onlineAccessInfo` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shopify_sessions_migrations` (
    `migration_name` VARCHAR(255) NOT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `text_settings` (
    `id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `font_style` VARCHAR(50) NULL,
    `font_color` VARCHAR(50) NULL,
    `text_outline_color` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `text_settings_old` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(20) NULL,
    `use_greek_letter` TINYINT NULL DEFAULT 0,
    `text_font_name` VARCHAR(20) NULL,
    `text_font_value` VARCHAR(20) NULL,
    `text_color` VARCHAR(20) NULL,
    `text_rotation` INTEGER NULL,
    `text_outline_thickness` INTEGER NULL,
    `text_outline_thickness_color` VARCHAR(20) NULL,
    `text_shape` VARCHAR(20) NULL,
    `text_shape_size` VARCHAR(20) NULL,
    `text_size` INTEGER NULL,
    `status` TINYINT NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
