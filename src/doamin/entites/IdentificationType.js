const Validador = require('../validators/validador');

class IdentificationType {
    #id;
    #code;
    #name;
    #description;

    constructor({ id, code, name, description = '' }) {
        Validador.validarNumerico(id, 'El id');
        Validador.validarCodigo(code, 6);
        Validador.validarNombre(name, 100);
        Validador.validarDescripcion(description, 250);

        this.#id = id;
        this.#code = code;
        this.#name = name;
        this.#description = description;
    }

    get id() { return this.#id; }
    get code() { return this.#code; }
    get name() { return this.#name; }
    get description() { return this.#description; }
}

module.exports = IdentificationType;