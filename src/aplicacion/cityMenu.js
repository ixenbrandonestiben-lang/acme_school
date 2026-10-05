const inquirer = require('inquirer');
const chalk = require('chalk');
const City = require('../doamin/entites/City');
const { createCity, getAllCities, getCityById, updateCity, deleteCity } = require('../infraestructura/repositories/CityRepository');

async function cityMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n--- Gestión de Ciudades ---\n'));

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: chalk.yellow('Seleccione una acción:'),
            choices: [
                { name: '1. Listar ciudades', value: 'list' },
                { name: '2. Crear ciudad', value: 'create' },
                { name: '3. Actualizar ciudad', value: 'update' },
                { name: '4. Eliminar ciudad', value: 'delete' },
                { name: chalk.red('0. Volver al menú principal'), value: 'back' }
            ]
        }
    ]);

    switch (action) {
        case 'list':
            await listCities();
            break;
        case 'create':
            await createCityAction();
            break;
        case 'update':
            await updateCityAction();
            break;
        case 'delete':
            await deleteCityAction();
            break;
        case 'back':
            const mainMenu = require('./menu');
            await mainMenu();
            break;
    }
}

async function listCities() {
    try {
        const cities = await getAllCities();
        if (cities.length === 0) {
            console.log(chalk.yellow('\nNo hay ciudades registradas.\n'));
        } else {
            console.log(chalk.green('\nLista de ciudades:\n'));
            console.log(chalk.white('ID'.padEnd(5) + 'Código'.padEnd(15) + 'Nombre'));
            console.log(chalk.gray('-'.repeat(50)));
            cities.forEach(city => {
                console.log(chalk.white(String(city.id).padEnd(5) + city.code.padEnd(15) + city.name));
            });
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await cityMenu();
}

async function createCityAction() {
    try {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'code', message: 'Código:', validate: (v) => v.trim().length > 0 || 'El código es obligatorio' },
            { type: 'input', name: 'name', message: 'Nombre:', validate: (v) => v.trim().length > 0 || 'El nombre es obligatorio' }
        ]);

        const city = new City({ id: 0, code: answers.code, name: answers.name });
        await createCity(city);
        console.log(chalk.green('\n✓ Ciudad creada exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await cityMenu();
}

async function updateCityAction() {
    try {
        const cities = await getAllCities();
        if (cities.length === 0) {
            console.log(chalk.yellow('\nNo hay ciudades para actualizar.\n'));
            await cityMenu();
            return;
        }

        const choices = cities.map(c => ({ name: `${c.id} - ${c.name}`, value: c.id }));
        const { cityId } = await inquirer.prompt([
            { type: 'list', name: 'cityId', message: 'Seleccione la ciudad a actualizar:', choices }
        ]);

        const city = await getCityById(cityId);
        const answers = await inquirer.prompt([
            { type: 'input', name: 'code', message: 'Código:', default: city.code },
            { type: 'input', name: 'name', message: 'Nombre:', default: city.name }
        ]);

        const updatedCity = new City({ id: city.id, code: answers.code, name: answers.name });
        await updateCity(updatedCity);
        console.log(chalk.green('\n✓ Ciudad actualizada exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await cityMenu();
}

async function deleteCityAction() {
    try {
        const cities = await getAllCities();
        if (cities.length === 0) {
            console.log(chalk.yellow('\nNo hay ciudades para eliminar.\n'));
            await cityMenu();
            return;
        }

        const choices = cities.map(c => ({ name: `${c.id} - ${c.name}`, value: c.id }));
        const { cityId } = await inquirer.prompt([
            { type: 'list', name: 'cityId', message: 'Seleccione la ciudad a eliminar:', choices }
        ]);

        const { confirm } = await inquirer.prompt([
            { type: 'confirm', name: 'confirm', message: '¿Está seguro de eliminar esta ciudad?' }
        ]);

        if (confirm) {
            await deleteCity(cityId);
            console.log(chalk.green('\n✓ Ciudad eliminada exitosamente.\n'));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await cityMenu();
}

module.exports = cityMenu;
