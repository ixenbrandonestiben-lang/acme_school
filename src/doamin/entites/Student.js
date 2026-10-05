const Validador = require('../validators/validador');

class Student {
    #id;
    #code;
    #firstName;
    #lastName;
    #identificationTypeId;
    #identificationNumber;
    #gender;
    #birthday;
    #email;
    #address;
    #cityId;

    constructor({ id, code, firstName, lastName, identificationTypeId, identificationNumber, gender, birthday, email, address, cityId }) {
        Validador.validarNumerico(id, 'El id');
        Validador.validarCodigo(code, 14);
        Validador.validarNombre(firstName, 60);
        Validador.validarNombre(lastName, 60);
        Validador.validarNumerico(identificationTypeId, 'El tipo de identificación');
        Validador.validarSoloDigitos(identificationNumber, 'El número de identificación', 16);
        Validador.validarEmail(email);
        Validador.validarNumerico(cityId, 'La ciudad');

        this.#id = id;
        this.#code = code;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#identificationTypeId = identificationTypeId;
        this.#identificationNumber = identificationNumber;
        this.#gender = gender;
        this.#birthday = birthday;
        this.#email = email;
        this.#address = address;
        this.#cityId = cityId;
    }

    get id() { return this.#id; }
    get code() { return this.#code; }
    get firstName() { return this.#firstName; }
    get lastName() { return this.#lastName; }
    get identificationTypeId() { return this.#identificationTypeId; }
    get identificationNumber() { return this.#identificationNumber; }
    get gender() { return this.#gender; }
    get birthday() { return this.#birthday; }
    get email() { return this.#email; }
    get address() { return this.#address; }
    get cityId() { return this.#cityId; }
}

module.exports = Student;