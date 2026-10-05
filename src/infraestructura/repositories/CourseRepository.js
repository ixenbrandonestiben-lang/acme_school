const pool = require('../database/connection');

async function createCourse(course) {
    const sql = 'INSERT INTO courses (code, description, intensity, weight, active) VALUES (?, ?, ?, ?, ?)';
    const values = [course.code, course.description, course.intensity, course.weight, course.active];
    const [results] = await pool.query(sql, values);
    return results;
}

async function getAllCourses() {
    const [rows] = await pool.query('SELECT * FROM courses ORDER BY id DESC');
    return rows;
}

async function getCourseById(id) {
    const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    return rows[0];
}

async function updateCourse(course) {
    const sql = 'UPDATE courses SET code = ?, description = ?, intensity = ?, weight = ?, active = ? WHERE id = ?';
    const values = [course.code, course.description, course.intensity, course.weight, course.active, course.id];
    const [results] = await pool.query(sql, values);
    return results;
}

async function deleteCourse(id) {
    const [results] = await pool.query('DELETE FROM courses WHERE id = ?', [id]);
    return results;
}

module.exports = { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse };