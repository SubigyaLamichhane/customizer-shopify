-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 24, 2023 at 07:35 PM
-- Server version: 8.0.32-0ubuntu0.20.04.2
-- PHP Version: 7.4.3-4ubuntu2.17

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
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `backgroud_image` text,
  `status` tinyint DEFAULT NULL COMMENT '0 for disable, 1 for enable',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `art_sub_category`
--

CREATE TABLE `art_sub_category` (
  `id` bigint UNSIGNED NOT NULL,
  `art_category_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `art_sub_category_list`
--

CREATE TABLE `art_sub_category_list` (
  `id` bigint UNSIGNED NOT NULL,
  `art_sub_category_id` bigint UNSIGNED NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `image_src` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `art_sub_category_sub_list`
--

CREATE TABLE `art_sub_category_sub_list` (
  `id` bigint UNSIGNED NOT NULL,
  `art_sub_category_list_id` bigint UNSIGNED DEFAULT NULL,
  `image_src` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_settings`
--

CREATE TABLE `product_settings` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `product_title` varchar(255) DEFAULT NULL,
  `product_image` text,
  `product_color` varchar(50) DEFAULT NULL,
  `front_image_left` int DEFAULT NULL,
  `front_image_top` int DEFAULT NULL,
  `front_crop_width` int DEFAULT NULL,
  `front_crop_height` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `front_image_width` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `front_image_height` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `front_scale_x` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `front_scale_y` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `back_image_left` varchar(50) DEFAULT NULL,
  `back_image_top` varchar(50) DEFAULT NULL,
  `back_crop_width` varchar(50) DEFAULT NULL,
  `back_crop_height` varchar(50) DEFAULT NULL,
  `back_image_width` varchar(50) DEFAULT NULL,
  `back_image_height` varchar(50) DEFAULT NULL,
  `back_scale_x` varchar(50) DEFAULT NULL,
  `back_scale_y` varchar(50) DEFAULT NULL,
  `left_image_left` varchar(50) DEFAULT NULL,
  `left_image_top` varchar(50) DEFAULT NULL,
  `left_crop_width` varchar(50) DEFAULT NULL,
  `left_crop_height` varchar(50) DEFAULT NULL,
  `left_image_width` varchar(50) DEFAULT NULL,
  `left_image_height` varchar(50) DEFAULT NULL,
  `left_scale_x` varchar(50) DEFAULT NULL,
  `left_scale_y` varchar(50) DEFAULT NULL,
  `right_image_left` varchar(50) DEFAULT NULL,
  `right_image_top` varchar(50) DEFAULT NULL,
  `right_crop_width` varchar(50) DEFAULT NULL,
  `right_crop_height` varchar(50) DEFAULT NULL,
  `right_image_width` varchar(50) DEFAULT NULL,
  `right_image_height` varchar(50) DEFAULT NULL,
  `right_scale_x` varchar(50) DEFAULT NULL,
  `right_scale_y` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `text` varchar(20) DEFAULT NULL,
  `use_greek_letter` tinyint DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `font_setting` tinyint DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `text_color_setting` tinyint DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `rotation_setting` tinyint DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `outline_setting` tinyint DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `text_shape_setting` tinyint DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `text_size_setting` tinyint DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `upload_video` tinyint DEFAULT '1' COMMENT '0 for disable, 1 for enable	',
  `status` tinyint DEFAULT '1' COMMENT '0 for disable, 1 for enable',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `text_settings`
--

CREATE TABLE `text_settings` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `font_style` varchar(50) DEFAULT NULL,
  `font_color` varchar(50) DEFAULT NULL,
  `text_outline_color` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `text_settings_old`
--

CREATE TABLE `text_settings_old` (
  `id` bigint UNSIGNED NOT NULL,
  `text` varchar(20) DEFAULT NULL,
  `use_greek_letter` tinyint DEFAULT '0',
  `text_font_name` varchar(20) DEFAULT NULL,
  `text_font_value` varchar(20) DEFAULT NULL,
  `text_color` varchar(20) DEFAULT NULL,
  `text_rotation` int DEFAULT NULL,
  `text_outline_thickness` int DEFAULT NULL,
  `text_outline_thickness_color` varchar(20) DEFAULT NULL,
  `text_shape` varchar(20) DEFAULT NULL,
  `text_shape_size` varchar(20) DEFAULT NULL,
  `text_size` int DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `art_category`
--
ALTER TABLE `art_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `art_sub_category`
--
ALTER TABLE `art_sub_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `art_sub_category_sub_list`
--
ALTER TABLE `art_sub_category_sub_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_settings`
--
ALTER TABLE `product_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `text_settings`
--
ALTER TABLE `text_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `text_settings_old`
--
ALTER TABLE `text_settings_old`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `art_category`
--
ALTER TABLE `art_category`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `art_sub_category`
--
ALTER TABLE `art_sub_category`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `art_sub_category_sub_list`
--
ALTER TABLE `art_sub_category_sub_list`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_settings`
--
ALTER TABLE `product_settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `text_settings_old`
--
ALTER TABLE `text_settings_old`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
