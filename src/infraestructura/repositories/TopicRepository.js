const pool = require('../database/connection');

async function createTopic(topic) {
    const sql = 'INSERT INTO topics (course_id, code, title, description, active) VALUES (?, ?, ?, ?, ?)';
    const values = [topic.courseId, topic.code, topic.title, topic.description, topic.active];
    const [results] = await pool.query(sql, values);
    return results;
}

async function getAllTopics() {
    const sql = `
        SELECT t.*, c.code as course_code, c.description as course_description
        FROM topics t
        LEFT JOIN courses c ON t.course_id = c.id
        ORDER BY t.id DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
}

async function getTopicById(id) {
    const [rows] = await pool.query('SELECT * FROM topics WHERE id = ?', [id]);
    return rows[0];
}

async function getTopicsByCourseId(courseId) {
    const [rows] = await pool.query('SELECT * FROM topics WHERE course_id = ? ORDER BY id', [courseId]);
    return rows;
}

async function updateTopic(topic) {
    const sql = 'UPDATE topics SET course_id = ?, code = ?, title = ?, description = ?, active = ? WHERE id = ?';
    const values = [topic.courseId, topic.code, topic.title, topic.description, topic.active, topic.id];
    const [results] = await pool.query(sql, values);
    return results;
}

async function deleteTopic(id) {
    const [results] = await pool.query('DELETE FROM topics WHERE id = ?', [id]);
    return results;
}

module.exports = { 
    createTopic, 
    getAllTopics, 
    getTopicById, 
    getTopicsByCourseId, 
    updateTopic, 
    deleteTopic 
};