const inquirer = require('inquirer');
const chalk = require('chalk');
const Teacher = require('../doamin/entites/Teacher');
const { createTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher, checkDuplicateIdentification } = require('../infraestructura/repositories/TeacherRepository');
const { getAllIdentificationTypes } = require('../infraestructura/repositories/IdentificationTypeRepository');

async function teacherMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n--- Gestión de Profesores ---\n'));

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: chalk.yellow('Seleccione una acción:'),
            choices: [
                { name: '1. Listar profesores', value: 'list' },
                { name: '2. Crear profesor', value: 'create' },
                { name: '3. Actualizar profesor', value: 'update' },
                { name: '4. Eliminar profesor', value: 'delete' },
                { name: chalk.red('0. Volver al menú principal'), value: 'back' }
            ]
        }
    ]);

    switch (action) {
        case 'list':
            await listTeachers();
            break;
        case 'create':
            await createTeacherAction();
            break;
        case 'update':
            await updateTeacherAction();
            break;
        case 'delete':
            await deleteTeacherAction();
            break;
        case 'back':
            const mainMenu = require('./menu');
            await mainMenu();
            break;
    }
}

async function listTeachers() {
    try {
        const teachers = await getAllTeachers();
        if (teachers.length === 0) {
            console.log(chalk.yellow('\nNo hay profesores registrados.\n'));
        } else {
            console.log(chalk.green('\nLista de profesores:\n'));
            console.log(chalk.white('ID'.padEnd(5) + 'Nombre'.padEnd(30) + 'Identificación'.padEnd(20) + 'Email'));
            console.log(chalk.gray('-'.repeat(90)));
            teachers.forEach(t => {
                const fullName = `${t.firstName} ${t.lastName}`;
                console.log(chalk.white(String(t.id).padEnd(5) + fullName.padEnd(30) + t.identificationNumber.padEnd(20) + t.email));
            });
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await teacherMenu();
}

async function createTeacherAction() {
    try {
        const types = await getAllIdentificationTypes();
        const typeChoices = types.map(t => ({ name: `${t.code} - ${t.name}`, value: t.id }));

        const answers = await inquirer.prompt([
            { type: 'input', name: 'firstName', message: 'Nombre:', validate: (v) => v.trim().length > 0 || 'El nombre es obligatorio' },
            { type: 'input', name: 'lastName', message: 'Apellido:', validate: (v) => v.trim().length > 0 || 'El apellido es obligatorio' },
            { type: 'list', name: 'identificationTypeId', message: 'Tipo de identificación:', choices: typeChoices },
            { type: 'input', name: 'identificationNumber', message: 'Número de identificación:', validate: (v) => /^\d+$/.test(v) || 'Debe contener solo dígitos' },
            { type: 'input', name: 'email', message: 'Email:', validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email inválido' }
        ]);

        const isDuplicate = await checkDuplicateIdentification(answers.identificationTypeId, answers.identificationNumber);
        if (isDuplicate) {
            console.log(chalk.red('\n✗ Ya existe un profesor con esa identificación.\n'));
            await teacherMenu();
            return;
        }

        const teacher = new Teacher({ id: 0, ...answers });
        await createTeacher(teacher);
        console.log(chalk.green('\n✓ Profesor creado exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await teacherMenu();
}

async function updateTeacherAction() {
    try {
        const teachers = await getAllTeachers();
        if (teachers.length === 0) {
            console.log(chalk.yellow('\nNo hay profesores para actualizar.\n'));
            await teacherMenu();
            return;
        }

        const choices = teachers.map(t => ({ name: `${t.id} - ${t.firstName} ${t.lastName}`, value: t.id }));
        const { teacherId } = await inquirer.prompt([
            { type: 'list', name: 'teacherId', message: 'Seleccione el profesor a actualizar:', choices }
        ]);

        const teacher = await getTeacherById(teacherId);
        const types = await getAllIdentificationTypes();
        const typeChoices = types.map(t => ({ name: `${t.code} - ${t.name}`, value: t.id }));

        const answers = await inquirer.prompt([
            { type: 'input', name: 'firstName', message: 'Nombre:', default: teacher.firstName },
            { type: 'input', name: 'lastName', message: 'Apellido:', default: teacher.lastName },
            { type: 'list', name: 'identificationTypeId', message: 'Tipo de identificación:', choices: typeChoices, default: teacher.identification_type_id },
            { type: 'input', name: 'identificationNumber', message: 'Número de identificación:', default: teacher.identificationNumber },
            { type: 'input', name: 'email', message: 'Email:', default: teacher.email }
        ]);

        const isDuplicate = await checkDuplicateIdentification(answers.identificationTypeId, answers.identificationNumber, teacherId);
        if (isDuplicate) {
            console.log(chalk.red('\n✗ Ya existe otro profesor con esa identificación.\n'));
            await teacherMenu();
            return;
        }

        const updatedTeacher = new Teacher({ id: teacher.id, ...answers });
        await updateTeacher(updatedTeacher);
        console.log(chalk.green('\n✓ Profesor actualizado exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await teacherMenu();
}

async function deleteTeacherAction() {
    try {
        const teachers = await getAllTeachers();
        if (teachers.length === 0) {
            console.log(chalk.yellow('\nNo hay profesores para eliminar.\n'));
            await teacherMenu();
            return;
        }

        const choices = teachers.map(t => ({ name: `${t.id} - ${t.firstName} ${t.lastName}`, value: t.id }));
        const { teacherId } = await inquirer.prompt([
            { type: 'list', name: 'teacherId', message: 'Seleccione el profesor a eliminar:', choices }
        ]);

        const { confirm } = await inquirer.prompt([
            { type: 'confirm', name: 'confirm', message: '¿Está seguro de eliminar este profesor?' }
        ]);

        if (confirm) {
            await deleteTeacher(teacherId);
            console.log(chalk.green('\n✓ Profesor eliminado exitosamente.\n'));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await teacherMenu();
}

module.exports = teacherMenu;
