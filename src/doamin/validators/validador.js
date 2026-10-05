class Validador {
    static validarCodigo(code, maxLength = 10) {
        if (!code || code.trim().length === 0) {
            throw new Error('El código es un campo obligatorio');
        }
        if (code.trim().length > maxLength) {
            throw new Error(`El código no puede tener más de ${maxLength} caracteres`);
        }
    }

    static validarNombre(name, maxLength = 10) {
        if (!name || name.trim().length === 0) {
            throw new Error('El nombre es obligatorio');
        }
        if (name.trim().length > maxLength) {
            throw new Error(`El nombre no puede tener más de ${maxLength} caracteres`);
        }
    }

    static validarDescripcion(description, maxLength = 250) {
        if (description && description.trim().length > maxLength) {
            throw new Error(`La descripción no puede tener más de ${maxLength} caracteres`);
        }
    }

    static validarNumerico(numero, campo = 'El valor') {
        if (numero === undefined || numero === null) {
            throw new Error(`${campo} no puede quedar vacío`);
        }
        if (typeof numero !== 'number' || Number.isNaN(numero)) {
            throw new Error(`${campo} debe ser un número`);
        }
        if (numero < 0) {
            throw new Error(`${campo} debe ser un número positivo, mayor o igual a 0`);
        }
    }

    static validarActivo(activo, campo = 'El estado') {
        if (activo == undefined || activo === null) {
            throw new Error(`${campo} no puede quedar vacío`);
        }
        if (activo !== 0 && activo !== 1) {
            throw new Error(`${campo} debe ser 0 (inactivo) o 1 (activo)`);
        }
    }

    static validarComentarios(comments, maxLength = 250) {
        if (comments && comments.trim().length > maxLength) {
            throw new Error(`El comentario no puede tener más de ${maxLength} caracteres`);
        }
    }

    static validarSoloDigitos(valor, campo = 'El valor', exactLength = null) {
        if (!valor || valor.trim().length === 0) {
            throw new Error(`${campo} no puede quedar vacío`);
        }
        if (!/^\d+$/.test(valor.trim())) {
            throw new Error(`${campo} debe contener solamente dígitos`);
        }
        if (exactLength !== null && valor.trim().length != exactLength) {
            throw new Error(`${campo} debe tener exactamente ${exactLength} dígitos`);
        }
    }

    static validarEmail(email, campo = 'El correo') {
        if (typeof email !== 'string') {
            throw new Error("El correo debe ser texto");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("El correo no tiene un formato válido");
        }
    }

    static validarRangoFecha(startDate, endDate) {
        if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
            throw new Error("La fecha de inicio no es válida");
        }
        if (!(endDate instanceof Date) || Number.isNaN(endDate.getTime())) {
            throw new Error("La fecha de culminación no es válida");
        }
        if (startDate >= endDate) {
            throw new Error("La fecha de inicio debe ser anterior a la fecha de culminación");
        }
    }
}

module.exports = Validador;