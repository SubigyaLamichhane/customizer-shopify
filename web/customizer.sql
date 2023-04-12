-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 12, 2023 at 11:44 AM
-- Server version: 8.0.32-0ubuntu0.20.04.2
-- PHP Version: 7.4.3-4ubuntu2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `customizer`
--

-- --------------------------------------------------------

--
-- Table structure for table `art_category`
--

CREATE TABLE `art_category` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `background_image` text COLLATE utf8mb4_unicode_ci,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `art_sub_category`
--

CREATE TABLE `art_sub_category` (
  `id` bigint UNSIGNED NOT NULL,
  `art_category_id` bigint UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `art_sub_category_list`
--

CREATE TABLE `art_sub_category_list` (
  `id` bigint UNSIGNED NOT NULL,
  `art_sub_category_id` bigint UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_src` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `art_sub_category_sub_list`
--

CREATE TABLE `art_sub_category_sub_list` (
  `id` bigint UNSIGNED NOT NULL,
  `art_sub_category_list_id` bigint UNSIGNED DEFAULT NULL,
  `image_src` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_settings`
--

CREATE TABLE `product_settings` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `product_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_image` text COLLATE utf8mb4_unicode_ci,
  `product_color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_mark` tinyint DEFAULT '0' COMMENT '0 for not mark,1 for mark',
  `front_image_left` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `front_image_top` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `front_crop_width` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `front_crop_height` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `front_image_width` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `front_image_height` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `front_scale_x` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `front_scale_y` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `back_image_left` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `back_image_top` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `back_crop_width` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `back_crop_height` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `back_image_width` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `back_image_height` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `back_scale_x` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `back_scale_y` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `left_image_left` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `left_image_top` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `left_crop_width` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `left_crop_height` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `left_image_width` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `left_image_height` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `left_scale_x` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `left_scale_y` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `right_image_left` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `right_image_top` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `right_crop_width` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `right_crop_height` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `right_image_width` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `right_image_height` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `right_scale_x` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `right_scale_y` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visible_add_art` tinyint NOT NULL DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `visible_upload` tinyint NOT NULL DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `visible_add_name` tinyint NOT NULL DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `visible_add_notes` tinyint NOT NULL DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shopify_sessions`
--

CREATE TABLE `shopify_sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shop` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isOnline` int NOT NULL,
  `expires` int DEFAULT NULL,
  `scope` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accessToken` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `onlineAccessInfo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shopify_sessions_migrations`
--

CREATE TABLE `shopify_sessions_migrations` (
  `migration_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `text_settings`
--

CREATE TABLE `text_settings` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `font_style` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `font_color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `text_outline_color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `art_category`
--
ALTER TABLE `art_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `art_category_session_id_index` (`session_id`);

--
-- Indexes for table `art_sub_category`
--
ALTER TABLE `art_sub_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `art_sub_category_art_category_id_foreign` (`art_category_id`);

--
-- Indexes for table `art_sub_category_list`
--
ALTER TABLE `art_sub_category_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `art_sub_category_list_art_sub_category_id_foreign` (`art_sub_category_id`);

--
-- Indexes for table `art_sub_category_sub_list`
--
ALTER TABLE `art_sub_category_sub_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `art_sub_category_sub_list_art_sub_category_list_id_foreign` (`art_sub_category_list_id`);

--
-- Indexes for table `product_settings`
--
ALTER TABLE `product_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_settings_session_id_foreign` (`session_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `settings_session_id_foreign` (`session_id`);

--
-- Indexes for table `shopify_sessions`
--
ALTER TABLE `shopify_sessions`
  ADD KEY `shopify_sessions_id_index` (`id`);

--
-- Indexes for table `shopify_sessions_migrations`
--
ALTER TABLE `shopify_sessions_migrations`
  ADD PRIMARY KEY (`migration_name`);

--
-- Indexes for table `text_settings`
--
ALTER TABLE `text_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `text_settings_session_id_foreign` (`session_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `art_category`
--
ALTER TABLE `art_category`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `art_sub_category`
--
ALTER TABLE `art_sub_category`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `art_sub_category_list`
--
ALTER TABLE `art_sub_category_list`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `art_sub_category_sub_list`
--
ALTER TABLE `art_sub_category_sub_list`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product_settings`
--
ALTER TABLE `product_settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `text_settings`
--
ALTER TABLE `text_settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `art_category`
--
ALTER TABLE `art_category`
  ADD CONSTRAINT `art_category_session_id_foreign` FOREIGN KEY (`session_id`) REFERENCES `shopify_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `art_sub_category`
--
ALTER TABLE `art_sub_category`
  ADD CONSTRAINT `art_sub_category_art_category_id_foreign` FOREIGN KEY (`art_category_id`) REFERENCES `art_category` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `art_sub_category_list`
--
ALTER TABLE `art_sub_category_list`
  ADD CONSTRAINT `art_sub_category_list_art_sub_category_id_foreign` FOREIGN KEY (`art_sub_category_id`) REFERENCES `art_sub_category` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `art_sub_category_sub_list`
--
ALTER TABLE `art_sub_category_sub_list`
  ADD CONSTRAINT `art_sub_category_sub_list_art_sub_category_list_id_foreign` FOREIGN KEY (`art_sub_category_list_id`) REFERENCES `art_sub_category_list` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_settings`
--
ALTER TABLE `product_settings`
  ADD CONSTRAINT `product_settings_session_id_foreign` FOREIGN KEY (`session_id`) REFERENCES `shopify_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `settings_session_id_foreign` FOREIGN KEY (`session_id`) REFERENCES `shopify_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `text_settings`
--
ALTER TABLE `text_settings`
  ADD CONSTRAINT `text_settings_session_id_foreign` FOREIGN KEY (`session_id`) REFERENCES `shopify_sessions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
