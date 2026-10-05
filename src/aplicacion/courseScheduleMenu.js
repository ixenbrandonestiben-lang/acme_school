const inquirer = require('inquirer');
const chalk = require('chalk');
const CourseSchedule = require('../doamin/entites/CourseSchedule');
const { createCourseSchedule, getAllCourseSchedules, getCourseScheduleById, updateCourseSchedule, deleteCourseSchedule, checkTeacherScheduleConflict, checkClassroomScheduleConflict } = require('../infraestructura/repositories/CourseScheduleRepository');
const { getAllCourses } = require('../infraestructura/repositories/CourseRepository');
const { getAllTeachers } = require('../infraestructura/repositories/TeacherRepository');
const { getAllClassrooms } = require('../infraestructura/repositories/ClassroomRepository');

async function courseScheduleMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n--- Gestión de Horarios de Cursos ---\n'));

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: chalk.yellow('Seleccione una acción:'),
            choices: [
                { name: '1. Listar horarios', value: 'list' },
                { name: '2. Crear horario', value: 'create' },
                { name: '3. Actualizar horario', value: 'update' },
                { name: '4. Eliminar horario', value: 'delete' },
                { name: chalk.red('0. Volver al menú principal'), value: 'back' }
            ]
        }
    ]);

    switch (action) {
        case 'list':
            await listSchedules();
            break;
        case 'create':
            await createScheduleAction();
            break;
        case 'update':
            await updateScheduleAction();
            break;
        case 'delete':
            await deleteScheduleAction();
            break;
        case 'back':
            const mainMenu = require('./menu');
            await mainMenu();
            break;
    }
}

async function listSchedules() {
    try {
        const schedules = await getAllCourseSchedules();
        if (schedules.length === 0) {
            console.log(chalk.yellow('\nNo hay horarios registrados.\n'));
        } else {
            console.log(chalk.green('\nLista de horarios:\n'));
            console.log(chalk.white('ID'.padEnd(5) + 'Curso'.padEnd(20) + 'Profesor'.padEnd(25) + 'Aula'.padEnd(20) + 'Inicio'.padEnd(20) + 'Fin'));
            console.log(chalk.gray('-'.repeat(120)));
            schedules.forEach(s => {
                const teacher = `${s.firstName} ${s.lastName}`;
                console.log(chalk.white(String(s.id).padEnd(5) + s.course_description.padEnd(20) + teacher.padEnd(25) + s.classroom_description.padEnd(20) + new Date(s.start_date).toLocaleDateString().padEnd(20) + new Date(s.end_date).toLocaleDateString()));
            });
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await courseScheduleMenu();
}

async function createScheduleAction() {
    try {
        const courses = await getAllCourses();
        const courseChoices = courses.map(c => ({ name: `${c.code} - ${c.description}`, value: c.id }));
        const teachers = await getAllTeachers();
        const teacherChoices = teachers.map(t => ({ name: `${t.firstName} ${t.lastName}`, value: t.id }));
        const classrooms = await getAllClassrooms();
        const classroomChoices = classrooms.map(c => ({ name: `${c.code} - ${c.description}`, value: c.id }));

        const answers = await inquirer.prompt([
            { type: 'list', name: 'courseId', message: 'Curso:', choices: courseChoices },
            { type: 'list', name: 'teacherId', message: 'Profesor:', choices: teacherChoices },
            { type: 'list', name: 'classroomId', message: 'Aula:', choices: classroomChoices },
            { type: 'input', name: 'startDate', message: 'Fecha inicio (YYYY-MM-DD HH:MM:SS):', validate: (v) => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(v) || 'Formato inválido' },
            { type: 'input', name: 'endDate', message: 'Fecha fin (YYYY-MM-DD HH:MM:SS):', validate: (v) => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(v) || 'Formato inválido' },
            { type: 'list', name: 'active', message: 'Estado:', choices: [{ name: 'Activo', value: 1 }, { name: 'Inactivo', value: 0 }] }
        ]);

        const startDate = new Date(answers.startDate);
        const endDate = new Date(answers.endDate);

        if (startDate >= endDate) {
            console.log(chalk.red('\n✗ La fecha de inicio debe ser anterior a la fecha de fin.\n'));
            await courseScheduleMenu();
            return;
        }

        const teacherConflict = await checkTeacherScheduleConflict(answers.teacherId, startDate, endDate);
        if (teacherConflict) {
            console.log(chalk.red('\n✗ El profesor ya tiene un horario en ese rango de fechas.\n'));
            await courseScheduleMenu();
            return;
        }

        const classroomConflict = await checkClassroomScheduleConflict(answers.classroomId, startDate, endDate);
        if (classroomConflict) {
            console.log(chalk.red('\n✗ El aula ya está ocupada en ese rango de fechas.\n'));
            await courseScheduleMenu();
            return;
        }

        const schedule = new CourseSchedule({ id: 0, ...answers, startDate, endDate });
        await createCourseSchedule(schedule);
        console.log(chalk.green('\n✓ Horario creado exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await courseScheduleMenu();
}

async function updateScheduleAction() {
    try {
        const schedules = await getAllCourseSchedules();
        if (schedules.length === 0) {
            console.log(chalk.yellow('\nNo hay horarios para actualizar.\n'));
            await courseScheduleMenu();
            return;
        }

        const choices = schedules.map(s => ({ name: `${s.id} - ${s.course_description}`, value: s.id }));
        const { scheduleId } = await inquirer.prompt([
            { type: 'list', name: 'scheduleId', message: 'Seleccione el horario a actualizar:', choices }
        ]);

        const schedule = await getCourseScheduleById(scheduleId);
        const courses = await getAllCourses();
        const courseChoices = courses.map(c => ({ name: `${c.code} - ${c.description}`, value: c.id }));
        const teachers = await getAllTeachers();
        const teacherChoices = teachers.map(t => ({ name: `${t.firstName} ${t.lastName}`, value: t.id }));
        const classrooms = await getAllClassrooms();
        const classroomChoices = classrooms.map(c => ({ name: `${c.code} - ${c.description}`, value: c.id }));

        const answers = await inquirer.prompt([
            { type: 'list', name: 'courseId', message: 'Curso:', choices: courseChoices, default: schedule.course_id },
            { type: 'list', name: 'teacherId', message: 'Profesor:', choices: teacherChoices, default: schedule.teacher_id },
            { type: 'list', name: 'classroomId', message: 'Aula:', choices: classroomChoices, default: schedule.classroom_id },
            { type: 'input', name: 'startDate', message: 'Fecha inicio:', default: new Date(schedule.start_date).toISOString().slice(0, 19).replace('T', ' ') },
            { type: 'input', name: 'endDate', message: 'Fecha fin:', default: new Date(schedule.end_date).toISOString().slice(0, 19).replace('T', ' ') },
            { type: 'list', name: 'active', message: 'Estado:', choices: [{ name: 'Activo', value: 1 }, { name: 'Inactivo', value: 0 }], default: schedule.active }
        ]);

        const startDate = new Date(answers.startDate);
        const endDate = new Date(answers.endDate);

        if (startDate >= endDate) {
            console.log(chalk.red('\n✗ La fecha de inicio debe ser anterior a la fecha de fin.\n'));
            await courseScheduleMenu();
            return;
        }

        const teacherConflict = await checkTeacherScheduleConflict(answers.teacherId, startDate, endDate, scheduleId);
        if (teacherConflict) {
            console.log(chalk.red('\n✗ El profesor ya tiene un horario en ese rango de fechas.\n'));
            await courseScheduleMenu();
            return;
        }

        const classroomConflict = await checkClassroomScheduleConflict(answers.classroomId, startDate, endDate, scheduleId);
        if (classroomConflict) {
            console.log(chalk.red('\n✗ El aula ya está ocupada en ese rango de fechas.\n'));
            await courseScheduleMenu();
            return;
        }

        const updatedSchedule = new CourseSchedule({ id: schedule.id, ...answers, startDate, endDate });
        await updateCourseSchedule(updatedSchedule);
        console.log(chalk.green('\n✓ Horario actualizado exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await courseScheduleMenu();
}

async function deleteScheduleAction() {
    try {
        const schedules = await getAllCourseSchedules();
        if (schedules.length === 0) {
            console.log(chalk.yellow('\nNo hay horarios para eliminar.\n'));
            await courseScheduleMenu();
            return;
        }

        const choices = schedules.map(s => ({ name: `${s.id} - ${s.course_description}`, value: s.id }));
        const { scheduleId } = await inquirer.prompt([
            { type: 'list', name: 'scheduleId', message: 'Seleccione el horario a eliminar:', choices }
        ]);

        const { confirm } = await inquirer.prompt([
            { type: 'confirm', name: 'confirm', message: '¿Está seguro de eliminar este horario?' }
        ]);

        if (confirm) {
            await deleteCourseSchedule(scheduleId);
            console.log(chalk.green('\n✓ Horario eliminado exitosamente.\n'));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await courseScheduleMenu();
}

module.exports = courseScheduleMenu;
