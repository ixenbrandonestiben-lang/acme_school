const Validador = require('../validators/validador');

class Rate {
    #id;
    #inscriptionId;
    #rate;
    #comments;

    constructor({ id, inscriptionId, rate, comments = '' }) {
        Validador.validarNumerico(id, 'El id');
        Validador.validarNumerico(inscriptionId, 'La inscripción');
        Validador.validarNumerico(rate, 'La calificación');
        Validador.validarComentarios(comments, 250);

        this.#id = id;
        this.#inscriptionId = inscriptionId;
        this.#rate = rate;
        this.#comments = comments;
    }

    get id() { return this.#id; }
    get inscriptionId() { return this.#inscriptionId; }
    get rate() { return this.#rate; }
    get comments() { return this.#comments; }
}

module.exports = Rate;