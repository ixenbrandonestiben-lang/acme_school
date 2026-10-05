const pool = require('../database/connection');

async function createStudent(student) {
    const sql = 'INSERT INTO students (code, firstName, lastName, identification_type_id, identificationNumber, gender, birthdate, email, address, city_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
        student.code,
        student.firstName,
        student.lastName,
        student.identificationTypeId,
        student.identificationNumber,
        student.gender,
        student.birthday,
        student.email,
        student.address,
        student.cityId
    ];
    const [results] = await pool.query(sql, values);
    return results;
}

async function getAllStudents() {
    const sql = `
        SELECT s.*, it.name as identification_type_name, c.name as city_name
        FROM students s
        LEFT JOIN identification_types it ON s.identification_type_id = it.id
        LEFT JOIN cities c ON s.city_id = c.id
        ORDER BY s.id DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
}

async function getStudentById(id) {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    return rows[0];
}

async function updateStudent(student) {
    const sql = 'UPDATE students SET code = ?, firstName = ?, lastName = ?, identification_type_id = ?, identificationNumber = ?, gender = ?, birthdate = ?, email = ?, address = ?, city_id = ? WHERE id = ?';
    const values = [
        student.code,
        student.firstName,
        student.lastName,
        student.identificationTypeId,
        student.identificationNumber,
        student.gender,
        student.birthday,
        student.email,
        student.address,
        student.cityId,
        student.id
    ];
    const [results] = await pool.query(sql, values);
    return results;
}

async function deleteStudent(id) {
    const [results] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
    return results;
}

async function checkDuplicateIdentification(identificationTypeId, identificationNumber, excludeId = null) {
    let sql = 'SELECT COUNT(*) as count FROM students WHERE identification_type_id = ? AND identificationNumber = ?';
    const params = [identificationTypeId, identificationNumber];
    
    if (excludeId) {
        sql += ' AND id != ?';
        params.push(excludeId);
    }
    
    const [rows] = await pool.query(sql, params);
    return rows[0].count > 0;
}

module.exports = { 
    createStudent, 
    getAllStudents, 
    getStudentById, 
    updateStudent, 
    deleteStudent,
    checkDuplicateIdentification
};