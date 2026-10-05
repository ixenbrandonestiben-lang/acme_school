const inquirer = require('inquirer');
const chalk = require('chalk');
const Student = require('../doamin/entites/Student');
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, checkDuplicateIdentification } = require('../infraestructura/repositories/StudentRepository');
const { getAllIdentificationTypes } = require('../infraestructura/repositories/IdentificationTypeRepository');
const { getAllCities } = require('../infraestructura/repositories/CityRepository');

async function studentMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n--- Gestión de Estudiantes ---\n'));

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: chalk.yellow('Seleccione una acción:'),
            choices: [
                { name: '1. Listar estudiantes', value: 'list' },
                { name: '2. Crear estudiante', value: 'create' },
                { name: '3. Actualizar estudiante', value: 'update' },
                { name: '4. Eliminar estudiante', value: 'delete' },
                { name: chalk.red('0. Volver al menú principal'), value: 'back' }
            ]
        }
    ]);

    switch (action) {
        case 'list':
            await listStudents();
            break;
        case 'create':
            await createStudentAction();
            break;
        case 'update':
            await updateStudentAction();
            break;
        case 'delete':
            await deleteStudentAction();
            break;
        case 'back':
            const mainMenu = require('./menu');
            await mainMenu();
            break;
    }
}

async function listStudents() {
    try {
        const students = await getAllStudents();
        if (students.length === 0) {
            console.log(chalk.yellow('\nNo hay estudiantes registrados.\n'));
        } else {
            console.log(chalk.green('\nLista de estudiantes:\n'));
            console.log(chalk.white('ID'.padEnd(5) + 'Código'.padEnd(15) + 'Nombre'.padEnd(30) + 'Email'));
            console.log(chalk.gray('-'.repeat(90)));
            students.forEach(s => {
                const fullName = `${s.firstName} ${s.lastName}`;
                console.log(chalk.white(String(s.id).padEnd(5) + s.code.padEnd(15) + fullName.padEnd(30) + s.email));
            });
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await studentMenu();
}

async function createStudentAction() {
    try {
        const types = await getAllIdentificationTypes();
        const typeChoices = types.map(t => ({ name: `${t.code} - ${t.name}`, value: t.id }));
        const cities = await getAllCities();
        const cityChoices = cities.map(c => ({ name: c.name, value: c.id }));

        const answers = await inquirer.prompt([
            { type: 'input', name: 'code', message: 'Código:', validate: (v) => v.trim().length > 0 || 'El código es obligatorio' },
            { type: 'input', name: 'firstName', message: 'Nombre:', validate: (v) => v.trim().length > 0 || 'El nombre es obligatorio' },
            { type: 'input', name: 'lastName', message: 'Apellido:', validate: (v) => v.trim().length > 0 || 'El apellido es obligatorio' },
            { type: 'list', name: 'identificationTypeId', message: 'Tipo de identificación:', choices: typeChoices },
            { type: 'input', name: 'identificationNumber', message: 'Número de identificación:', validate: (v) => /^\d+$/.test(v) || 'Debe contener solo dígitos' },
            { type: 'input', name: 'gender', message: 'Género:', validate: (v) => v.trim().length > 0 || 'El género es obligatorio' },
            { type: 'input', name: 'birthday', message: 'Fecha de nacimiento (YYYY-MM-DD):', validate: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Formato inválido' },
            { type: 'input', name: 'email', message: 'Email:', validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email inválido' },
            { type: 'input', name: 'address', message: 'Dirección:', default: '' },
            { type: 'list', name: 'cityId', message: 'Ciudad:', choices: cityChoices }
        ]);

        const isDuplicate = await checkDuplicateIdentification(answers.identificationTypeId, answers.identificationNumber);
        if (isDuplicate) {
            console.log(chalk.red('\n✗ Ya existe un estudiante con esa identificación.\n'));
            await studentMenu();
            return;
        }

        const student = new Student({ id: 0, ...answers });
        await createStudent(student);
        console.log(chalk.green('\n✓ Estudiante creado exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await studentMenu();
}

async function updateStudentAction() {
    try {
        const students = await getAllStudents();
        if (students.length === 0) {
            console.log(chalk.yellow('\nNo hay estudiantes para actualizar.\n'));
            await studentMenu();
            return;
        }

        const choices = students.map(s => ({ name: `${s.id} - ${s.firstName} ${s.lastName}`, value: s.id }));
        const { studentId } = await inquirer.prompt([
            { type: 'list', name: 'studentId', message: 'Seleccione el estudiante a actualizar:', choices }
        ]);

        const student = await getStudentById(studentId);
        const types = await getAllIdentificationTypes();
        const typeChoices = types.map(t => ({ name: `${t.code} - ${t.name}`, value: t.id }));
        const cities = await getAllCities();
        const cityChoices = cities.map(c => ({ name: c.name, value: c.id }));

        const answers = await inquirer.prompt([
            { type: 'input', name: 'code', message: 'Código:', default: student.code },
            { type: 'input', name: 'firstName', message: 'Nombre:', default: student.firstName },
            { type: 'input', name: 'lastName', message: 'Apellido:', default: student.lastName },
            { type: 'list', name: 'identificationTypeId', message: 'Tipo de identificación:', choices: typeChoices, default: student.identification_type_id },
            { type: 'input', name: 'identificationNumber', message: 'Número de identificación:', default: student.identificationNumber },
            { type: 'input', name: 'gender', message: 'Género:', default: student.gender },
            { type: 'input', name: 'birthday', message: 'Fecha de nacimiento:', default: student.birthdate },
            { type: 'input', name: 'email', message: 'Email:', default: student.email },
            { type: 'input', name: 'address', message: 'Dirección:', default: student.address },
            { type: 'list', name: 'cityId', message: 'Ciudad:', choices: cityChoices, default: student.city_id }
        ]);

        const isDuplicate = await checkDuplicateIdentification(answers.identificationTypeId, answers.identificationNumber, studentId);
        if (isDuplicate) {
            console.log(chalk.red('\n✗ Ya existe otro estudiante con esa identificación.\n'));
            await studentMenu();
            return;
        }

        const updatedStudent = new Student({ id: student.id, ...answers });
        await updateStudent(updatedStudent);
        console.log(chalk.green('\n✓ Estudiante actualizado exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await studentMenu();
}

async function deleteStudentAction() {
    try {
        const students = await getAllStudents();
        if (students.length === 0) {
            console.log(chalk.yellow('\nNo hay estudiantes para eliminar.\n'));
            await studentMenu();
            return;
        }

        const choices = students.map(s => ({ name: `${s.id} - ${s.firstName} ${s.lastName}`, value: s.id }));
        const { studentId } = await inquirer.prompt([
            { type: 'list', name: 'studentId', message: 'Seleccione el estudiante a eliminar:', choices }
        ]);

        const { confirm } = await inquirer.prompt([
            { type: 'confirm', name: 'confirm', message: '¿Está seguro de eliminar este estudiante?' }
        ]);

        if (confirm) {
            await deleteStudent(studentId);
            console.log(chalk.green('\n✓ Estudiante eliminado exitosamente.\n'));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await studentMenu();
}

module.exports = studentMenu;
