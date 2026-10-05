const inquirer = require('inquirer');
const chalk = require('chalk');
const Topic = require('../doamin/entites/Topic');
const { createTopic, getAllTopics, getTopicById, updateTopic, deleteTopic } = require('../infraestructura/repositories/TopicRepository');
const { getAllCourses } = require('../infraestructura/repositories/CourseRepository');

async function topicMenu() {
    console.clear();
    console.log(chalk.cyan.bold('\n--- Gestión de Temarios ---\n'));

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: chalk.yellow('Seleccione una acción:'),
            choices: [
                { name: '1. Listar temarios', value: 'list' },
                { name: '2. Crear temario', value: 'create' },
                { name: '3. Actualizar temario', value: 'update' },
                { name: '4. Eliminar temario', value: 'delete' },
                { name: chalk.red('0. Volver al menú principal'), value: 'back' }
            ]
        }
    ]);

    switch (action) {
        case 'list':
            await listTopics();
            break;
        case 'create':
            await createTopicAction();
            break;
        case 'update':
            await updateTopicAction();
            break;
        case 'delete':
            await deleteTopicAction();
            break;
        case 'back':
            const mainMenu = require('./menu');
            await mainMenu();
            break;
    }
}

async function listTopics() {
    try {
        const topics = await getAllTopics();
        if (topics.length === 0) {
            console.log(chalk.yellow('\nNo hay temarios registrados.\n'));
        } else {
            console.log(chalk.green('\nLista de temarios:\n'));
            console.log(chalk.white('ID'.padEnd(5) + 'Código'.padEnd(15) + 'Título'.padEnd(40) + 'Curso'));
            console.log(chalk.gray('-'.repeat(90)));
            topics.forEach(t => {
                console.log(chalk.white(String(t.id).padEnd(5) + t.code.padEnd(15) + t.title.padEnd(40) + t.course_description));
            });
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await topicMenu();
}

async function createTopicAction() {
    try {
        const courses = await getAllCourses();
        const courseChoices = courses.map(c => ({ name: `${c.code} - ${c.description}`, value: c.id }));

        const answers = await inquirer.prompt([
            { type: 'list', name: 'courseId', message: 'Curso:', choices: courseChoices },
            { type: 'input', name: 'code', message: 'Código:', validate: (v) => v.trim().length > 0 || 'El código es obligatorio' },
            { type: 'input', name: 'title', message: 'Título:', validate: (v) => v.trim().length > 0 || 'El título es obligatorio' },
            { type: 'input', name: 'description', message: 'Descripción:', validate: (v) => v.trim().length > 0 || 'La descripción es obligatoria' },
            { type: 'list', name: 'active', message: 'Estado:', choices: [{ name: 'Activo', value: 1 }, { name: 'Inactivo', value: 0 }] }
        ]);

        const topic = new Topic({ id: 0, ...answers });
        await createTopic(topic);
        console.log(chalk.green('\n✓ Temario creado exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await topicMenu();
}

async function updateTopicAction() {
    try {
        const topics = await getAllTopics();
        if (topics.length === 0) {
            console.log(chalk.yellow('\nNo hay temarios para actualizar.\n'));
            await topicMenu();
            return;
        }

        const choices = topics.map(t => ({ name: `${t.id} - ${t.title}`, value: t.id }));
        const { topicId } = await inquirer.prompt([
            { type: 'list', name: 'topicId', message: 'Seleccione el temario a actualizar:', choices }
        ]);

        const topic = await getTopicById(topicId);
        const courses = await getAllCourses();
        const courseChoices = courses.map(c => ({ name: `${c.code} - ${c.description}`, value: c.id }));

        const answers = await inquirer.prompt([
            { type: 'list', name: 'courseId', message: 'Curso:', choices: courseChoices, default: topic.course_id },
            { type: 'input', name: 'code', message: 'Código:', default: topic.code },
            { type: 'input', name: 'title', message: 'Título:', default: topic.title },
            { type: 'input', name: 'description', message: 'Descripción:', default: topic.description },
            { type: 'list', name: 'active', message: 'Estado:', choices: [{ name: 'Activo', value: 1 }, { name: 'Inactivo', value: 0 }], default: topic.active }
        ]);

        const updatedTopic = new Topic({ id: topic.id, ...answers });
        await updateTopic(updatedTopic);
        console.log(chalk.green('\n✓ Temario actualizado exitosamente.\n'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await topicMenu();
}

async function deleteTopicAction() {
    try {
        const topics = await getAllTopics();
        if (topics.length === 0) {
            console.log(chalk.yellow('\nNo hay temarios para eliminar.\n'));
            await topicMenu();
            return;
        }

        const choices = topics.map(t => ({ name: `${t.id} - ${t.title}`, value: t.id }));
        const { topicId } = await inquirer.prompt([
            { type: 'list', name: 'topicId', message: 'Seleccione el temario a eliminar:', choices }
        ]);

        const { confirm } = await inquirer.prompt([
            { type: 'confirm', name: 'confirm', message: '¿Está seguro de eliminar este temario?' }
        ]);

        if (confirm) {
            await deleteTopic(topicId);
            console.log(chalk.green('\n✓ Temario eliminado exitosamente.\n'));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}\n`));
    }
    await topicMenu();
}

module.exports = topicMenu;
