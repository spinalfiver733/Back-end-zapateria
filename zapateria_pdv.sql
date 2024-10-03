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
USE zapateria_pvd;
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
  `TALLA` varchar(10) DEFAULT NULL,
  `MODELO` varchar(50) DEFAULT NULL,
  `VENDEDOR` varchar(50) DEFAULT NULL,
  `COLOR` varchar(20) DEFAULT NULL,
  `PRECIO` decimal(10,2) DEFAULT NULL,
  `METODO_PAGO` varchar(20) DEFAULT NULL,
  `FECHA_INGRESO` datetime DEFAULT CURRENT_TIMESTAMP,
  `FK_ESTATUS_PRODUCTO` int DEFAULT NULL,
  `MARCA` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`PK_PRODUCTO`),
  KEY `fk_estatus_producto` (`FK_ESTATUS_PRODUCTO`),
  CONSTRAINT `fk_estatus_producto` FOREIGN KEY (`FK_ESTATUS_PRODUCTO`) REFERENCES `estados_producto` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario_info`
--

LOCK TABLES `inventario_info` WRITE;
/*!40000 ALTER TABLE `inventario_info` DISABLE KEYS */;
INSERT INTO `inventario_info` VALUES (64,'22','AIR FORCE 1',NULL,'NEGRO ',250.00,NULL,'2024-10-02 23:25:49',3,'NIKE'),(65,'21','AIR FORCE 1',NULL,'NEGRO ',230.00,NULL,'2024-10-02 23:31:30',3,'NIKE');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes`
--

LOCK TABLES `ordenes` WRITE;
/*!40000 ALTER TABLE `ordenes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordenes` ENABLE KEYS */;
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
  PRIMARY KEY (`PK_VENTA`),
  KEY `fk_ventas_producto` (`FK_PRODUCTO`),
  KEY `FK_ORDEN` (`FK_ORDEN`),
  CONSTRAINT `fk_ventas_producto` FOREIGN KEY (`FK_PRODUCTO`) REFERENCES `inventario_info` (`PK_PRODUCTO`),
  CONSTRAINT `ventas_info_ibfk_1` FOREIGN KEY (`FK_ORDEN`) REFERENCES `ordenes` (`PK_ORDEN`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas_info`
--

LOCK TABLES `ventas_info` WRITE;
/*!40000 ALTER TABLE `ventas_info` DISABLE KEYS */;
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

-- Dump completed on 2024-10-02 18:46:36
