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
-- Table structure for table `devoluciones_info`
--

DROP TABLE IF EXISTS `devoluciones_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devoluciones_info` (
  `PK_DEVOLUCION` int NOT NULL AUTO_INCREMENT,
  `FK_PRODUCTO` int NOT NULL,
  `FK_VENTA` int NOT NULL,
  `FK_VENDEDOR` int NOT NULL,
  `FECHA_DEVOLUCION` datetime DEFAULT CURRENT_TIMESTAMP,
  `MOTIVO` varchar(50) NOT NULL,
  `DESCRIPCION_MOTIVO` text,
  `ESTADO_FINAL` int NOT NULL,
  `OBSERVACIONES` text,
  `TIPO_DEVOLUCION` enum('cambio','saldo_favor') NOT NULL,
  `FK_VENTA_NUEVA` int DEFAULT NULL,
  `DIFERENCIA_PRECIO` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`PK_DEVOLUCION`),
  KEY `FK_PRODUCTO` (`FK_PRODUCTO`),
  KEY `FK_VENTA` (`FK_VENTA`),
  KEY `FK_VENDEDOR` (`FK_VENDEDOR`),
  KEY `FK_VENTA_NUEVA` (`FK_VENTA_NUEVA`),
  CONSTRAINT `devoluciones_info_ibfk_1` FOREIGN KEY (`FK_PRODUCTO`) REFERENCES `inventario_info` (`PK_PRODUCTO`),
  CONSTRAINT `devoluciones_info_ibfk_2` FOREIGN KEY (`FK_VENTA`) REFERENCES `ventas_info` (`PK_VENTA`),
  CONSTRAINT `devoluciones_info_ibfk_3` FOREIGN KEY (`FK_VENDEDOR`) REFERENCES `pdv_usuarios` (`ID_USUARIO`),
  CONSTRAINT `devoluciones_info_ibfk_4` FOREIGN KEY (`FK_VENTA_NUEVA`) REFERENCES `ventas_info` (`PK_VENTA`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devoluciones_info`
--

LOCK TABLES `devoluciones_info` WRITE;
/*!40000 ALTER TABLE `devoluciones_info` DISABLE KEYS */;
INSERT INTO `devoluciones_info` VALUES (72,67,133,2,'2024-11-21 00:36:53','no_gusto','SO',1,'SO','saldo_favor',134,10.00);
/*!40000 ALTER TABLE `devoluciones_info` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Table structure for table `estatus_venta`
--

DROP TABLE IF EXISTS `estatus_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estatus_venta` (
  `PK_ESTATUS` int NOT NULL AUTO_INCREMENT,
  `DESCRIPCION` varchar(100) NOT NULL,
  PRIMARY KEY (`PK_ESTATUS`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estatus_venta`
--

LOCK TABLES `estatus_venta` WRITE;
/*!40000 ALTER TABLE `estatus_venta` DISABLE KEYS */;
INSERT INTO `estatus_venta` VALUES (1,'Finalizada'),(2,'Devolucion');
/*!40000 ALTER TABLE `estatus_venta` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario_info`
--

LOCK TABLES `inventario_info` WRITE;
/*!40000 ALTER TABLE `inventario_info` DISABLE KEYS */;
INSERT INTO `inventario_info` VALUES (67,'NIKE','AIR FORCE 1','ROJO/GRIS','21',250.00,1,'2024-11-19 19:18:35','000001'),(68,'NIKE','SL 72 RS','ROJO','35',260.00,2,'2024-11-19 19:18:35','000002'),(69,'NIKE','SL 72 RS','VERDE FOSFORESCENTE','35',240.00,1,'2024-11-19 19:18:35','000003');
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
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes`
--

LOCK TABLES `ordenes` WRITE;
/*!40000 ALTER TABLE `ordenes` DISABLE KEYS */;
INSERT INTO `ordenes` VALUES (127,'2024-11-21 00:36:26','2',2,'SO',250.00),(128,'2024-11-21 00:37:15','2',2,'SO',260.00);
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
-- Table structure for table `saldos_favor`
--

DROP TABLE IF EXISTS `saldos_favor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saldos_favor` (
  `PK_SALDO` int NOT NULL AUTO_INCREMENT,
  `FK_DEVOLUCION` int NOT NULL,
  `CODIGO_UNICO` varchar(10) NOT NULL,
  `MONTO` decimal(10,2) NOT NULL,
  `ESTADO` enum('activo','usado','cancelado') DEFAULT 'activo',
  `FECHA_CREACION` datetime DEFAULT CURRENT_TIMESTAMP,
  `FK_VENTA_USO` int DEFAULT NULL,
  PRIMARY KEY (`PK_SALDO`),
  UNIQUE KEY `CODIGO_UNICO` (`CODIGO_UNICO`),
  KEY `FK_DEVOLUCION` (`FK_DEVOLUCION`),
  KEY `FK_VENTA_USO` (`FK_VENTA_USO`),
  CONSTRAINT `saldos_favor_ibfk_1` FOREIGN KEY (`FK_DEVOLUCION`) REFERENCES `devoluciones_info` (`PK_DEVOLUCION`),
  CONSTRAINT `saldos_favor_ibfk_2` FOREIGN KEY (`FK_VENTA_USO`) REFERENCES `ventas_info` (`PK_VENTA`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saldos_favor`
--

LOCK TABLES `saldos_favor` WRITE;
/*!40000 ALTER TABLE `saldos_favor` DISABLE KEYS */;
/*!40000 ALTER TABLE `saldos_favor` ENABLE KEYS */;
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
  `FK_ESTATUS_VENTA` int DEFAULT NULL,
  PRIMARY KEY (`PK_VENTA`),
  KEY `FK_ORDEN` (`FK_ORDEN`),
  KEY `fk_ventas_producto` (`FK_PRODUCTO`),
  KEY `fk_vendedor_pdv_usuarios` (`VENDEDOR`),
  CONSTRAINT `fk_vendedor_pdv_usuarios` FOREIGN KEY (`VENDEDOR`) REFERENCES `pdv_usuarios` (`ID_USUARIO`),
  CONSTRAINT `fk_ventas_producto` FOREIGN KEY (`FK_PRODUCTO`) REFERENCES `inventario_info` (`PK_PRODUCTO`),
  CONSTRAINT `ventas_info_ibfk_1` FOREIGN KEY (`FK_ORDEN`) REFERENCES `ordenes` (`PK_ORDEN`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas_info`
--

LOCK TABLES `ventas_info` WRITE;
/*!40000 ALTER TABLE `ventas_info` DISABLE KEYS */;
INSERT INTO `ventas_info` VALUES (133,'21','AIR FORCE 1',2,'ROJO/GRIS',250.00,'2','2024-11-21 00:36:26','SO',67,127,'NIKE',2),(134,'35','SL 72 RS',2,'ROJO',260.00,'2','2024-11-21 00:37:15','SO',68,128,'NIKE',1);
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

-- Dump completed on 2024-11-20 18:42:30
