const Validador = require('../validators/validador');

class Identification {
    #identificationTypeId;
    #identificationNumber;

    constructor({ identificationTypeId, identificationNumber, maxLength = 16 }) {
        this.#validarIdentification(identificationTypeId, identificationNumber, maxLength);

        this.#identificationTypeId = identificationTypeId;
        this.#identificationNumber = identificationNumber;
    }

    #validarIdentification(identificationTypeId, identificationNumber, maxLength) {
        if (identificationTypeId == undefined || identificationTypeId == null) {
            throw new Error('El id del tipo de identificación no puede quedar vacío');
        }
        if (typeof identificationTypeId !== "number" || Number.isNaN(identificationTypeId)) {
            throw new Error("El id del tipo de identificación tiene que ser un número");
        }
        if (identificationTypeId <= 0) {
            throw new Error('El id del tipo de identificación tiene que ser un número mayor a 0');
        }
        Validador.validarSoloDigitos(identificationNumber, 'El número de identificación', maxLength);
    }

    get identificationTypeId() { return this.#identificationTypeId; }
    get identificationNumber() { return this.#identificationNumber; }
}

module.exports = Identification;