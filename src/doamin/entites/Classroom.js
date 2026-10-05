const Validador = require('../validators/validador');

class Classroom {
    #id;
    #code;
    #description;
    #capacity;
    #active;

    constructor({ id, code, description, capacity, active }) {
        Validador.validarNumerico(id, 'El id');
        Validador.validarCodigo(code, 10);
        Validador.validarDescripcion(description, 250);
        Validador.validarNumerico(capacity, 'La capacidad');
        Validador.validarActivo(active, 'El estado');

        this.#id = id;
        this.#code = code;
        this.#description = description;
        this.#capacity = capacity;
        this.#active = active;
    }

    get id() { return this.#id; }
    get code() { return this.#code; }
    get description() { return this.#description; }
    get capacity() { return this.#capacity; }
    get active() { return this.#active; }
}

module.exports = Classroom;