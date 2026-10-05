const pool = require('../database/connection');

async function createRate(rate) {
    const sql = 'INSERT INTO rates (inscription_id, rate, comments) VALUES (?, ?, ?)';
    const values = [rate.inscriptionId, rate.rate, rate.comments];
    const [results] = await pool.query(sql, values);
    return results;
}

async function getAllRates() {
    const sql = `
        SELECT r.*, i.id as inscription_id, s.firstName, s.lastName, c.description as course_description
        FROM rates r
        LEFT JOIN inscriptions i ON r.inscription_id = i.id
        LEFT JOIN students s ON i.student_id = s.id
        LEFT JOIN courses_schedules cs ON i.course_schedule = cs.id
        LEFT JOIN courses c ON cs.course_id = c.id
        ORDER BY r.id DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
}

async function getRateById(id) {
    const [rows] = await pool.query('SELECT * FROM rates WHERE id = ?', [id]);
    return rows[0];
}

async function updateRate(rate) {
    const sql = 'UPDATE rates SET inscription_id = ?, rate = ?, comments = ? WHERE id = ?';
    const values = [rate.inscriptionId, rate.rate, rate.comments, rate.id];
    const [results] = await pool.query(sql, values);
    return results;
}

async function deleteRate(id) {
    const [results] = await pool.query('DELETE FROM rates WHERE id = ?', [id]);
    return results;
}

module.exports = { createRate, getAllRates, getRateById, updateRate, deleteRate };