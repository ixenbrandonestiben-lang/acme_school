const pool = require('../database/connection');

async function createInscription(inscription) {
    const sql = 'INSERT INTO inscriptions (course_schedule, student_id, register_date, active) VALUES (?, ?, ?, ?)';
    const values = [inscription.courseScheduleId, inscription.studentId, inscription.registerDate, inscription.active];
    const [results] = await pool.query(sql, values);
    return results;
}

async function getAllInscriptions() {
    const sql = `
        SELECT i.*, cs.id as schedule_id, c.code as course_code, c.description as course_description,
               s.firstName, s.lastName, s.code as student_code
        FROM inscriptions i
        LEFT JOIN courses_schedules cs ON i.course_schedule = cs.id
        LEFT JOIN courses c ON cs.course_id = c.id
        LEFT JOIN students s ON i.student_id = s.id
        ORDER BY i.id DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
}

async function getInscriptionById(id) {
    const [rows] = await pool.query('SELECT * FROM inscriptions WHERE id = ?', [id]);
    return rows[0];
}

async function updateInscription(inscription) {
    const sql = 'UPDATE inscriptions SET course_schedule = ?, student_id = ?, register_date = ?, active = ? WHERE id = ?';
    const values = [inscription.courseScheduleId, inscription.studentId, inscription.registerDate, inscription.active, inscription.id];
    const [results] = await pool.query(sql, values);
    return results;
}

async function deleteInscription(id) {
    const [results] = await pool.query('DELETE FROM inscriptions WHERE id = ?', [id]);
    return results;
}

async function checkDuplicateInscription(courseScheduleId, studentId) {
    const sql = 'SELECT COUNT(*) as count FROM inscriptions WHERE course_schedule = ? AND student_id = ? AND active = 1';
    const [rows] = await pool.query(sql, [courseScheduleId, studentId]);
    return rows[0].count > 0;
}

module.exports = { 
    createInscription, 
    getAllInscriptions, 
    getInscriptionById, 
    updateInscription, 
    deleteInscription,
    checkDuplicateInscription
};