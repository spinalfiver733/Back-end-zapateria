-- Actualizar el estado en inventario_info

SET SQL_SAFE_UPDATES = 0;

-- Borrar los datos en las tablas en el orden correcto
DELETE FROM saldos_favor;

DELETE FROM devoluciones_info;

DELETE FROM saldos_favor;

DELETE FROM ventas_info;

DELETE FROM ordenes;

DELETE FROM inventario_info;


