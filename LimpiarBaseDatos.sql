-- Actualizar el estado en inventario_info

SET SQL_SAFE_UPDATES = 0;

UPDATE inventario_info
SET FK_ESTATUS_PRODUCTO = 1;

-- Borrar los datos en las tablas en el orden correcto
DELETE FROM saldos_favor;

DELETE FROM devoluciones_info;

DELETE FROM saldos_favor;

DELETE FROM ventas_info;

DELETE FROM ordenes;

DELETE FROM inventario_info;


