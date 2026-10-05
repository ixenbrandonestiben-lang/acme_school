const inquirer = require('inquirer');
const chalk = require('chalk');
const Rate = require('../doamin/entites/Rate');
const { createRate, getAllRates, getRateById, updateRate, deleteRate } = require('../infraestructura/repositories/RateRepository');
const { getAllInscriptions } = require('../infraestructura/repositories/InscriptionRepository');

async function rateMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n--- Gestión de Calificaciones ---\n'));

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: chalk.yellow('Seleccione una acción:'),
            choices: [
                { name: '1. Listar calificaciones', value: 'list' },
                { name: '2. Crear calificación', value: 'create' },
                { name: '3. Actualizar calificación', value: 'update' },
                { name: '4. Eliminar calificación', value: 'delete' },
                { name: chalk.red('0. Volver al menú principal'), value: 'back' }
            ]
        }
    ]);

    switch (action) {
        case 'list':
            await listRates();
            break;
        case 'create':
            await createRateAction();
            break;
        case 'update':
            await updateRateAction();
            break;
        case 'delete':
            await deleteRateAction();
            break;
        case 'back':
            const mainMenu = require('./menu');
            await mainMenu();
            break;
    }
}

async function listRates() {
    try {
        const rates = await getAllRates();
        if (rates.length === 0) {
            console.log(chalk.yellow('\nNo hay calificaciones registradas.\n'));
        } else {
            console.log(chalk.green('\nLista de calificaciones:\n'));
            console.log(chalk.white('ID'.padEnd(5) + 'Estudiante'.padEnd(30) + 'Curso'.padEnd(30) + 'Calificación'));
            console.log(chalk.gray('-'.repeat(100)));
            rates.forEach(r => {
                const student = `${r.firstName} ${r.lastName}`;
                console.log(chalk.white(String(r.id).padEnd(5) + student.padEnd(30) + r.course_description.padEnd(30) + String(r.rate)));
            });
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await rateMenu();
}

async function createRateAction() {
    try {
        const inscriptions = await getAllInscriptions();
        const inscriptionChoices = inscriptions.map(i => ({ name: `${i.firstName} ${i.lastName} - ${i.course_description}`, value: i.id }));

        const answers = await inquirer.prompt([
            { type: 'list', name: 'inscriptionId', message: 'Matrícula:', choices: inscriptionChoices },
            { type: 'number', name: 'rate', message: 'Calificación (0-100):', validate: (v) => v >= 0 && v <= 100 || 'Debe estar entre 0 y 100' },
            { type: 'input', name: 'comments', message: 'Comentarios:', default: '' }
        ]);

        const rate = new Rate({ id: 0, ...answers });
        await createRate(rate);
        console.log(chalk.green('\n✓ Calificación creada exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await rateMenu();
}

async function updateRateAction() {
    try {
        const rates = await getAllRates();
        if (rates.length === 0) {
            console.log(chalk.yellow('\nNo hay calificaciones para actualizar.\n'));
            await rateMenu();
            return;
        }

        const choices = rates.map(r => ({ name: `${r.id} - ${r.firstName} ${r.lastName} - ${r.course_description}`, value: r.id }));
        const { rateId } = await inquirer.prompt([
            { type: 'list', name: 'rateId', message: 'Seleccione la calificación a actualizar:', choices }
        ]);

        const rate = await getRateById(rateId);
        const inscriptions = await getAllInscriptions();
        const inscriptionChoices = inscriptions.map(i => ({ name: `${i.firstName} ${i.lastName} - ${i.course_description}`, value: i.id }));

        const answers = await inquirer.prompt([
            { type: 'list', name: 'inscriptionId', message: 'Matrícula:', choices: inscriptionChoices, default: rate.inscription_id },
            { type: 'number', name: 'rate', message: 'Calificación:', default: rate.rate },
            { type: 'input', name: 'comments', message: 'Comentarios:', default: rate.comments }
        ]);

        const updatedRate = new Rate({ id: rate.id, ...answers });
        await updateRate(updatedRate);
        console.log(chalk.green('\n✓ Calificación actualizada exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await rateMenu();
}

async function deleteRateAction() {
    try {
        const rates = await getAllRates();
        if (rates.length === 0) {
            console.log(chalk.yellow('\nNo hay calificaciones para eliminar.\n'));
            await rateMenu();
            return;
        }

        const choices = rates.map(r => ({ name: `${r.id} - ${r.firstName} ${r.lastName} - ${r.course_description}`, value: r.id }));
        const { rateId } = await inquirer.prompt([
            { type: 'list', name: 'rateId', message: 'Seleccione la calificación a eliminar:', choices }
        ]);

        const { confirm } = await inquirer.prompt([
            { type: 'confirm', name: 'confirm', message: '¿Está seguro de eliminar esta calificación?' }
        ]);

        if (confirm) {
            await deleteRate(rateId);
            console.log(chalk.green('\n✓ Calificación eliminada exitosamente.\n'));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await rateMenu();
}

module.exports = rateMenu;
