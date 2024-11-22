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
-- Dumping data for table `devoluciones_info`
--

LOCK TABLES `devoluciones_info` WRITE;
/*!40000 ALTER TABLE `devoluciones_info` DISABLE KEYS */;
INSERT INTO `devoluciones_info` VALUES (75,67,142,2,'2024-11-22 00:38:06','no_talla','Sin descripción adicional',1,'El producto es de otra talla','saldo_favor',143,-10.00);
/*!40000 ALTER TABLE `devoluciones_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `estados_producto`
--

LOCK TABLES `estados_producto` WRITE;
/*!40000 ALTER TABLE `estados_producto` DISABLE KEYS */;
INSERT INTO `estados_producto` VALUES (0,'Dado de baja'),(1,'En inventario'),(2,'Vendido'),(3,'En venta');
/*!40000 ALTER TABLE `estados_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `estatus_venta`
--

LOCK TABLES `estatus_venta` WRITE;
/*!40000 ALTER TABLE `estatus_venta` DISABLE KEYS */;
INSERT INTO `estatus_venta` VALUES (1,'Finalizada'),(2,'Devolucion');
/*!40000 ALTER TABLE `estatus_venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `inventario_info`
--

LOCK TABLES `inventario_info` WRITE;
/*!40000 ALTER TABLE `inventario_info` DISABLE KEYS */;
INSERT INTO `inventario_info` VALUES (67,'NIKE','AIR FORCE 1','ROJO/GRIS','21',250.00,1,'2024-11-19 19:18:35','000001'),(68,'NIKE','SL 72 RS','ROJO','35',260.00,1,'2024-11-19 19:18:35','000002'),(69,'NIKE','SL 72 RS','VERDE FOSFORESCENTE','35',240.00,2,'2024-11-19 19:18:35','000003'),(70,'REEBOK','NPM1','ROJO/GRIS','37',350.00,1,'2024-11-21 18:23:54','000004'),(71,'NIKE','AIR FORCE 1','ROJO/GRIS','21.5',230.00,2,'2024-11-21 19:43:33','000005');
/*!40000 ALTER TABLE `inventario_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `metodos_pago`
--

LOCK TABLES `metodos_pago` WRITE;
/*!40000 ALTER TABLE `metodos_pago` DISABLE KEYS */;
INSERT INTO `metodos_pago` VALUES (1,'Efectivo'),(2,'Tarjeta'),(3,'Ambos');
/*!40000 ALTER TABLE `metodos_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ordenes`
--

LOCK TABLES `ordenes` WRITE;
/*!40000 ALTER TABLE `ordenes` DISABLE KEYS */;
INSERT INTO `ordenes` VALUES (136,'2024-11-22 00:28:37','2',1,'SO',250.00),(137,'2024-11-22 00:39:12','2',2,'SO',240.00),(138,'2024-11-22 00:42:20','2',2,'so',230.00);
/*!40000 ALTER TABLE `ordenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `pdv_roles`
--

LOCK TABLES `pdv_roles` WRITE;
/*!40000 ALTER TABLE `pdv_roles` DISABLE KEYS */;
INSERT INTO `pdv_roles` VALUES (1,'Administrador'),(2,'Vendedor');
/*!40000 ALTER TABLE `pdv_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `pdv_usuarios`
--

LOCK TABLES `pdv_usuarios` WRITE;
/*!40000 ALTER TABLE `pdv_usuarios` DISABLE KEYS */;
INSERT INTO `pdv_usuarios` VALUES (1,1,'Nora Elizabeth','Ortiz','Gonzalez','5518772960',0),(2,1,'Luis Enrique ','Vazquez','Ortiz','5518772960',1),(3,1,'Luis Daniel ','Vazquez ','Ortiz','5624848986',1),(6,1,'Luis Alan ','Vazquez','Ortiz','5525015563',1),(8,2,'Sandra','Estrella','Juarez','5534585156',0),(9,2,'Evelyn','Gonzalez','Trejo','5512345678',0);
/*!40000 ALTER TABLE `pdv_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `saldos_favor`
--

LOCK TABLES `saldos_favor` WRITE;
/*!40000 ALTER TABLE `saldos_favor` DISABLE KEYS */;
INSERT INTO `saldos_favor` VALUES (18,75,'JXOFH6II',10.00,'usado','2024-11-22 00:39:13',NULL,1);
/*!40000 ALTER TABLE `saldos_favor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ventas_info`
--

LOCK TABLES `ventas_info` WRITE;
/*!40000 ALTER TABLE `ventas_info` DISABLE KEYS */;
INSERT INTO `ventas_info` VALUES (142,'21','AIR FORCE 1',2,'ROJO/GRIS',250.00,'1','2024-11-22 00:28:37','SO',67,136,'NIKE',2),(143,'35','SL 72 RS',2,'VERDE FOSFORESCENTE',240.00,'2','2024-11-22 00:39:12','SO',69,137,'NIKE',1),(144,'21.5','AIR FORCE 1',2,'ROJO/GRIS',230.00,'2','2024-11-22 00:42:20','so',71,138,'NIKE',1);
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

-- Dump completed on 2024-11-22 17:52:55
