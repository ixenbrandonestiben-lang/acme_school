const pool = require('../database/connection');

async function createCourseSchedule(schedule) {
    const sql = 'INSERT INTO courses_schedules (course_id, teacher_id, classroom_id, start_date, end_date, active) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [schedule.courseId, schedule.teacherId, schedule.classroomId, schedule.startDate, schedule.endDate, schedule.active];
    const [results] = await pool.query(sql, values);
    return results;
}

async function getAllCourseSchedules() {
    const sql = `
        SELECT cs.*, c.code as course_code, c.description as course_description,
               t.firstName, t.lastName,
               cl.code as classroom_code, cl.description as classroom_description
        FROM courses_schedules cs
        LEFT JOIN courses c ON cs.course_id = c.id
        LEFT JOIN teachers t ON cs.teacher_id = t.id
        LEFT JOIN classrooms cl ON cs.classroom_id = cl.id
        ORDER BY cs.id DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
}

async function getCourseScheduleById(id) {
    const [rows] = await pool.query('SELECT * FROM courses_schedules WHERE id = ?', [id]);
    return rows[0];
}

async function updateCourseSchedule(schedule) {
    const sql = 'UPDATE courses_schedules SET course_id = ?, teacher_id = ?, classroom_id = ?, start_date = ?, end_date = ?, active = ? WHERE id = ?';
    const values = [schedule.courseId, schedule.teacherId, schedule.classroomId, schedule.startDate, schedule.endDate, schedule.active, schedule.id];
    const [results] = await pool.query(sql, values);
    return results;
}

async function deleteCourseSchedule(id) {
    const [results] = await pool.query('DELETE FROM courses_schedules WHERE id = ?', [id]);
    return results;
}

async function checkTeacherScheduleConflict(teacherId, startDate, endDate, excludeId = null) {
    let sql = `
        SELECT COUNT(*) as count FROM courses_schedules 
        WHERE teacher_id = ? AND active = 1 
        AND ((start_date BETWEEN ? AND ?) OR (end_date BETWEEN ? AND ?))
    `;
    const params = [teacherId, startDate, endDate, startDate, endDate];
    
    if (excludeId) {
        sql += ' AND id != ?';
        params.push(excludeId);
    }
    
    const [rows] = await pool.query(sql, params);
    return rows[0].count > 0;
}

async function checkClassroomScheduleConflict(classroomId, startDate, endDate, excludeId = null) {
    let sql = `
        SELECT COUNT(*) as count FROM courses_schedules 
        WHERE classroom_id = ? AND active = 1 
        AND ((start_date BETWEEN ? AND ?) OR (end_date BETWEEN ? AND ?))
    `;
    const params = [classroomId, startDate, endDate, startDate, endDate];
    
    if (excludeId) {
        sql += ' AND id != ?';
        params.push(excludeId);
    }
    
    const [rows] = await pool.query(sql, params);
    return rows[0].count > 0;
}

async function checkClassroomCapacity(classroomId) {
    const sql = `
        SELECT cl.capacity, COUNT(i.id) as enrolled
        FROM classrooms cl
        LEFT JOIN courses_schedules cs ON cl.id = cs.classroom_id
        LEFT JOIN inscriptions i ON cs.id = i.course_schedule
        WHERE cl.id = ? AND cs.active = 1
        GROUP BY cl.id
    `;
    const [rows] = await pool.query(sql, [classroomId]);
    if (rows.length === 0) return { capacity: 0, enrolled: 0 };
    return rows[0];
}

module.exports = { 
    createCourseSchedule, 
    getAllCourseSchedules, 
    getCourseScheduleById, 
    updateCourseSchedule, 
    deleteCourseSchedule,
    checkTeacherScheduleConflict,
    checkClassroomScheduleConflict,
    checkClassroomCapacity
};