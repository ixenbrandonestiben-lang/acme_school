const pool = require('../database/connection');

async function createClassroom(classroom) {
    const sql = 'INSERT INTO classrooms (code, description, capacity, active) VALUES (?, ?, ?, ?)';
    const values = [classroom.code, classroom.description, classroom.capacity, classroom.active];
    const [results] = await pool.query(sql, values);
    return results;
}

async function getAllClassrooms() {
    const [rows] = await pool.query('SELECT * FROM classrooms ORDER BY id');
    return rows;
}

async function getClassroomById(id) {
    const [rows] = await pool.query('SELECT * FROM classrooms WHERE id = ?', [id]);
    return rows[0];
}

async function updateClassroom(classroom) {
    const sql = 'UPDATE classrooms SET code = ?, description = ?, capacity = ?, active = ? WHERE id = ?';
    const values = [classroom.code, classroom.description, classroom.capacity, classroom.active, classroom.id];
    const [results] = await pool.query(sql, values);
    return results;
}

async function deleteClassroom(id) {
    const [results] = await pool.query('DELETE FROM classrooms WHERE id = ?', [id]);
    return results;
}

module.exports = { createClassroom, getAllClassrooms, getClassroomById, updateClassroom, deleteClassroom };