const inquirer = require('inquirer');
const chalk = require('chalk');
const Classroom = require('../doamin/entites/Classroom');
const { createClassroom, getAllClassrooms, getClassroomById, updateClassroom, deleteClassroom } = require('../infraestructura/repositories/ClassroomRepository');

async function classroomMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n--- Gestión de Aulas ---\n'));

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: chalk.yellow('Seleccione una acción:'),
            choices: [
                { name: '1. Listar aulas', value: 'list' },
                { name: '2. Crear aula', value: 'create' },
                { name: '3. Actualizar aula', value: 'update' },
                { name: '4. Eliminar aula', value: 'delete' },
                { name: chalk.red('0. Volver al menú principal'), value: 'back' }
            ]
        }
    ]);

    switch (action) {
        case 'list':
            await listClassrooms();
            break;
        case 'create':
            await createClassroomAction();
            break;
        case 'update':
            await updateClassroomAction();
            break;
        case 'delete':
            await deleteClassroomAction();
            break;
        case 'back':
            const mainMenu = require('./menu');
            await mainMenu();
            break;
    }
}

async function listClassrooms() {
    try {
        const classrooms = await getAllClassrooms();
        if (classrooms.length === 0) {
            console.log(chalk.yellow('\nNo hay aulas registradas.\n'));
        } else {
            console.log(chalk.green('\nLista de aulas:\n'));
            console.log(chalk.white('ID'.padEnd(5) + 'Código'.padEnd(15) + 'Descripción'.padEnd(40) + 'Capacidad'.padEnd(12) + 'Estado'));
            console.log(chalk.gray('-'.repeat(90)));
            classrooms.forEach(c => {
                const estado = c.active === 1 ? chalk.green('Activo') : chalk.red('Inactivo');
                console.log(chalk.white(String(c.id).padEnd(5) + c.code.padEnd(15) + c.description.padEnd(40) + String(c.capacity).padEnd(12)) + estado);
            });
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await classroomMenu();
}

async function createClassroomAction() {
    try {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'code', message: 'Código:', validate: (v) => v.trim().length > 0 || 'El código es obligatorio' },
            { type: 'input', name: 'description', message: 'Descripción:', validate: (v) => v.trim().length > 0 || 'La descripción es obligatoria' },
            { type: 'number', name: 'capacity', message: 'Capacidad:', validate: (v) => v > 0 || 'La capacidad debe ser mayor a 0' },
            { type: 'list', name: 'active', message: 'Estado:', choices: [{ name: 'Activo', value: 1 }, { name: 'Inactivo', value: 0 }] }
        ]);

        const classroom = new Classroom({ id: 0, ...answers });
        await createClassroom(classroom);
        console.log(chalk.green('\n✓ Aula creada exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await classroomMenu();
}

async function updateClassroomAction() {
    try {
        const classrooms = await getAllClassrooms();
        if (classrooms.length === 0) {
            console.log(chalk.yellow('\nNo hay aulas para actualizar.\n'));
            await classroomMenu();
            return;
        }

        const choices = classrooms.map(c => ({ name: `${c.id} - ${c.description}`, value: c.id }));
        const { classroomId } = await inquirer.prompt([
            { type: 'list', name: 'classroomId', message: 'Seleccione el aula a actualizar:', choices }
        ]);

        const classroom = await getClassroomById(classroomId);
        const answers = await inquirer.prompt([
            { type: 'input', name: 'code', message: 'Código:', default: classroom.code },
            { type: 'input', name: 'description', message: 'Descripción:', default: classroom.description },
            { type: 'number', name: 'capacity', message: 'Capacidad:', default: classroom.capacity },
            { type: 'list', name: 'active', message: 'Estado:', choices: [{ name: 'Activo', value: 1 }, { name: 'Inactivo', value: 0 }], default: classroom.active }
        ]);

        const updatedClassroom = new Classroom({ id: classroom.id, ...answers });
        await updateClassroom(updatedClassroom);
        console.log(chalk.green('\n✓ Aula actualizada exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await classroomMenu();
}

async function deleteClassroomAction() {
    try {
        const classrooms = await getAllClassrooms();
        if (classrooms.length === 0) {
            console.log(chalk.yellow('\nNo hay aulas para eliminar.\n'));
            await classroomMenu();
            return;
        }

        const choices = classrooms.map(c => ({ name: `${c.id} - ${c.description}`, value: c.id }));
        const { classroomId } = await inquirer.prompt([
            { type: 'list', name: 'classroomId', message: 'Seleccione el aula a eliminar:', choices }
        ]);

        const { confirm } = await inquirer.prompt([
            { type: 'confirm', name: 'confirm', message: '¿Está seguro de eliminar esta aula?' }
        ]);

        if (confirm) {
            await deleteClassroom(classroomId);
            console.log(chalk.green('\n✓ Aula eliminada exitosamente.\n'));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await classroomMenu();
}

module.exports = classroomMenu;
