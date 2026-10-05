const pool = require('../database/connection');

async function createCity(city) {
    const sql = 'INSERT INTO cities (code, name) VALUES (?, ?)';
    const values = [city.code, city.name];
    const [results] = await pool.query(sql, values);
    return results;
}

async function getAllCities() {
    const [rows] = await pool.query('SELECT * FROM cities ORDER BY id');
    return rows;
}

async function getCityById(id) {
    const [rows] = await pool.query('SELECT * FROM cities WHERE id = ?', [id]);
    return rows[0];
}

async function updateCity(city) {
    const sql = 'UPDATE cities SET code = ?, name = ? WHERE id = ?';
    const values = [city.code, city.name, city.id];
    const [results] = await pool.query(sql, values);
    return results;
}

async function deleteCity(id) {
    const [results] = await pool.query('DELETE FROM cities WHERE id = ?', [id]);
    return results;
}

module.exports = { createCity, getAllCities, getCityById, updateCity, deleteCity };