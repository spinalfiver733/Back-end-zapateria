// routes/codigoBarras.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');
const InventarioInfo = require('../models/InventarioInfo');

// Obtener el último código de barras
router.get('/ultimo-codigo', async (req, res) => {
  try {
    // Buscar el código de barras más alto en la base de datos
    const ultimoProducto = await InventarioInfo.findOne({
      attributes: ['CODIGO_BARRA'],
      order: [['CODIGO_BARRA', 'DESC']],
      where: {
        CODIGO_BARRA: {
          [Op.regexp]: '^[0-9]{6}$' // Aseguramos que tenga formato de 6 dígitos
        }
      }
    });

    let ultimoCodigo = 0;
    if (ultimoProducto && ultimoProducto.CODIGO_BARRA) {
      // Convertir el código de string a número
      ultimoCodigo = parseInt(ultimoProducto.CODIGO_BARRA);
    }

    res.json({
      success: true,
      ultimoCodigo: String(ultimoCodigo).padStart(6, '0')
    });
  } catch (error) {
    console.error('Error al obtener el último código de barras:', error);
    res.status(500).json({
      success: false,
      error: 'Error al consultar la base de datos'
    });
  }
});

// Encontrar códigos disponibles (incluyendo huecos en la secuencia)
router.get('/codigos-disponibles/:cantidad', async (req, res) => {
  try {
    const cantidadSolicitada = parseInt(req.params.cantidad);
    
    if (isNaN(cantidadSolicitada) || cantidadSolicitada < 1) {
      return res.status(400).json({
        success: false,
        error: 'Cantidad inválida de códigos solicitados'
      });
    }
    
    // Obtener todos los códigos existentes ordenados
    const productos = await InventarioInfo.findAll({
      attributes: ['CODIGO_BARRA'],
      where: {
        CODIGO_BARRA: {
          [Op.regexp]: '^[0-9]{6}$' // Aseguramos que tenga formato de 6 dígitos
        }
      },
      order: [['CODIGO_BARRA', 'ASC']]
    });
    
    // Convertir los códigos a números para trabajar más fácilmente
    const codigosExistentes = productos.map(p => parseInt(p.CODIGO_BARRA));
    
    // Encontrar huecos en la secuencia
    const codigosDisponibles = [];
    let ultimoCodigo = 0;
    
    // Si no hay códigos existentes, empezamos desde 1
    if (codigosExistentes.length === 0) {
      for (let i = 1; i <= cantidadSolicitada; i++) {
        codigosDisponibles.push(i);
      }
    } else {
      // Buscar huecos en la secuencia existente
      ultimoCodigo = codigosExistentes[codigosExistentes.length - 1];
      
      // Primero buscamos huecos
      let huecos = [];
      for (let i = 1; i < codigosExistentes.length; i++) {
        const actual = codigosExistentes[i];
        const anterior = codigosExistentes[i-1];
        
        // Si hay un hueco, agregar todos los valores intermedios
        if (actual - anterior > 1) {
          for (let j = anterior + 1; j < actual; j++) {
            huecos.push(j);
          }
        }
      }
      
      // Si hay suficientes huecos, usar esos
      if (huecos.length >= cantidadSolicitada) {
        codigosDisponibles.push(...huecos.slice(0, cantidadSolicitada));
      } 
      // Si no hay suficientes huecos, usar los huecos disponibles y continuar la secuencia
      else {
        // Agregar todos los huecos encontrados
        codigosDisponibles.push(...huecos);
        
        // Calcular cuántos códigos adicionales necesitamos
        const codigosFaltantes = cantidadSolicitada - huecos.length;
        
        // Continuar la secuencia desde el último código
        for (let i = 1; i <= codigosFaltantes; i++) {
          codigosDisponibles.push(ultimoCodigo + i);
        }
      }
    }
    
    // Convertir los códigos numéricos a formato de 6 dígitos
    const codigosFormateados = codigosDisponibles.map(codigo => 
      String(codigo).padStart(6, '0')
    );
    
    res.json({
      success: true,
      codigosDisponibles: codigosFormateados
    });
  } catch (error) {
    console.error('Error al buscar códigos disponibles:', error);
    res.status(500).json({
      success: false,
      error: 'Error al consultar la base de datos'
    });
  }
});

// Verificar si un rango de códigos está disponible
router.post('/verificar-disponibilidad', async (req, res) => {
  try {
    const { inicio, fin } = req.body;
    
    // Verificar si algún código en el rango ya existe
    const codigosExistentes = await InventarioInfo.findAll({
      attributes: ['CODIGO_BARRA'],
      where: {
        CODIGO_BARRA: {
          [Op.between]: [String(inicio).padStart(6, '0'), String(fin).padStart(6, '0')]
        }
      }
    });

    res.json({
      success: true,
      disponible: codigosExistentes.length === 0,
      codigosExistentes: codigosExistentes.map(item => item.CODIGO_BARRA)
    });
  } catch (error) {
    console.error('Error al verificar disponibilidad de códigos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al consultar la base de datos'
    });
  }
});
// Función para verificar si una impresora específica existe y está disponible
async function verificarImpresora(nombreImpresora) {
  try {
    console.log(`🔍 Verificando impresora: ${nombreImpresora}`);
    
    // Comando para listar impresoras en Windows
    const { stdout, stderr } = await execPromise('wmic printer list brief');
    
    if (stderr) {
      console.warn('⚠️ Advertencia al listar impresoras:', stderr);
    }
    
    // Verificar si la impresora existe en la lista
    const impresoras = stdout.toLowerCase();
    const nombreBuscar = nombreImpresora.toLowerCase();
    
    if (impresoras.includes(nombreBuscar)) {
      console.log(`✅ Impresora "${nombreImpresora}" encontrada en el sistema`);
      
      // Verificar estado específico de la impresora
      const estadoCmd = `wmic printer where name="${nombreImpresora}" get Status,WorkOffline,PrinterStatus /format:list`;
      
      try {
        const { stdout: estadoOutput } = await execPromise(estadoCmd);
        console.log('📊 Estado de la impresora:', estadoOutput);
        
        const offline = estadoOutput.toLowerCase().includes('workoffline=true');
        const error = estadoOutput.toLowerCase().includes('error');
        
        return {
          existe: true,
          disponible: !offline && !error,
          offline: offline,
          detalles: estadoOutput
        };
      } catch (estadoError) {
        console.warn('⚠️ No se pudo obtener estado detallado:', estadoError.message);
        return { existe: true, disponible: true, detalles: 'Estado no disponible' };
      }
    } else {
      console.log(`❌ Impresora "${nombreImpresora}" no encontrada`);
      console.log('📝 Impresoras disponibles:');
      
      // Mostrar lista de impresoras disponibles
      const lineas = stdout.split('\n');
      lineas.forEach(linea => {
        if (linea.includes('Name=') && linea.trim() !== '') {
          const nombre = linea.split('Name=')[1]?.split('|')[0]?.trim();
          if (nombre) console.log(`  - ${nombre}`);
        }
      });
      
      return { existe: false, disponible: false, detalles: 'Impresora no encontrada' };
    }
  } catch (error) {
    console.error('❌ Error al verificar impresora:', error.message);
    return { existe: false, disponible: false, error: error.message };
  }
}

// Función para probar conexión con BarTender sin imprimir
async function probarBarTender(plantillaPath, codigoBarras = '000001') {
  try {
    console.log('🧪 Probando BarTender con vista previa...');
    
    const bartenderPath = "C:\\Program Files (x86)\\Seagull\\BarTender UltraLite\\BarTend.exe";
    
    // Comando solo para vista previa (sin imprimir)
    const comando = `"${bartenderPath}" /F="${plantillaPath}" /PRV /D="CodigoBarras=${codigoBarras}"`;
    
    console.log(`Ejecutando: ${comando}`);
    
    const { stdout, stderr } = await execPromise(comando, { timeout: 15000 });
    
    console.log('✅ BarTender ejecutado correctamente');
    if (stdout) console.log('Salida:', stdout);
    if (stderr) console.warn('Advertencias:', stderr);
    
    return { exito: true, mensaje: 'BarTender funciona correctamente' };
  } catch (error) {
    console.error('❌ Error en BarTender:', error.message);
    return { exito: false, error: error.message };
  }
}

// Función principal mejorada para imprimir con verificaciones
async function imprimirEtiquetaCodigoBarrasConVerificacion(codigoBarras) {
  try {
    console.log(`\n🚀 === INICIANDO PROCESO DE IMPRESIÓN PARA CÓDIGO: ${codigoBarras} ===`);
    
    const nombreImpresora = "Microsoft Print to PDF";
    const plantillaPath = "C:\\Users\\Alan Vazquez\\Documents\\BarTender\\BarTender Documents\\etiqueta_codigo_barras.btw";
    const bartenderPath = "C:\\Program Files (x86)\\Seagull\\BarTender UltraLite\\BarTend.exe";
    
    // 1. Verificar que existe la plantilla
    console.log('📄 Verificando plantilla...');
    const fs = require('fs');
    if (!fs.existsSync(plantillaPath)) {
      throw new Error(`Plantilla no encontrada: ${plantillaPath}`);
    }
    console.log('✅ Plantilla encontrada');
    
    // 2. Verificar BarTender
    console.log('🔧 Verificando BarTender...');
    if (!fs.existsSync(bartenderPath)) {
      throw new Error(`BarTender no encontrado: ${bartenderPath}`);
    }
    console.log('✅ BarTender encontrado');
    
    // 3. Probar BarTender con vista previa
    const pruebaBarTender = await probarBarTender(plantillaPath, codigoBarras);
    if (!pruebaBarTender.exito) {
      throw new Error(`Error en BarTender: ${pruebaBarTender.error}`);
    }
    
    // 4. Verificar impresora
    const estadoImpresora = await verificarImpresora(nombreImpresora);
    
    if (!estadoImpresora.existe) {
      throw new Error(`Impresora "${nombreImpresora}" no existe. ${estadoImpresora.detalles}`);
    }
    
    if (!estadoImpresora.disponible) {
      console.warn(`⚠️ Impresora "${nombreImpresora}" no está disponible o está offline`);
      console.warn('📋 Detalles:', estadoImpresora.detalles);
      // Continuar pero advertir al usuario
    }
    
    // 5. Ejecutar comando de impresión
    console.log('🖨️ Enviando a impresora...');
    const comando = `"${bartenderPath}" /F="${plantillaPath}" /P="${nombreImpresora}" /C=1 /D="CodigoBarras=${codigoBarras}" /X`;
    
    console.log(`Comando: ${comando}`);
    
    const { stdout, stderr } = await execPromise(comando, { timeout: 30000 });
    
    console.log('✅ Comando ejecutado exitosamente');
    if (stdout) console.log('📤 Salida:', stdout);
    if (stderr) console.warn('⚠️ Advertencias:', stderr);
    
    // 6. Verificar cola de impresión
    console.log('📋 Verificando cola de impresión...');
    try {
      const colaCmd = `wmic job where name="${nombreImpresora}" get status /format:list`;
      const { stdout: colaOutput } = await execPromise(colaCmd);
      console.log('📊 Estado de cola:', colaOutput);
    } catch (colaError) {
      console.warn('⚠️ No se pudo verificar cola de impresión:', colaError.message);
    }
    
    console.log(`🎉 === PROCESO COMPLETADO PARA CÓDIGO: ${codigoBarras} ===\n`);
    
    return {
      exito: true,
      codigo: codigoBarras,
      impresora: {
        nombre: nombreImpresora,
        existe: estadoImpresora.existe,
        disponible: estadoImpresora.disponible
      },
      mensaje: `Código ${codigoBarras} procesado correctamente`
    };
    
  } catch (error) {
    console.error(`❌ === ERROR EN PROCESO PARA CÓDIGO: ${codigoBarras} ===`);
    console.error('Error:', error.message);
    console.error(`=== FIN ERROR ===\n`);
    
    throw new Error(`Error al procesar código ${codigoBarras}: ${error.message}`);
  }
}

// Endpoint actualizado con verificaciones
router.post('/imprimir', async (req, res) => {
  try {
    const { codigos } = req.body;
    
    if (!codigos || !Array.isArray(codigos)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de códigos para imprimir'
      });
    }

    console.log(`\n🎯 === INICIANDO IMPRESIÓN DE ${codigos.length} CÓDIGOS ===`);
    console.log('Códigos a procesar:', codigos);

    const resultados = [];

    // Procesar cada código con verificaciones detalladas
    for (const codigo of codigos) {
      try {
        const resultado = await imprimirEtiquetaCodigoBarrasConVerificacion(codigo);
        resultados.push({ 
          codigo, 
          status: 'success', 
          mensaje: resultado.mensaje,
          impresora: resultado.impresora
        });
      } catch (error) {
        resultados.push({ 
          codigo, 
          status: 'error', 
          error: error.message 
        });
      }
    }

    const exitosos = resultados.filter(r => r.status === 'success').length;
    const fallidos = resultados.filter(r => r.status === 'error').length;

    console.log(`\n📊 === RESUMEN FINAL ===`);
    console.log(`Total: ${codigos.length} | Exitosos: ${exitosos} | Fallidos: ${fallidos}`);
    console.log(`=== FIN PROCESO ===\n`);

    res.json({
      success: true,
      message: `Proceso completado con verificaciones detalladas`,
      total: codigos.length,
      exitosos,
      fallidos,
      resultados,
      diagnostico: {
        timestamp: new Date().toISOString(),
        verificacionesRealizadas: [
          'Existencia de plantilla',
          'Disponibilidad de BarTender', 
          'Estado de impresora',
          'Cola de impresión'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Error general en el proceso de impresión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});



// Función para crear archivo de prueba simple
function crearArchivoPrueba(codigoBarras) {
  const contenidoPrueba = `
PRUEBA DE IMPRESIÓN
===================

Código de barras: ${codigoBarras}
Fecha: ${new Date().toLocaleString()}
Impresora: Beeprt BY-480BT

Esta es una prueba básica de impresión
para verificar conectividad con la impresora.

Si puede leer este texto, la impresora
está funcionando correctamente.

===================
FIN DE LA PRUEBA
`;

  const rutaArchivo = path.join(__dirname, '..', 'temp', `prueba_${codigoBarras}.txt`);
  
  // Crear directorio temp si no existe
  const dirTemp = path.dirname(rutaArchivo);
  if (!fs.existsSync(dirTemp)) {
    fs.mkdirSync(dirTemp, { recursive: true });
  }
  
  fs.writeFileSync(rutaArchivo, contenidoPrueba, 'utf8');
  return rutaArchivo;
}

// Función para imprimir archivo de texto directo (como hace Windows)
async function pruebaImpresionDirecta(nombreImpresora, codigoBarras = 'TEST001') {
  try {
    console.log(`\n🧪 === INICIANDO PRUEBA DE IMPRESIÓN DIRECTA ===`);
    console.log(`Impresora: ${nombreImpresora}`);
    console.log(`Código de prueba: ${codigoBarras}`);
    
    // 1. Crear archivo de prueba
    console.log('📄 Creando archivo de prueba...');
    const rutaArchivoPrueba = crearArchivoPrueba(codigoBarras);
    console.log(`Archivo creado: ${rutaArchivoPrueba}`);
    
    // 2. Comando directo de Windows para imprimir archivo
    // Este es el mismo comando que usa Windows internamente
    const comandoWindows = `print /D:"${nombreImpresora}" "${rutaArchivoPrueba}"`;
    
    console.log(`🖨️ Ejecutando comando de Windows: ${comandoWindows}`);
    
    const { stdout, stderr } = await execPromise(comandoWindows, { timeout: 15000 });
    
    console.log('✅ Comando ejecutado');
    if (stdout) console.log('📤 Salida:', stdout);
    if (stderr && !stderr.includes('successfully')) {
      console.warn('⚠️ Posibles advertencias:', stderr);
    }
    
    // 3. Limpiar archivo temporal
    setTimeout(() => {
      try {
        fs.unlinkSync(rutaArchivoPrueba);
        console.log('🗑️ Archivo temporal eliminado');
      } catch (e) {
        console.warn('⚠️ No se pudo eliminar archivo temporal:', e.message);
      }
    }, 5000);
    
    console.log(`✅ === PRUEBA DE IMPRESIÓN DIRECTA COMPLETADA ===\n`);
    
    return {
      exito: true,
      mensaje: 'Prueba de impresión directa enviada correctamente',
      comando: comandoWindows
    };
    
  } catch (error) {
    console.error('❌ Error en prueba de impresión directa:', error.message);
    throw new Error(`Prueba directa falló: ${error.message}`);
  }
}

// Función para probar diferentes métodos de impresión
async function diagnosticoCompletoImpresora(nombreImpresora, codigoBarras) {
  console.log(`\n🔬 === DIAGNÓSTICO COMPLETO DE IMPRESORA ===`);
  console.log(`Impresora: ${nombreImpresora}`);
  console.log(`Código de prueba: ${codigoBarras}`);
  
  const resultados = {
    pruebaDirecta: null,
    pruebaBarTender: null,
    estadoImpresora: null
  };
  
  try {
    // 1. Prueba de impresión directa (como Windows)
    console.log('\n--- Prueba 1: Impresión directa de texto ---');
    try {
      resultados.pruebaDirecta = await pruebaImpresionDirecta(nombreImpresora, `DIRECTO_${codigoBarras}`);
      console.log('✅ Prueba directa: EXITOSA');
    } catch (error) {
      resultados.pruebaDirecta = { exito: false, error: error.message };
      console.log('❌ Prueba directa: FALLÓ -', error.message);
    }
    
    // 2. Esperar un poco entre pruebas
    console.log('\n⏳ Esperando 3 segundos entre pruebas...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 3. Prueba con BarTender
    console.log('\n--- Prueba 2: BarTender con plantilla ---');
    try {
      const plantillaPath = "C:\\Users\\Alan Vazquez\\Documents\\BarTender\\BarTender Documents\\etiqueta_codigo_barras.btw";
      const bartenderPath = "C:\\Program Files (x86)\\Seagull\\BarTender UltraLite\\BarTend.exe";
      
      const comando = `"${bartenderPath}" /F="${plantillaPath}" /P="${nombreImpresora}" /C=1 /D="CodigoBarras=${codigoBarras}" /X`;
      console.log(`Ejecutando BarTender: ${comando}`);
      
      const { stdout, stderr } = await execPromise(comando, { timeout: 20000 });
      
      resultados.pruebaBarTender = { 
        exito: true, 
        mensaje: 'BarTender ejecutado correctamente', 
        stdout, 
        stderr 
      };
      console.log('✅ Prueba BarTender: EXITOSA');
      
    } catch (error) {
      resultados.pruebaBarTender = { exito: false, error: error.message };
      console.log('❌ Prueba BarTender: FALLÓ -', error.message);
    }
    
    // 4. Estado de la impresora
    console.log('\n--- Prueba 3: Estado de impresora ---');
    try {
      const estadoCmd = `wmic printer where name="${nombreImpresora}" get Status,WorkOffline,PrinterStatus,PrintJobDataType /format:list`;
      const { stdout } = await execPromise(estadoCmd);
      
      resultados.estadoImpresora = { exito: true, detalles: stdout };
      console.log('✅ Estado obtenido:', stdout);
      
    } catch (error) {
      resultados.estadoImpresora = { exito: false, error: error.message };
      console.log('❌ No se pudo obtener estado:', error.message);
    }
    
    // 5. Resumen final
    console.log(`\n📊 === RESUMEN DEL DIAGNÓSTICO ===`);
    console.log(`Impresión directa: ${resultados.pruebaDirecta?.exito ? '✅ FUNCIONA' : '❌ FALLA'}`);
    console.log(`BarTender: ${resultados.pruebaBarTender?.exito ? '✅ FUNCIONA' : '❌ FALLA'}`);
    console.log(`Estado impresora: ${resultados.estadoImpresora?.exito ? '✅ OK' : '❌ ERROR'}`);
    
    if (resultados.pruebaDirecta?.exito && !resultados.pruebaBarTender?.exito) {
      console.log('\n💡 CONCLUSIÓN: La impresora funciona, el problema está en BarTender o la plantilla');
    } else if (!resultados.pruebaDirecta?.exito) {
      console.log('\n💡 CONCLUSIÓN: Problema de conectividad con la impresora');
    } else if (resultados.pruebaDirecta?.exito && resultados.pruebaBarTender?.exito) {
      console.log('\n💡 CONCLUSIÓN: Todo funciona correctamente - revisar configuración física');
    }
    
    console.log(`=== FIN DIAGNÓSTICO ===\n`);
    
    return resultados;
    
  } catch (error) {
    console.error('❌ Error general en diagnóstico:', error.message);
    throw error;
  }
}

// Endpoint para diagnóstico completo
router.post('/diagnostico-impresora', async (req, res) => {
  try {
    const { codigo = 'DIAG001' } = req.body;
    const nombreImpresora = "Beeprt BY-480BT";
    
    console.log(`\n🎯 === INICIANDO DIAGNÓSTICO COMPLETO ===`);
    
    const resultados = await diagnosticoCompletoImpresora(nombreImpresora, codigo);
    
    res.json({
      success: true,
      mensaje: 'Diagnóstico completo realizado',
      impresora: nombreImpresora,
      codigo: codigo,
      resultados: resultados,
      recomendaciones: [
        resultados.pruebaDirecta?.exito ? 
          'La impresora responde a comandos directos' : 
          'Problema de conectividad con la impresora',
        resultados.pruebaBarTender?.exito ? 
          'BarTender puede comunicarse con la impresora' : 
          'Revisar configuración de BarTender o plantilla',
        'Verificar que la impresora tenga papel/etiquetas',
        'Verificar que no esté en pausa o con errores'
      ]
    });
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error durante el diagnóstico',
      error: error.message
    });
  }
});

module.exports = router;