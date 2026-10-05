const pool = require('../database/connection');

async function createIdentificationType(type) {
    const sql = 'INSERT INTO identification_types (code, name, description) VALUES (?, ?, ?)';
    const values = [type.code, type.name, type.description];
    const [results] = await pool.query(sql, values);
    return results;
}

async function getAllIdentificationTypes() {
    const [rows] = await pool.query('SELECT * FROM identification_types ORDER BY id');
    return rows;
}

async function getIdentificationTypeById(id) {
    const [rows] = await pool.query('SELECT * FROM identification_types WHERE id = ?', [id]);
    return rows[0];
}

async function updateIdentificationType(type) {
    const sql = 'UPDATE identification_types SET code = ?, name = ?, description = ? WHERE id = ?';
    const values = [type.code, type.name, type.description, type.id];
    const [results] = await pool.query(sql, values);
    return results;
}

async function deleteIdentificationType(id) {
    const [results] = await pool.query('DELETE FROM identification_types WHERE id = ?', [id]);
    return results;
}

module.exports = { 
    createIdentificationType, 
    getAllIdentificationTypes, 
    getIdentificationTypeById, 
    updateIdentificationType, 
    deleteIdentificationType 
};