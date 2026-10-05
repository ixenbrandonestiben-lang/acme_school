const Validador = require('../validators/validador');

class City {
    #id;
    #code;
    #name;

    constructor({ id, code, name }) {
        Validador.validarNumerico(id, 'El id');
        Validador.validarCodigo(code, 10);
        Validador.validarNombre(name, 100);

        this.#id = id;
        this.#code = code;
        this.#name = name;
    }

    get id() { return this.#id; }
    get code() { return this.#code; }
    get name() { return this.#name; }
}

module.exports = City;