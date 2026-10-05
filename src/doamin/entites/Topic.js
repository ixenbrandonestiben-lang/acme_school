const Validador = require('../validators/validador');

class Topic {
    #id;
    #courseId;
    #code;
    #title;
    #description;
    #active;

    constructor({ id, courseId, code, title, description, active }) {
        Validador.validarNumerico(id, 'El id');
        Validador.validarNumerico(courseId, 'El curso');
        Validador.validarCodigo(code, 10);
        Validador.validarNombre(title, 100);
        Validador.validarDescripcion(description, 250);
        Validador.validarActivo(active, 'La disponibilidad');

        this.#id = id;
        this.#courseId = courseId;
        this.#code = code;
        this.#title = title;
        this.#description = description;
        this.#active = active;
    }

    get id() { return this.#id; }
    get courseId() { return this.#courseId; }
    get code() { return this.#code; }
    get title() { return this.#title; }
    get description() { return this.#description; }
    get active() { return this.#active; }
}

module.exports = Topic;