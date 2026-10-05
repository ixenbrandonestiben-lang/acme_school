const pool = require('../database/connection');

async function createTeacher(teacher) {
    const sql = 'INSERT INTO teachers (firstName, lastName, identification_type_id, identificationNumber, email) VALUES (?, ?, ?, ?, ?)';
    const values = [
        teacher.firstName,
        teacher.lastName,
        teacher.identificationTypeId,
        teacher.identificationNumber,
        teacher.email
    ];
    const [results] = await pool.query(sql, values);
    return results;
}

async function getAllTeachers() {
    const [rows] = await pool.query('SELECT * FROM teachers ORDER BY id');
    return rows;
}

async function getTeacherById(id) {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE id = ?', [id]);
    return rows[0];
}

async function updateTeacher(teacher) {
    const sql = 'UPDATE teachers SET firstName = ?, lastName = ?, identification_type_id = ?, identificationNumber = ?, email = ? WHERE id = ?';
    const values = [
        teacher.firstName,
        teacher.lastName,
        teacher.identificationTypeId,
        teacher.identificationNumber,
        teacher.email,
        teacher.id
    ];
    const [results] = await pool.query(sql, values);
    return results;
}

async function deleteTeacher(id) {
    const [results] = await pool.query('DELETE FROM teachers WHERE id = ?', [id]);
    return results;
}

async function checkDuplicateIdentification(identificationTypeId, identificationNumber, excludeId = null) {
    let sql = 'SELECT COUNT(*) as count FROM teachers WHERE identification_type_id = ? AND identificationNumber = ?';
    const params = [identificationTypeId, identificationNumber];
    
    if (excludeId) {
        sql += ' AND id != ?';
        params.push(excludeId);
    }
    
    const [rows] = await pool.query(sql, params);
    return rows[0].count > 0;
}

module.exports = { 
    createTeacher, 
    getAllTeachers, 
    getTeacherById, 
    updateTeacher, 
    deleteTeacher,
    checkDuplicateIdentification
};