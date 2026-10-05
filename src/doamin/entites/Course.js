const Validador = require('../validators/validador');

class Course {
    #id;
    #code;
    #description;
    #intensity;
    #weight;
    #active;

    constructor({ id, code, description = '', intensity, weight, active }) {
        Validador.validarNumerico(id, 'El id');
        Validador.validarCodigo(code, 10);
        Validador.validarDescripcion(description, 250);
        Validador.validarActivo(active, 'El estado');
        Validador.validarNumerico(intensity, 'La intensidad');
        Validador.validarNumerico(weight, 'El peso');

        this.#id = id;
        this.#code = code;
        this.#description = description;
        this.#intensity = intensity;
        this.#weight = weight;
        this.#active = active;
    }

    get id() { return this.#id; }
    get code() { return this.#code; }
    get description() { return this.#description; }
    get intensity() { return this.#intensity; }
    get weight() { return this.#weight; }
    get active() { return this.#active; }
}

module.exports = Course;