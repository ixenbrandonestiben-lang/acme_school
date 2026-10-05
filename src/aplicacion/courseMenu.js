const inquirer = require('inquirer');
const chalk = require('chalk');
const Course = require('../doamin/entites/Course');
const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } = require('../infraestructura/repositories/CourseRepository');

async function courseMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n--- Gestión de Cursos ---\n'));

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: chalk.yellow('Seleccione una acción:'),
            choices: [
                { name: '1. Listar cursos', value: 'list' },
                { name: '2. Crear curso', value: 'create' },
                { name: '3. Actualizar curso', value: 'update' },
                { name: '4. Eliminar curso', value: 'delete' },
                { name: chalk.red('0. Volver al menú principal'), value: 'back' }
            ]
        }
    ]);

    switch (action) {
        case 'list':
            await listCourses();
            break;
        case 'create':
            await createCourseAction();
            break;
        case 'update':
            await updateCourseAction();
            break;
        case 'delete':
            await deleteCourseAction();
            break;
        case 'back':
            const mainMenu = require('./menu');
            await mainMenu();
            break;
    }
}

async function listCourses() {
    try {
        const courses = await getAllCourses();
        if (courses.length === 0) {
            console.log(chalk.yellow('\nNo hay cursos registrados.\n'));
        } else {
            console.log(chalk.green('\nLista de cursos:\n'));
            console.log(chalk.white('ID'.padEnd(5) + 'Código'.padEnd(15) + 'Descripción'.padEnd(40) + 'Intensidad'.padEnd(12) + 'Peso'.padEnd(8) + 'Estado'));
            console.log(chalk.gray('-'.repeat(100)));
            courses.forEach(c => {
                const estado = c.active === 1 ? chalk.green('Activo') : chalk.red('Inactivo');
                console.log(chalk.white(String(c.id).padEnd(5) + c.code.padEnd(15) + c.description.padEnd(40) + String(c.intensity).padEnd(12) + String(c.weight).padEnd(8)) + estado);
            });
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await courseMenu();
}

async function createCourseAction() {
    try {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'code', message: 'Código:', validate: (v) => v.trim().length > 0 || 'El código es obligatorio' },
            { type: 'input', name: 'description', message: 'Descripción:', validate: (v) => v.trim().length > 0 || 'La descripción es obligatoria' },
            { type: 'number', name: 'intensity', message: 'Intensidad (horas):', validate: (v) => v > 0 || 'La intensidad debe ser mayor a 0' },
            { type: 'number', name: 'weight', message: 'Peso (créditos):', validate: (v) => v > 0 || 'El peso debe ser mayor a 0' },
            { type: 'list', name: 'active', message: 'Estado:', choices: [{ name: 'Activo', value: 1 }, { name: 'Inactivo', value: 0 }] }
        ]);

        const course = new Course({ id: 0, ...answers });
        await createCourse(course);
        console.log(chalk.green('\n✓ Curso creado exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await courseMenu();
}

async function updateCourseAction() {
    try {
        const courses = await getAllCourses();
        if (courses.length === 0) {
            console.log(chalk.yellow('\nNo hay cursos para actualizar.\n'));
            await courseMenu();
            return;
        }

        const choices = courses.map(c => ({ name: `${c.id} - ${c.description}`, value: c.id }));
        const { courseId } = await inquirer.prompt([
            { type: 'list', name: 'courseId', message: 'Seleccione el curso a actualizar:', choices }
        ]);

        const course = await getCourseById(courseId);
        const answers = await inquirer.prompt([
            { type: 'input', name: 'code', message: 'Código:', default: course.code },
            { type: 'input', name: 'description', message: 'Descripción:', default: course.description },
            { type: 'number', name: 'intensity', message: 'Intensidad:', default: course.intensity },
            { type: 'number', name: 'weight', message: 'Peso:', default: course.weight },
            { type: 'list', name: 'active', message: 'Estado:', choices: [{ name: 'Activo', value: 1 }, { name: 'Inactivo', value: 0 }], default: course.active }
        ]);

        const updatedCourse = new Course({ id: course.id, ...answers });
        await updateCourse(updatedCourse);
        console.log(chalk.green('\n✓ Curso actualizado exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await courseMenu();
}

async function deleteCourseAction() {
    try {
        const courses = await getAllCourses();
        if (courses.length === 0) {
            console.log(chalk.yellow('\nNo hay cursos para eliminar.\n'));
            await courseMenu();
            return;
        }

        const choices = courses.map(c => ({ name: `${c.id} - ${c.description}`, value: c.id }));
        const { courseId } = await inquirer.prompt([
            { type: 'list', name: 'courseId', message: 'Seleccione el curso a eliminar:', choices }
        ]);

        const { confirm } = await inquirer.prompt([
            { type: 'confirm', name: 'confirm', message: '¿Está seguro de eliminar este curso?' }
        ]);

        if (confirm) {
            await deleteCourse(courseId);
            console.log(chalk.green('\n✓ Curso eliminado exitosamente.\n'));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await courseMenu();
}

module.exports = courseMenu;
