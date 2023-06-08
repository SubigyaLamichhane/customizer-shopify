-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 07, 2023 at 07:10 PM
-- Server version: 8.0.33-0ubuntu0.20.04.2
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
  `level` tinyint NOT NULL DEFAULT '0' COMMENT '0 for 3 level, 1 for 4 level',
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
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `product_color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_mapped` tinyint DEFAULT '0' COMMENT '0 for not mapped,1 for mapped',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_mappings`
--

CREATE TABLE `product_mappings` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `look_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `crop` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visible_add_text` tinyint DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `visible_add_art` tinyint(1) DEFAULT '1' COMMENT '0 for disable, 1 for enable',
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
  `is_pages_created` tinyint NOT NULL DEFAULT '0' COMMENT '0 for not created, 1 for created',
  `page_id` bigint DEFAULT NULL,
  `expires` int DEFAULT NULL,
  `scope` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accessToken` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `onlineAccessInfo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shopify_sessions_migration`
--

CREATE TABLE `shopify_sessions_migration` (
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
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

--
-- Dumping data for table `shopify_sessions_migrations`
--

INSERT INTO `shopify_sessions_migrations` (`migration_name`) VALUES
('migrateScopeFieldToVarchar1024');

-- --------------------------------------------------------

--
-- Table structure for table `text_colors`
--

CREATE TABLE `text_colors` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `text_fonts`
--

CREATE TABLE `text_fonts` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `text_font_list`
--

CREATE TABLE `text_font_list` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `font_id` bigint UNSIGNED NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `image` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `text_outline_colors`
--

CREATE TABLE `text_outline_colors` (
  `id` bigint UNSIGNED NOT NULL,
  `session_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  ADD KEY `art_sub_category_sub_list_art_sub_category_list_id_foreign` (`art_sub_category_list_id`) USING BTREE;

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_settings_session_id_foreign` (`session_id`);

--
-- Indexes for table `product_mappings`
--
ALTER TABLE `product_mappings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_mappings_FK` (`session_id`),
  ADD KEY `product_mappings_FK_1` (`product_id`);

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
-- Indexes for table `shopify_sessions_migration`
--
ALTER TABLE `shopify_sessions_migration`
  ADD KEY `shopify_sessions_migration_migration_name_foreign` (`migration_name`);

--
-- Indexes for table `shopify_sessions_migrations`
--
ALTER TABLE `shopify_sessions_migrations`
  ADD PRIMARY KEY (`migration_name`);

--
-- Indexes for table `text_colors`
--
ALTER TABLE `text_colors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `text_colors_FK` (`session_id`);

--
-- Indexes for table `text_fonts`
--
ALTER TABLE `text_fonts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `text_font_list`
--
ALTER TABLE `text_font_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `text_font_list_FK_1` (`font_id`);

--
-- Indexes for table `text_outline_colors`
--
ALTER TABLE `text_outline_colors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `text_outline_colors_FK` (`session_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `art_category`
--
ALTER TABLE `art_category`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `art_sub_category`
--
ALTER TABLE `art_sub_category`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `art_sub_category_list`
--
ALTER TABLE `art_sub_category_list`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `art_sub_category_sub_list`
--
ALTER TABLE `art_sub_category_sub_list`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `product_mappings`
--
ALTER TABLE `product_mappings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `text_colors`
--
ALTER TABLE `text_colors`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `text_fonts`
--
ALTER TABLE `text_fonts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `text_font_list`
--
ALTER TABLE `text_font_list`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `text_outline_colors`
--
ALTER TABLE `text_outline_colors`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `product_settings_session_id_foreign` FOREIGN KEY (`session_id`) REFERENCES `shopify_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_mappings`
--
ALTER TABLE `product_mappings`
  ADD CONSTRAINT `product_mappings_FK` FOREIGN KEY (`session_id`) REFERENCES `shopify_sessions` (`id`),
  ADD CONSTRAINT `product_mappings_FK_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `settings_session_id_foreign` FOREIGN KEY (`session_id`) REFERENCES `shopify_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shopify_sessions_migration`
--
ALTER TABLE `shopify_sessions_migration`
  ADD CONSTRAINT `shopify_sessions_migration_migration_name_foreign` FOREIGN KEY (`migration_name`) REFERENCES `shopify_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `text_colors`
--
ALTER TABLE `text_colors`
  ADD CONSTRAINT `text_colors_FK` FOREIGN KEY (`session_id`) REFERENCES `shopify_sessions` (`id`);

--
-- Constraints for table `text_fonts`
--
ALTER TABLE `text_fonts`
  ADD CONSTRAINT `text_fonts_FK` FOREIGN KEY (`session_id`) REFERENCES `shopify_sessions` (`id`);

--
-- Constraints for table `text_font_list`
--
ALTER TABLE `text_font_list`
  ADD CONSTRAINT `text_font_list_FK` FOREIGN KEY (`session_id`) REFERENCES `shopify_sessions` (`id`),
  ADD CONSTRAINT `text_font_list_FK_1` FOREIGN KEY (`font_id`) REFERENCES `text_fonts` (`id`);

--
-- Constraints for table `text_outline_colors`
--
ALTER TABLE `text_outline_colors`
  ADD CONSTRAINT `text_outline_colors_FK` FOREIGN KEY (`session_id`) REFERENCES `shopify_sessions` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
