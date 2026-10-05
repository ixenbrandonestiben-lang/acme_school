const inquirer = require('inquirer');
const chalk = require('chalk');

const cityMenu = require('./cityMenu');
const classroomMenu = require('./classroomMenu');
const courseMenu = require('./courseMenu');
const courseScheduleMenu = require('./courseScheduleMenu');
const identificationTypeMenu = require('./identificationTypeMenu');
const inscriptionMenu = require('./inscriptionMenu');
const rateMenu = require('./rateMenu');
const studentMenu = require('./studentMenu');
const teacherMenu = require('./teacherMenu');
const topicMenu = require('./topicMenu');

async function mainMenu() {
    console.clear();
    console.log(chalk.blue.bold('\n========================================'));
    console.log(chalk.blue.bold('   ACME SCHOOL - Sistema de Gestión'));
    console.log(chalk.blue.bold('========================================\n'));

    const { option } = await inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: chalk.yellow('Seleccione una opción:'),
            choices: [
                { name: '1. Gestión de Tipos de Identificación', value: 'identificationTypes' },
                { name: '2. Gestión de Ciudades', value: 'cities' },
                { name: '3. Gestión de Aulas', value: 'classrooms' },
                { name: '4. Gestión de Cursos', value: 'courses' },
                { name: '5. Gestión de Temarios', value: 'topics' },
                { name: '6. Gestión de Profesores', value: 'teachers' },
                { name: '7. Gestión de Estudiantes', value: 'students' },
                { name: '8. Gestión de Horarios de Cursos', value: 'courseSchedules' },
                { name: '9. Gestión de Matrículas', value: 'inscriptions' },
                { name: '10. Gestión de Calificaciones', value: 'rates' },
                { name: chalk.red('0. Salir'), value: 'exit' }
            ]
        }
    ]);

    switch (option) {
        case 'identificationTypes':
            await identificationTypeMenu();
            break;
        case 'cities':
            await cityMenu();
            break;
        case 'classrooms':
            await classroomMenu();
            break;
        case 'courses':
            await courseMenu();
            break;
        case 'topics':
            await topicMenu();
            break;
        case 'teachers':
            await teacherMenu();
            break;
        case 'students':
            await studentMenu();
            break;
        case 'courseSchedules':
            await courseScheduleMenu();
            break;
        case 'inscriptions':
            await inscriptionMenu();
            break;
        case 'rates':
            await rateMenu();
            break;
        case 'exit':
            console.log(chalk.green('\n¡Hasta luego!\n'));
            process.exit(0);
    }
}

module.exports = mainMenu;
