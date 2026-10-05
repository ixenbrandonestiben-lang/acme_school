const Validador = require('../validators/validador');

class CourseSchedule {
    #id;
    #courseId;
    #teacherId;
    #classroomId;
    #startDate;
    #endDate;
    #active;

    constructor({ id, courseId, teacherId, classroomId, startDate, endDate, active }) {
        Validador.validarNumerico(id, 'El id');
        Validador.validarNumerico(courseId, 'El curso');
        Validador.validarNumerico(teacherId, 'El profesor');
        Validador.validarNumerico(classroomId, 'El aula');
        Validador.validarActivo(active, 'El estado');
        Validador.validarRangoFecha(startDate, endDate);

        this.#id = id;
        this.#courseId = courseId;
        this.#teacherId = teacherId;
        this.#classroomId = classroomId;
        this.#startDate = startDate;
        this.#endDate = endDate;
        this.#active = active;
    }

    get id() { return this.#id; }
    get courseId() { return this.#courseId; }
    get teacherId() { return this.#teacherId; }
    get classroomId() { return this.#classroomId; }
    get startDate() { return this.#startDate; }
    get endDate() { return this.#endDate; }
    get active() { return this.#active; }
}

module.exports = CourseSchedule;