const Validador = require('../validators/validador');

class Teacher {
    #id;
    #firstName;
    #lastName;
    #identificationTypeId;
    #identificationNumber;
    #email;

    constructor({ id, firstName, lastName, identificationTypeId, identificationNumber, email }) {
        Validador.validarNumerico(id, 'El id');
        Validador.validarNombre(firstName, 60);
        Validador.validarNombre(lastName, 60);
        Validador.validarNumerico(identificationTypeId, 'El tipo de identificación');
        Validador.validarSoloDigitos(identificationNumber, 'El número de identificación', 16);
        Validador.validarEmail(email, 'El correo');

        this.#id = id;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#identificationTypeId = identificationTypeId;
        this.#identificationNumber = identificationNumber;
        this.#email = email;
    }

    get id() { return this.#id; }
    get firstName() { return this.#firstName; }
    get lastName() { return this.#lastName; }
    get identificationTypeId() { return this.#identificationTypeId; }
    get identificationNumber() { return this.#identificationNumber; }
    get email() { return this.#email; }
}

module.exports = Teacher;