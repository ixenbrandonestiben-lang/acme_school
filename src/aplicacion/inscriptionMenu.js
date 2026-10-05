const inquirer = require('inquirer');
const chalk = require('chalk');
const Inscription = require('../doamin/entites/Inscription');
const { createInscription, getAllInscriptions, getInscriptionById, updateInscription, deleteInscription, checkDuplicateInscription } = require('../infraestructura/repositories/InscriptionRepository');
const { getAllCourseSchedules } = require('../infraestructura/repositories/CourseScheduleRepository');
const { getAllStudents } = require('../infraestructura/repositories/StudentRepository');

async function inscriptionMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n--- Gestión de Matrículas ---\n'));

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: chalk.yellow('Seleccione una acción:'),
            choices: [
                { name: '1. Listar matrículas', value: 'list' },
                { name: '2. Crear matrícula', value: 'create' },
                { name: '3. Actualizar matrícula', value: 'update' },
                { name: '4. Eliminar matrícula', value: 'delete' },
                { name: chalk.red('0. Volver al menú principal'), value: 'back' }
            ]
        }
    ]);

    switch (action) {
        case 'list':
            await listInscriptions();
            break;
        case 'create':
            await createInscriptionAction();
            break;
        case 'update':
            await updateInscriptionAction();
            break;
        case 'delete':
            await deleteInscriptionAction();
            break;
        case 'back':
            const mainMenu = require('./menu');
            await mainMenu();
            break;
    }
}

async function listInscriptions() {
    try {
        const inscriptions = await getAllInscriptions();
        if (inscriptions.length === 0) {
            console.log(chalk.yellow('\nNo hay matrículas registradas.\n'));
        } else {
            console.log(chalk.green('\nLista de matrículas:\n'));
            console.log(chalk.white('ID'.padEnd(5) + 'Estudiante'.padEnd(30) + 'Curso'.padEnd(30) + 'Fecha Registro'));
            console.log(chalk.gray('-'.repeat(100)));
            inscriptions.forEach(i => {
                const student = `${i.firstName} ${i.lastName}`;
                console.log(chalk.white(String(i.id).padEnd(5) + student.padEnd(30) + i.course_description.padEnd(30) + new Date(i.register_date).toLocaleDateString()));
            });
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await inscriptionMenu();
}

async function createInscriptionAction() {
    try {
        const schedules = await getAllCourseSchedules();
        const scheduleChoices = schedules.map(s => ({ name: `${s.course_description} - ${s.firstName} ${s.lastName}`, value: s.id }));
        const students = await getAllStudents();
        const studentChoices = students.map(s => ({ name: `${s.firstName} ${s.lastName}`, value: s.id }));

        const answers = await inquirer.prompt([
            { type: 'list', name: 'courseScheduleId', message: 'Horario de curso:', choices: scheduleChoices },
            { type: 'list', name: 'studentId', message: 'Estudiante:', choices: studentChoices },
            { type: 'input', name: 'registerDate', message: 'Fecha de registro (YYYY-MM-DD HH:MM:SS):', default: new Date().toISOString().slice(0, 19).replace('T', ' ') },
            { type: 'list', name: 'active', message: 'Estado:', choices: [{ name: 'Activo', value: 1 }, { name: 'Inactivo', value: 0 }] }
        ]);

        const isDuplicate = await checkDuplicateInscription(answers.courseScheduleId, answers.studentId);
        if (isDuplicate) {
            console.log(chalk.red('\n✗ El estudiante ya está matriculado en este horario.\n'));
            await inscriptionMenu();
            return;
        }

        const inscription = new Inscription({ id: 0, ...answers });
        await createInscription(inscription);
        console.log(chalk.green('\n✓ Matrícula creada exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await inscriptionMenu();
}

async function updateInscriptionAction() {
    try {
        const inscriptions = await getAllInscriptions();
        if (inscriptions.length === 0) {
            console.log(chalk.yellow('\nNo hay matrículas para actualizar.\n'));
            await inscriptionMenu();
            return;
        }

        const choices = inscriptions.map(i => ({ name: `${i.id} - ${i.firstName} ${i.lastName} - ${i.course_description}`, value: i.id }));
        const { inscriptionId } = await inquirer.prompt([
            { type: 'list', name: 'inscriptionId', message: 'Seleccione la matrícula a actualizar:', choices }
        ]);

        const inscription = await getInscriptionById(inscriptionId);
        const schedules = await getAllCourseSchedules();
        const scheduleChoices = schedules.map(s => ({ name: `${s.course_description} - ${s.firstName} ${s.lastName}`, value: s.id }));
        const students = await getAllStudents();
        const studentChoices = students.map(s => ({ name: `${s.firstName} ${s.lastName}`, value: s.id }));

        const answers = await inquirer.prompt([
            { type: 'list', name: 'courseScheduleId', message: 'Horario de curso:', choices: scheduleChoices, default: inscription.course_schedule },
            { type: 'list', name: 'studentId', message: 'Estudiante:', choices: studentChoices, default: inscription.student_id },
            { type: 'input', name: 'registerDate', message: 'Fecha de registro:', default: new Date(inscription.register_date).toISOString().slice(0, 19).replace('T', ' ') },
            { type: 'list', name: 'active', message: 'Estado:', choices: [{ name: 'Activo', value: 1 }, { name: 'Inactivo', value: 0 }], default: inscription.active }
        ]);

        const isDuplicate = await checkDuplicateInscription(answers.courseScheduleId, answers.studentId);
        if (isDuplicate) {
            console.log(chalk.red('\n✗ El estudiante ya está matriculado en este horario.\n'));
            await inscriptionMenu();
            return;
        }

        const updatedInscription = new Inscription({ id: inscription.id, ...answers });
        await updateInscription(updatedInscription);
        console.log(chalk.green('\n✓ Matrícula actualizada exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await inscriptionMenu();
}

async function deleteInscriptionAction() {
    try {
        const inscriptions = await getAllInscriptions();
        if (inscriptions.length === 0) {
            console.log(chalk.yellow('\nNo hay matrículas para eliminar.\n'));
            await inscriptionMenu();
            return;
        }

        const choices = inscriptions.map(i => ({ name: `${i.id} - ${i.firstName} ${i.lastName} - ${i.course_description}`, value: i.id }));
        const { inscriptionId } = await inquirer.prompt([
            { type: 'list', name: 'inscriptionId', message: 'Seleccione la matrícula a eliminar:', choices }
        ]);

        const { confirm } = await inquirer.prompt([
            { type: 'confirm', name: 'confirm', message: '¿Está seguro de eliminar esta matrícula?' }
        ]);

        if (confirm) {
            await deleteInscription(inscriptionId);
            console.log(chalk.green('\n✓ Matrícula eliminada exitosamente.\n'));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await inscriptionMenu();
}

module.exports = inscriptionMenu;
