-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: scentify
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `autoschedule`
--

DROP TABLE IF EXISTS `autoschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `autoschedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device_id` int NOT NULL,
  `combination_id` int NOT NULL,
  `sub_mode` int NOT NULL,
  `type` int DEFAULT NULL,
  `interval` int DEFAULT NULL,
  `mode_on` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `device_id` (`device_id`),
  KEY `combination_id` (`combination_id`),
  CONSTRAINT `autoschedule_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`) ON DELETE CASCADE,
  CONSTRAINT `autoschedule_ibfk_3` FOREIGN KEY (`combination_id`) REFERENCES `combination` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `autoschedule`
--

LOCK TABLES `autoschedule` WRITE;
/*!40000 ALTER TABLE `autoschedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `autoschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combination`
--

DROP TABLE IF EXISTS `combination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combination` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `choice1` int NOT NULL,
  `choice1_count` int NOT NULL,
  `choice2` int DEFAULT NULL,
  `choice2_count` int DEFAULT NULL,
  `choice3` int DEFAULT NULL,
  `choice3_count` int DEFAULT NULL,
  `choice4` int DEFAULT NULL,
  `choice4_count` int DEFAULT NULL,
  `img_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combination`
--

LOCK TABLES `combination` WRITE;
/*!40000 ALTER TABLE `combination` DISABLE KEYS */;
/*!40000 ALTER TABLE `combination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customschedule`
--

DROP TABLE IF EXISTS `customschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customschedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_id` int NOT NULL,
  `combination_id` int NOT NULL,
  `combination_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `day` int NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `interval` int NOT NULL,
  `mode_on` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `device_id` (`device_id`),
  KEY `combination_id` (`combination_id`),
  CONSTRAINT `customschedule_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`) ON DELETE CASCADE,
  CONSTRAINT `customschedule_ibfk_3` FOREIGN KEY (`combination_id`) REFERENCES `combination` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customschedule`
--

LOCK TABLES `customschedule` WRITE;
/*!40000 ALTER TABLE `customschedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `customschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device`
--

DROP TABLE IF EXISTS `device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device` (
  `id` int NOT NULL,
  `serial` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_id` int DEFAULT NULL,
  `ip_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_type` int DEFAULT NULL,
  `slot_1` int DEFAULT NULL,
  `slot_1_remainingRatio` int DEFAULT NULL,
  `slot_2` int DEFAULT NULL,
  `slot_2_remainingRatio` int DEFAULT NULL,
  `slot_3` int DEFAULT NULL,
  `slot_3_remainingRatio` int DEFAULT NULL,
  `slot_4` int DEFAULT NULL,
  `slot_4_remainingRatio` int DEFAULT NULL,
  `mode` tinyint(1) NOT NULL DEFAULT '0',
  `temperature` float DEFAULT NULL,
  `humidity` int DEFAULT NULL,
  `default_combination` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `serial` (`serial`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `admin_id` (`admin_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `device_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `device_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device`
--

LOCK TABLES `device` WRITE;
/*!40000 ALTER TABLE `device` DISABLE KEYS */;
/*!40000 ALTER TABLE `device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `combination_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `combination_id` (`combination_id`),
  CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorite_ibfk_2` FOREIGN KEY (`combination_id`) REFERENCES `combination` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite`
--

LOCK TABLES `favorite` WRITE;
/*!40000 ALTER TABLE `favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device_id` int NOT NULL,
  `admin_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_nickname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_1_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_1_nickname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_2_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_2_nickname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_3_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_3_nickname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_4_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `member_4_nickname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  KEY `fk_group_member_1_id` (`member_1_id`),
  KEY `fk_group_member_2_id` (`member_2_id`),
  KEY `fk_group_member_3_id` (`member_3_id`),
  KEY `fk_group_member_4_id` (`member_4_id`),
  KEY `device_fk_1_idx` (`device_id`),
  CONSTRAINT `device_fk_1` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_group_member_1_id` FOREIGN KEY (`member_1_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_group_member_2_id` FOREIGN KEY (`member_2_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_group_member_3_id` FOREIGN KEY (`member_3_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_group_member_4_id` FOREIGN KEY (`member_4_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `group_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
/*!40000 ALTER TABLE `group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device_serial` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_mode` tinyint(1) NOT NULL,
  `autoSchedule_id` int DEFAULT NULL,
  `customSchedule_id` int DEFAULT NULL,
  `sprayTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `device_serial` (`device_serial`),
  KEY `user_id` (`user_id`),
  KEY `autoSchedule_id` (`autoSchedule_id`),
  KEY `customSchedule_id` (`customSchedule_id`),
  CONSTRAINT `log_ibfk_1` FOREIGN KEY (`device_serial`) REFERENCES `device` (`serial`) ON DELETE CASCADE,
  CONSTRAINT `log_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `log_ibfk_3` FOREIGN KEY (`autoSchedule_id`) REFERENCES `autoschedule` (`id`) ON DELETE SET NULL,
  CONSTRAINT `log_ibfk_4` FOREIGN KEY (`customSchedule_id`) REFERENCES `customschedule` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img_num` int NOT NULL,
  `social_type` int NOT NULL,
  `gender` int NOT NULL,
  `birth` date NOT NULL,
  `main_device_id` int DEFAULT NULL,
  PRIMARY KEY (`id`,`nickname`),
  UNIQUE KEY `phone_number` (`email`),
  KEY `fk1_idx` (`main_device_id`),
  CONSTRAINT `fk1` FOREIGN KEY (`main_device_id`) REFERENCES `device` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_user_update` AFTER UPDATE ON `user` FOR EACH ROW BEGIN
    -- admin_nickname 업데이트
    UPDATE `group`
    SET admin_nickname = 
        CASE 
            WHEN admin_id IS NULL THEN NULL
            ELSE NEW.nickname
        END
    WHERE admin_id = NEW.id;

    -- member_1_nickname 업데이트
    UPDATE `group`
    SET member_1_nickname = 
        CASE 
            WHEN member_1_id IS NULL THEN NULL
            ELSE NEW.nickname
        END
    WHERE member_1_id = NEW.id;

    -- member_2_nickname 업데이트
    UPDATE `group`
    SET member_2_nickname = 
        CASE 
            WHEN member_2_id IS NULL THEN NULL
            ELSE NEW.nickname
        END
    WHERE member_2_id = NEW.id;

    -- member_3_nickname 업데이트
    UPDATE `group`
    SET member_3_nickname = 
        CASE 
            WHEN member_3_id IS NULL THEN NULL
            ELSE NEW.nickname
        END
    WHERE member_3_id = NEW.id;

    -- member_4_nickname 업데이트
    UPDATE `group`
    SET member_4_nickname = 
        CASE 
            WHEN member_4_id IS NULL THEN NULL
            ELSE NEW.nickname
        END
    WHERE member_4_id = NEW.id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `usersecuinfo`
--

DROP TABLE IF EXISTS `usersecuinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersecuinfo` (
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `salt` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `usersecuinfo_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersecuinfo`
--

LOCK TABLES `usersecuinfo` WRITE;
/*!40000 ALTER TABLE `usersecuinfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `usersecuinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'scentify'
--

--
-- Dumping routines for database 'scentify'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-20 21:49:00
