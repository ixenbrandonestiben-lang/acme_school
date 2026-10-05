const mainMenu = require('./src/aplicacion/menu.js');

async function start() {
    try {
        await mainMenu();
    } catch (error) {
        console.error('Error fatal:', error.message);
        process.exit(1);
    }
}

start();