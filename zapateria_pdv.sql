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
  PRIMARY KEY (`PK_PRODUCTO`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario_info`
--

LOCK TABLES `inventario_info` WRITE;
/*!40000 ALTER TABLE `inventario_info` DISABLE KEYS */;
INSERT INTO `inventario_info` VALUES (1,'Nike','Air Max','Negro','21',129.99,2,'2024-10-01 10:00:00'),(2,'Adidas','Ultraboost','Blanco','22',159.99,2,'2024-10-02 11:30:00'),(3,'Puma','Suede Classic','Azul','23',79.99,2,'2024-10-03 09:15:00'),(4,'Reebok','Classic Leather','Gris','21',89.99,2,'2024-10-04 14:45:00'),(5,'New Balance','574','Verde','22',99.99,2,'2024-10-05 16:20:00'),(6,'Converse','Chuck Taylor','Rojo','23',69.99,2,'2024-10-06 12:00:00'),(7,'Vans','Old Skool','Negro','21',59.99,2,'2024-10-07 10:30:00'),(8,'Under Armour','HOVR','Blanco','24',119.99,2,'2024-10-08 15:00:00'),(9,'Asics','Gel-Nimbus','Azul','25',149.99,3,'2024-10-09 11:45:00'),(10,'Skechers','D\'Lites','Rosa','21',74.99,2,'2024-10-10 13:30:00'),(11,'Nike','Air Max','Negro','22',150.99,2,'2024-10-05 00:44:19'),(12,'ADIDAS','AIR MAX','NEGRO','22',2500.00,3,'2024-10-07 16:55:15'),(13,'NIKE','AIR MAX','ROJO','36',2500.00,2,'2024-10-07 16:55:25'),(14,'ADIDAS','AIR FORCE 1','NEGRO','21',2500.00,2,'2024-10-09 00:49:48'),(15,'NIKE','AIR FORCE 1','NEGRO','37',1090.00,2,'2024-10-09 19:48:34');
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes`
--

LOCK TABLES `ordenes` WRITE;
/*!40000 ALTER TABLE `ordenes` DISABLE KEYS */;
INSERT INTO `ordenes` VALUES (15,'2024-10-07 16:37:30','Vendedor 2',1,'El zapato contaba con 2 rasguños',129.99),(16,'2024-10-07 16:38:54','Vendedor 2',2,'Sin observaciones',159.99),(17,'2024-10-09 22:20:21','Vendedor 1',1,'SO',179.98),(18,'2024-10-09 22:37:28','Vendedor 1',1,'SO',59.99),(19,'2024-10-10 21:26:26','Vendedor 1',2,'SO',3590.00),(20,'2024-10-10 23:16:15','Vendedor 1',1,'SO',119.99),(21,'2024-10-11 17:05:10','Vendedor 1',1,'SO',69.99),(22,'2024-10-11 18:36:15','Vendedor 1',1,'SO',74.99),(23,'2024-10-11 18:37:30','Vendedor 1',1,'SO',2650.99);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pdv_usuarios`
--

LOCK TABLES `pdv_usuarios` WRITE;
/*!40000 ALTER TABLE `pdv_usuarios` DISABLE KEYS */;
INSERT INTO `pdv_usuarios` VALUES (1,1,'Nora Elizabeth','Ortiz','Gonzalez','5518772960'),(2,1,'Luis Enrique ','Vazquez','Ortiz','5518772960'),(3,1,'Luis Daniel ','Vazquez ','Ortiz','5624848986'),(6,1,'Luis Alan ','Vazquez','Ortiz','5525015563');
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
  `VENDEDOR` varchar(50) DEFAULT NULL,
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
  CONSTRAINT `fk_ventas_producto` FOREIGN KEY (`FK_PRODUCTO`) REFERENCES `inventario_info` (`PK_PRODUCTO`),
  CONSTRAINT `ventas_info_ibfk_1` FOREIGN KEY (`FK_ORDEN`) REFERENCES `ordenes` (`PK_ORDEN`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas_info`
--

LOCK TABLES `ventas_info` WRITE;
/*!40000 ALTER TABLE `ventas_info` DISABLE KEYS */;
INSERT INTO `ventas_info` VALUES (16,'21','Air Max','1','Negro',129.99,'1','2024-10-07 16:37:30','El zapato contaba con 2 rasguños',1,15,'Nike'),(17,'22','Ultraboost','1','Blanco',159.99,'2','2024-10-07 16:38:54','Sin observaciones',2,16,'Adidas'),(18,'22','574','1','Verde',99.99,'1','2024-10-09 22:20:21','SO',5,17,'New Balance'),(19,'23','Suede Classic','2','Azul',79.99,'1','2024-10-09 22:20:21','SO',3,17,'Puma'),(20,'21','Old Skool','1','Negro',59.99,'1','2024-10-09 22:37:28','SO',7,18,'Vans'),(21,'37','AIR FORCE 1','1','NEGRO',1090.00,'2','2024-10-10 21:26:26','SO',15,19,'NIKE'),(22,'36','AIR MAX','2','ROJO',2500.00,'2','2024-10-10 21:26:26','Se relizó el pago con tarjeta',13,19,'NIKE'),(23,'24','HOVR','1','Blanco',119.99,'1','2024-10-10 23:16:15','SO',8,20,'Under Armour'),(24,'23','Chuck Taylor','2','Rojo',69.99,'1','2024-10-11 17:05:10','SO',6,21,'Converse'),(25,'21','D\'Lites','1','Rosa',74.99,'1','2024-10-11 18:36:15','SO',10,22,'Skechers'),(26,'21','AIR FORCE 1','1','NEGRO',2500.00,'1','2024-10-11 18:37:30','SO',14,23,'ADIDAS'),(27,'22','Air Max','1','Negro',150.99,'1','2024-10-11 18:37:30','SO',11,23,'Nike');
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

-- Dump completed on 2024-10-11 13:48:49
