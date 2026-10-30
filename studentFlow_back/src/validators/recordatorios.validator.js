import { HttpError } from "../utils/http-error.js";


/** Convierte un valor a tipo booleano y valida que sea correcto
 * @function parseBoolean
 * @param {boolean|string|undefined} value - Valor que se desea convertir
 * @returns {boolean|undefined} - Retorna true, false o undefined si no se envía un valor
 * @throws {HttpError} - Código 422 (VALIDATION_ERROR) si el valor no es true ni false
 */
function parseBoolean(value) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value).toLowerCase();

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  throw new HttpError(422, "VALIDATION_ERROR", "El filtro 'leido' debe ser true o false.");
}

/** Convierte un valor a número entero y valida que sea positivo o cero
 * @function parsePositiveInteger
 * @param {string|number|null|undefined} value - Valor que se desea validar
 * @param {string} fieldName - Nombre del campo que se está validando
 * @returns {number|null} - Retorna el número entero o null si no se envía un valor
 * @throws {HttpError} Código 422 (VALIDATION_ERROR) si el valor no es un entero positivo o cero
 */
function parsePositiveInteger(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new HttpError(422, "VALIDATION_ERROR", `El campo '${fieldName}' debe ser un entero positivo o cero.`);
  }

  return parsed;
}

/** Valida que un campo sea un texto y elimina espacios al inicio y al final
 * @function normalizeString
 * @param {string} value - Valor del campo que se desea validar
 * @param {string} fieldName - Nombre del campo que se está validando
 * @returns {string} Retorna el texto sin espacios adicionales
 * @throws {HttpError} Código 422 (VALIDATION_ERROR) si el campo está vacío o no es un texto
 */
function normalizeString(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(422, "VALIDATION_ERROR", `El campo '${fieldName}' es obligatorio.`);
  }

  return value.trim();
}

/** Valida y normaliza una fecha y hora (formato DATETIME)
 * @function normalizeDatetime
 * @param {string} value - Fecha y hora en formato string
 * @param {string} fieldName - Nombre del campo
 * @returns {string} Retorna la fecha validada
 * @throws {HttpError} Código 422 si la fecha no es válida
 */
function normalizeDatetime(value, fieldName) {
  const normalized = normalizeString(value, fieldName);
  const date = new Date(normalized);

  if (isNaN(date.getTime())) {
    throw new HttpError(422, "VALIDATION_ERROR", `El campo '${fieldName}' debe ser una fecha y hora válida.`);
  }

  return normalized;
}

/** Valida que el canal pertenezca a los valores permitidos del ENUM
 * @function normalizeEnum
 * @param {string} value - Canal enviado
 * @param {string} fieldName - Nombre del campo
 * @returns {string} Canal validado
 * @throws {HttpError} Código 422 si el canal no es válido
 */
function normalizeEnum(value, fieldName) {
  const normalized = normalizeString(value, fieldName);
  
  // Puedes ajustar estos valores según los ENUM exactos que tenga tu base de datos para el canal
  const canalesPermitidos = ["push", "email", "whatsapp", "sms", "notificacion"]; 

  if (!canalesPermitidos.includes(normalized.toLowerCase())) {
    throw new HttpError(422, "VALIDATION_ERROR", `El campo '${fieldName}' contiene un valor no permitido.`);
  }

  return normalized.toLowerCase();
}

/** Valida los parámetros de consulta utilizados para listar un recordatorio
 * @function validateRecordatorioListQuery
 * @param {Object} query - Parámetros enviados en la consulta de la petición
 * @param {string} [query.leido] - Estado del recordario (true o false)
 * @param {string} [query.search] - Texto para buscar por nombre o código
 * @param {string} [query.sort] - Campo por el cual se ordenarán los resultados
 * @param {string} [query.order] - Dirección del ordenamiento (ASC o DESC)
 * @param {string|number} [query.page] - Número de página
 * @param {string|number} [query.limit] - Cantidad de registros por página.
 * @returns {Object} Retorna los parámetros de consulta validados
 * @throws {HttpError} Código 422 (VALIDATION_ERROR) si page o limit tienen valores inválidos
 */
export function validateRecordatorioListQuery(query) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);

  if (!Number.isInteger(page) || page < 1) {
    throw new HttpError(422, "VALIDATION_ERROR", "El parámetro 'page' debe ser un entero mayor o igual a 1.");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new HttpError(422, "VALIDATION_ERROR", "El parámetro 'limit' debe ser un entero entre 1 y 100.");
  }

  return {
    leido: parseBoolean(query.leido),
    search: typeof query.search === "string" ? query.search.trim() : "",
    sort: query.sort,
    order: query.order,
    page,
    limit
  };
}

/** Valida que el identificador de un recordatorio sea un número entero mayor que cero
 * @function validateRecordatorioId
 * @param {string|number} id - Identificador del recordatorio
 * @returns {number} Retorna el identificador convertido a número
 * @throws {HttpError} Código 400 (INVALID_ID) si el identificador no es válido
 */
export function validateRecordatorioId(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    throw new HttpError(400, "INVALID_ID", "El identificador del recordatorio no es válido.");
  }

  return parsedId;
}

/** Valida los datos necesarios para crear un nuevo recordatorio 
 * @function validateCreateRecordatorio
 * @param {Object} body - Información enviada en la petición
 * @returns {Object} - Retorna los datos validados y normalizados.
 * @throws {HttpError} Código 422 (VALIDATION_ERROR) si algún dato es inválido.
 */
export function validateCreateRecordatorio(body) {
  // Validar que venga el id_tarea y sea un entero positivo
  const id_tarea = parsePositiveInteger(body.id_tarea, "id_tarea");
  if (!id_tarea) {
    throw new HttpError(422, "VALIDATION_ERROR", "El campo 'id_tarea' es obligatorio y debe ser un entero positivo.");
  }

  const mensaje = normalizeString(body.mensaje, "mensaje");
  const fecha_hora = normalizeDatetime(body.fecha_hora, "fecha_hora");
  const canal = normalizeEnum(body.canal, "canal");
  const leido = body.leido === undefined ? false : parseBoolean(body.leido);

  return {
    id_tarea,
    mensaje,
    fecha_hora,
    canal,
    leido
  };
}
/* export function validateCreateRecordatorio(body) {
  const mensaje = normalizeString(body.mensaje, "mensaje");
  const fecha_hora = normalizeDatetime(body.fecha_hora, "fecha_hora");
  const canal = normalizeEnum(body.canal, "canal");
  const leido = body.leido === undefined ? false : parseBoolean(body.leido);

  return {
    mensaje,
    fecha_hora,
    canal,
    leido
  };
} */

/** Valida los datos enviados para actualizar un recordario
 * @function validatePatchRecordario
 * @param {Object} body - Información enviada en la petición
 * @returns {Object} Retorna los campos válidos para actualizar
 * @throws {HttpError} Código 422 (VALIDATION_ERROR) si no se envían campos válidos o algún dato es incorrecto
 */
export function validatePatchRecordario(body) {
  const payload = {};

  if (body.mensaje !== undefined) {
    payload.mensaje = normalizeString(body.mensaje, "mensaje");
  }

  if (body.fecha_hora !== undefined) {
    payload.fecha_hora = normalizeString(body.fecha_hora, "fecha_hora");
  }

  if (body.canal !== undefined) {
    payload.canal = normalizeEnum(body.canal, "canal");
  }

  if (body.leido !== undefined) {
    payload.leido = parseBoolean(body.leido);
  }

  if (body.id_tarea !== undefined) {
    payload.id_tarea = parsePositiveInteger(body.id_tarea, "id_tarea");
  }

  if (Object.keys(payload).length === 0) {
    throw new HttpError(422, "VALIDATION_ERROR", "No se enviaron campos válidos para actualizar.");
  }

  return payload;
}

