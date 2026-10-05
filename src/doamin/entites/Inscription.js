const Validador = require('../validators/validador');

class Inscription {
    #id;
    #courseScheduleId;
    #studentId;
    #registerDate;
    #active;

    constructor({ id, courseScheduleId, studentId, registerDate, active }) {
        Validador.validarNumerico(id, 'El id');
        Validador.validarNumerico(courseScheduleId, 'El horario de curso');
        Validador.validarNumerico(studentId, 'El estudiante');
        Validador.validarActivo(active, 'El estado');

        this.#id = id;
        this.#courseScheduleId = courseScheduleId;
        this.#studentId = studentId;
        this.#registerDate = registerDate;
        this.#active = active;
    }

    get id() { return this.#id; }
    get courseScheduleId() { return this.#courseScheduleId; }
    get studentId() { return this.#studentId; }
    get registerDate() { return this.#registerDate; }
    get active() { return this.#active; }
}

module.exports = Inscription;