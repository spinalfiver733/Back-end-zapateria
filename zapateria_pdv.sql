CREATE DATABASE  IF NOT EXISTS `zapateria_pvd` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `zapateria_pvd`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: zapateria_pvd
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `estados_producto`
--

DROP TABLE IF EXISTS `estados_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_producto` (
  `id_estado` int NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados_producto`
--

LOCK TABLES `estados_producto` WRITE;
/*!40000 ALTER TABLE `estados_producto` DISABLE KEYS */;
INSERT INTO `estados_producto` VALUES (0,'Dado de baja'),(1,'En inventario'),(2,'Vendido'),(3,'En venta');
/*!40000 ALTER TABLE `estados_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario_info`
--

DROP TABLE IF EXISTS `inventario_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario_info` (
  `PK_PRODUCTO` int NOT NULL AUTO_INCREMENT,
  `MARCA` varchar(100) DEFAULT NULL,
  `MODELO` varchar(50) DEFAULT NULL,
  `COLOR` varchar(20) DEFAULT NULL,
  `TALLA` varchar(10) DEFAULT NULL,
  `PRECIO` decimal(10,2) DEFAULT NULL,
  `FK_ESTATUS_PRODUCTO` int DEFAULT NULL,
  `FECHA_INGRESO` datetime DEFAULT NULL,
  `CODIGO_BARRA` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PK_PRODUCTO`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario_info`
--

LOCK TABLES `inventario_info` WRITE;
/*!40000 ALTER TABLE `inventario_info` DISABLE KEYS */;
INSERT INTO `inventario_info` VALUES (1,'Nike','Air Max','Negro','21',129.99,2,'2024-10-01 10:00:00','000001'),(2,'Adidas','Ultraboost','Blanco','22',159.99,2,'2024-10-02 11:30:00','000002'),(3,'Puma','Suede Classic','Azul','23',79.99,2,'2024-10-03 09:15:00','000003'),(4,'Reebok','Classic Leather','Gris','21',89.99,2,'2024-10-04 14:45:00','000004'),(5,'New Balance','574','Verde','22',99.99,2,'2024-10-05 16:20:00','000005'),(6,'Converse','Chuck Taylor','Rojo','23',69.99,2,'2024-10-06 12:00:00','000006'),(7,'Vans','Old Skool','Negro','21',59.99,2,'2024-10-07 10:30:00','000007'),(8,'Under Armour','HOVR','Blanco','24',119.99,2,'2024-10-08 15:00:00','000008'),(9,'Asics','Gel-Nimbus','Azul','25',149.99,2,'2024-10-09 11:45:00','000009'),(10,'Skechers','D\'Lites','Rosa','21',74.99,2,'2024-10-10 13:30:00','000010'),(11,'Nike','Air Max','Negro','22',150.99,2,'2024-10-05 00:44:19','000011'),(12,'ADIDAS','AIR MAX','NEGRO','22',2500.00,2,'2024-10-07 16:55:15','000012'),(13,'NIKE','AIR MAX','ROJO','36',2500.00,2,'2024-10-07 16:55:25','000013'),(14,'ADIDAS','AIR FORCE 1','NEGRO','21',2500.00,2,'2024-10-09 00:49:48','000014'),(15,'NIKE','AIR FORCE 1','NEGRO','37',1090.00,2,'2024-10-09 19:48:34','000015'),(16,'Nike','Air Max','Negro','28',129.99,2,'2024-10-14 09:00:00','000016'),(17,'Adidas','Superstar','Blanco','24.5',89.99,2,'2024-10-14 09:15:00','000017'),(18,'Puma','Suede','Azul','30',79.99,2,'2024-10-14 09:30:00','000018'),(19,'Reebok','Classic','Gris','27.5',69.99,2,'2024-10-14 09:45:00','000019'),(20,'Converse','Chuck Taylor','Rojo','23',59.99,1,'2024-10-14 10:00:00','000020'),(21,'Vans','Old Skool','Negro','31.5',74.99,2,'2024-10-14 10:15:00','000021'),(22,'New Balance','574','Verde','26',99.99,1,'2024-10-14 10:30:00','000022'),(23,'Asics','Gel-Lyte','Blanco','32',109.99,1,'2024-10-14 10:45:00','000023'),(24,'Skechers','D\'Lites','Rosa','20.5',64.99,1,'2024-10-14 11:00:00','000024'),(25,'Under Armour','HOVR','Gris','29',119.99,1,'2024-10-14 11:15:00','000025'),(26,'Nike','React','Azul','27.5',139.99,1,'2024-10-14 11:30:00','000026'),(27,'Adidas','Ultra Boost','Negro','31',179.99,1,'2024-10-14 11:45:00','000027'),(28,'Puma','RS-X','Blanco','22',109.99,1,'2024-10-14 12:00:00','000028'),(29,'Reebok','Zig Kinetica','Naranja','30.5',129.99,1,'2024-10-14 12:15:00','000029'),(30,'Converse','One Star','Amarillo','25',69.99,1,'2024-10-14 12:30:00','000030'),(31,'Vans','Sk8-Hi','Negro','24.5',84.99,1,'2024-10-14 12:45:00','000031'),(32,'New Balance','990','Gris','28',174.99,1,'2024-10-14 13:00:00','000032'),(33,'Asics','Nimbus','Azul','26.5',149.99,1,'2024-10-14 13:15:00','000033'),(34,'Skechers','Go Walk','Negro','19',54.99,1,'2024-10-14 13:30:00','000034'),(35,'Under Armour','Charged','Rojo','32',89.99,1,'2024-10-14 13:45:00','000035'),(36,'Nike','Zoom','Verde','21.5',119.99,1,'2024-10-14 14:00:00','000036'),(37,'Adidas','NMD','Gris','29.5',159.99,1,'2024-10-14 14:15:00','000037'),(38,'Puma','Future Rider','Amarillo','23.5',89.99,1,'2024-10-14 14:30:00','000038'),(39,'Reebok','Nano','Negro','28',109.99,1,'2024-10-14 14:45:00','000039'),(40,'Converse','Pro Leather','Blanco','26',79.99,1,'2024-10-14 15:00:00','000040'),(41,'Vans','Era','Azul','25.5',64.99,1,'2024-10-14 15:15:00','000041'),(42,'New Balance','Fresh Foam','Rojo','30',129.99,1,'2024-10-14 15:30:00','000042'),(43,'Asics','GT-2000','Negro','27',139.99,2,'2024-10-14 15:45:00','000043'),(44,'Skechers','Arch Fit','Gris','22.5',74.99,1,'2024-10-14 16:00:00','000044'),(45,'Under Armour','Project Rock','Naranja','31.5',149.99,1,'2024-10-14 16:15:00','000045'),(46,'NIKE','AIR FORCE 1','NEGRO','35',2500.00,1,'2024-10-16 23:41:59','000046'),(47,'Nike','SL 72 RS','ROJO/GRIS','22',2500.00,1,'2024-10-16 23:43:00','000047');
/*!40000 ALTER TABLE `inventario_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodos_pago`
--

DROP TABLE IF EXISTS `metodos_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodos_pago` (
  `PK_METODO` int NOT NULL AUTO_INCREMENT,
  `DESCRIPCION_METODO` varchar(50) NOT NULL,
  PRIMARY KEY (`PK_METODO`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodos_pago`
--

LOCK TABLES `metodos_pago` WRITE;
/*!40000 ALTER TABLE `metodos_pago` DISABLE KEYS */;
INSERT INTO `metodos_pago` VALUES (1,'Efectivo'),(2,'Tarjeta'),(3,'Ambos');
/*!40000 ALTER TABLE `metodos_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordenes`
--

DROP TABLE IF EXISTS `ordenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenes` (
  `PK_ORDEN` int NOT NULL AUTO_INCREMENT,
  `FECHA_ORDEN` datetime NOT NULL,
  `VENDEDOR` varchar(50) DEFAULT NULL,
  `METODO_PAGO` int DEFAULT NULL,
  `OBSERVACIONES` text,
  `TOTAL` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`PK_ORDEN`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes`
--

LOCK TABLES `ordenes` WRITE;
/*!40000 ALTER TABLE `ordenes` DISABLE KEYS */;
INSERT INTO `ordenes` VALUES (15,'2024-10-07 16:37:30','Vendedor 2',1,'El zapato contaba con 2 rasguños',129.99),(16,'2024-10-07 16:38:54','Vendedor 2',2,'Sin observaciones',159.99),(17,'2024-10-09 22:20:21','Vendedor 1',1,'SO',179.98),(18,'2024-10-09 22:37:28','Vendedor 1',1,'SO',59.99),(19,'2024-10-10 21:26:26','Vendedor 1',2,'SO',3590.00),(20,'2024-10-10 23:16:15','Vendedor 1',1,'SO',119.99),(21,'2024-10-11 17:05:10','Vendedor 1',1,'SO',69.99),(22,'2024-10-11 18:36:15','Vendedor 1',1,'SO',74.99),(23,'2024-10-11 18:37:30','Vendedor 1',1,'SO',2650.99),(24,'2024-10-14 18:58:47','1',1,'SO',2589.99),(25,'2024-10-15 23:51:34','6',2,'El nuevo vendedor es Alan',129.99),(26,'2024-10-16 00:11:43','2',2,'SO',79.99),(27,'2024-10-16 00:16:07','2',2,'SO',69.99),(28,'2024-10-16 00:16:31','1',2,'SO',149.99),(29,'2024-10-17 00:10:38','2',2,'SO',139.99),(30,'2024-10-17 00:15:35','1',2,'SO',74.99);
/*!40000 ALTER TABLE `ordenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pdv_roles`
--

DROP TABLE IF EXISTS `pdv_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pdv_roles` (
  `ID_ROL` int NOT NULL AUTO_INCREMENT,
  `DESCRIPCION_ROL` varchar(50) NOT NULL,
  PRIMARY KEY (`ID_ROL`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pdv_roles`
--

LOCK TABLES `pdv_roles` WRITE;
/*!40000 ALTER TABLE `pdv_roles` DISABLE KEYS */;
INSERT INTO `pdv_roles` VALUES (1,'Administrador'),(2,'Vendedor');
/*!40000 ALTER TABLE `pdv_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pdv_usuarios`
--

DROP TABLE IF EXISTS `pdv_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pdv_usuarios` (
  `ID_USUARIO` int NOT NULL AUTO_INCREMENT,
  `FK_ROL_USUARIO` int NOT NULL,
  `NOMBRE_USUARIO` varchar(100) NOT NULL,
  `PATERNO_USUARIO` varchar(100) NOT NULL,
  `MATERNO_USUARIO` varchar(100) DEFAULT NULL,
  `NUMERO_USUARIO` varchar(20) NOT NULL,
  PRIMARY KEY (`ID_USUARIO`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pdv_usuarios`
--

LOCK TABLES `pdv_usuarios` WRITE;
/*!40000 ALTER TABLE `pdv_usuarios` DISABLE KEYS */;
INSERT INTO `pdv_usuarios` VALUES (1,1,'Nora Elizabeth','Ortiz','Gonzalez','5518772960'),(2,1,'Luis Enrique ','Vazquez','Ortiz','5518772960'),(3,1,'Luis Daniel ','Vazquez ','Ortiz','5624848986'),(6,1,'Luis Alan ','Vazquez','Ortiz','5525015563'),(8,2,'Sandra','Estrella','Juarez','5534585156');
/*!40000 ALTER TABLE `pdv_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas_info`
--

DROP TABLE IF EXISTS `ventas_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas_info` (
  `PK_VENTA` int NOT NULL AUTO_INCREMENT,
  `TALLA` varchar(10) DEFAULT NULL,
  `MODELO` varchar(50) DEFAULT NULL,
  `VENDEDOR` int DEFAULT NULL,
  `COLOR` varchar(20) DEFAULT NULL,
  `PRECIO` decimal(10,2) DEFAULT NULL,
  `METODO_PAGO` varchar(20) DEFAULT NULL,
  `FECHA_VENTA` datetime DEFAULT NULL,
  `OBSERVACIONES` varchar(200) DEFAULT NULL,
  `FK_PRODUCTO` int DEFAULT NULL,
  `FK_ORDEN` int DEFAULT NULL,
  `MARCA` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`PK_VENTA`),
  KEY `FK_ORDEN` (`FK_ORDEN`),
  KEY `fk_ventas_producto` (`FK_PRODUCTO`),
  KEY `fk_vendedor_pdv_usuarios` (`VENDEDOR`),
  CONSTRAINT `fk_vendedor_pdv_usuarios` FOREIGN KEY (`VENDEDOR`) REFERENCES `pdv_usuarios` (`ID_USUARIO`),
  CONSTRAINT `fk_ventas_producto` FOREIGN KEY (`FK_PRODUCTO`) REFERENCES `inventario_info` (`PK_PRODUCTO`),
  CONSTRAINT `ventas_info_ibfk_1` FOREIGN KEY (`FK_ORDEN`) REFERENCES `ordenes` (`PK_ORDEN`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas_info`
--

LOCK TABLES `ventas_info` WRITE;
/*!40000 ALTER TABLE `ventas_info` DISABLE KEYS */;
INSERT INTO `ventas_info` VALUES (16,'21','Air Max',1,'Negro',129.99,'1','2024-10-07 16:37:30','El zapato contaba con 2 rasguños',1,15,'Nike'),(17,'22','Ultraboost',1,'Blanco',159.99,'2','2024-10-07 16:38:54','Sin observaciones',2,16,'Adidas'),(18,'22','574',1,'Verde',99.99,'1','2024-10-09 22:20:21','SO',5,17,'New Balance'),(19,'23','Suede Classic',2,'Azul',79.99,'1','2024-10-09 22:20:21','SO',3,17,'Puma'),(20,'21','Old Skool',1,'Negro',59.99,'1','2024-10-09 22:37:28','SO',7,18,'Vans'),(21,'37','AIR FORCE 1',1,'NEGRO',1090.00,'2','2024-10-10 21:26:26','SO',15,19,'NIKE'),(22,'36','AIR MAX',2,'ROJO',2500.00,'2','2024-10-10 21:26:26','Se relizó el pago con tarjeta',13,19,'NIKE'),(23,'24','HOVR',1,'Blanco',119.99,'1','2024-10-10 23:16:15','SO',8,20,'Under Armour'),(24,'23','Chuck Taylor',2,'Rojo',69.99,'1','2024-10-11 17:05:10','SO',6,21,'Converse'),(25,'21','D\'Lites',1,'Rosa',74.99,'1','2024-10-11 18:36:15','SO',10,22,'Skechers'),(26,'21','AIR FORCE 1',1,'NEGRO',2500.00,'1','2024-10-11 18:37:30','SO',14,23,'ADIDAS'),(27,'22','Air Max',1,'Negro',150.99,'1','2024-10-11 18:37:30','SO',11,23,'Nike'),(28,'22','AIR MAX',1,'NEGRO',2500.00,'1','2024-10-14 18:58:48','SO',12,24,'ADIDAS'),(29,'24.5','Superstar',1,'Blanco',89.99,'1','2024-10-14 18:58:48','SO',17,24,'Adidas'),(30,'28','Air Max',6,'Negro',129.99,'2','2024-10-15 23:51:34','El nuevo vendedor es Alan',16,25,'Nike'),(31,'30','Suede',2,'Azul',79.99,'2','2024-10-16 00:11:43','SO',18,26,'Puma'),(32,'27.5','Classic',2,'Gris',69.99,'2','2024-10-16 00:16:07','SO',19,27,'Reebok'),(33,'25','Gel-Nimbus',1,'Azul',149.99,'2','2024-10-16 00:16:31','SO',9,28,'Asics'),(34,'27','GT-2000',2,'Negro',139.99,'2','2024-10-17 00:10:38','SO',43,29,'Asics'),(35,'31.5','Old Skool',1,'Negro',74.99,'2','2024-10-17 00:15:35','SO',21,30,'Vans');
/*!40000 ALTER TABLE `ventas_info` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-16 18:35:06
