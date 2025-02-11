const path = require('path');
const gateway = require('express-gateway');
const logger = require('express-gateway/lib/logger');

// Configurar el nivel de logging
logger.level = 'debug';

gateway()
  .load(path.join(__dirname, 'config'))
  .run()
  .then(() => {
    console.log('Express Gateway iniciado correctamente');
    console.log('Escuchando en puerto 4000');
  })
  .catch(err => {
    console.error('Error al iniciar Express Gateway:', err);
  });

// Configurar eventos de proceso para logging adicional
process.on('uncaughtException', function(err) {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', function(reason, p) {
  console.error('Unhandled Rejection:', reason);
});