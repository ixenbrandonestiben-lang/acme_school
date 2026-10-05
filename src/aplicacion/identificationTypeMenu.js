const inquirer = require('inquirer');
const chalk = require('chalk');
const IdentificationType = require('../doamin/entites/IdentificationType');
const { createIdentificationType, getAllIdentificationTypes, getIdentificationTypeById, updateIdentificationType, deleteIdentificationType } = require('../infraestructura/repositories/IdentificationTypeRepository');

async function identificationTypeMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n--- Gestión de Tipos de Identificación ---\n'));

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: chalk.yellow('Seleccione una acción:'),
            choices: [
                { name: '1. Listar tipos de identificación', value: 'list' },
                { name: '2. Crear tipo de identificación', value: 'create' },
                { name: '3. Actualizar tipo de identificación', value: 'update' },
                { name: '4. Eliminar tipo de identificación', value: 'delete' },
                { name: chalk.red('0. Volver al menú principal'), value: 'back' }
            ]
        }
    ]);

    switch (action) {
        case 'list':
            await listTypes();
            break;
        case 'create':
            await createTypeAction();
            break;
        case 'update':
            await updateTypeAction();
            break;
        case 'delete':
            await deleteTypeAction();
            break;
        case 'back':
            const mainMenu = require('./menu');
            await mainMenu();
            break;
    }
}

async function listTypes() {
    try {
        const types = await getAllIdentificationTypes();
        if (types.length === 0) {
            console.log(chalk.yellow('\nNo hay tipos de identificación registrados.\n'));
        } else {
            console.log(chalk.green('\nLista de tipos de identificación:\n'));
            console.log(chalk.white('ID'.padEnd(5) + 'Código'.padEnd(10) + 'Nombre'.padEnd(30) + 'Descripción'));
            console.log(chalk.gray('-'.repeat(80)));
            types.forEach(type => {
                console.log(chalk.white(String(type.id).padEnd(5) + type.code.padEnd(10) + type.name.padEnd(30) + type.description));
            });
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await identificationTypeMenu();
}

async function createTypeAction() {
    try {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'code', message: 'Código:', validate: (v) => v.trim().length > 0 || 'El código es obligatorio' },
            { type: 'input', name: 'name', message: 'Nombre:', validate: (v) => v.trim().length > 0 || 'El nombre es obligatorio' },
            { type: 'input', name: 'description', message: 'Descripción:', default: '' }
        ]);

        const type = new IdentificationType({ id: 0, code: answers.code, name: answers.name, description: answers.description });
        await createIdentificationType(type);
        console.log(chalk.green('\n✓ Tipo de identificación creado exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await identificationTypeMenu();
}

async function updateTypeAction() {
    try {
        const types = await getAllIdentificationTypes();
        if (types.length === 0) {
            console.log(chalk.yellow('\nNo hay tipos de identificación para actualizar.\n'));
            await identificationTypeMenu();
            return;
        }

        const choices = types.map(t => ({ name: `${t.id} - ${t.name}`, value: t.id }));
        const { typeId } = await inquirer.prompt([
            { type: 'list', name: 'typeId', message: 'Seleccione el tipo a actualizar:', choices }
        ]);

        const type = await getIdentificationTypeById(typeId);
        const answers = await inquirer.prompt([
            { type: 'input', name: 'code', message: 'Código:', default: type.code },
            { type: 'input', name: 'name', message: 'Nombre:', default: type.name },
            { type: 'input', name: 'description', message: 'Descripción:', default: type.description }
        ]);

        const updatedType = new IdentificationType({ id: type.id, code: answers.code, name: answers.name, description: answers.description });
        await updateIdentificationType(updatedType);
        console.log(chalk.green('\n✓ Tipo de identificación actualizado exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await identificationTypeMenu();
}

async function deleteTypeAction() {
    try {
        const types = await getAllIdentificationTypes();
        if (types.length === 0) {
            console.log(chalk.yellow('\nNo hay tipos de identificación para eliminar.\n'));
            await identificationTypeMenu();
            return;
        }

        const choices = types.map(t => ({ name: `${t.id} - ${t.name}`, value: t.id }));
        const { typeId } = await inquirer.prompt([
            { type: 'list', name: 'typeId', message: 'Seleccione el tipo a eliminar:', choices }
        ]);

        const { confirm } = await inquirer.prompt([
            { type: 'confirm', name: 'confirm', message: '¿Está seguro de eliminar este tipo de identificación?' }
        ]);

        if (confirm) {
            await deleteIdentificationType(typeId);
            console.log(chalk.green('\n✓ Tipo de identificación eliminado exitosamente.\n'));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await identificationTypeMenu();
}

module.exports = identificationTypeMenu;
