import * as recordatorioRepository from "../repositories/recordatorios.repositorio.js";
import { HttpError } from "../utils/http-error.js";

/** Obtiene la lista de todos los recordatorios
 * @async
 * @function listRecordatorio
 * @param {Object} filters - Filtros para consultar los recordatorios (page, limit, etc.)
 * @returns {Promise<Object>} Devuelve todos los recordatorios con su tarea y materia
 */
export async function listRecordatorio(filters) {
    const recordatorios = await recordatorioRepository.findAll(filters); 
    const total = recordatorios.length;
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    return {
        data: recordatorios,
        meta: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
}

/** Obtiene un recordatorio específico perteneciente a una tarea
 * @async
 * @function getRecordatorioById
 * @param {string|number} id - Identificador del recordatorio
 * @param {string|number} id_tarea - Identificador de la tarea
 * @returns {Promise<Object>} - Retorna el recordatorio encontrada
 * @throws {HttpError} - Código 404 (RECORDATORIO_NOT_FOUND) si el recordatorio no existe o no pertenece a la tarea indicado
 */
export async function getRecordatorioById(id, id_tarea) {
    const recordatorio = await recordatorioRepository.findById(id, id_tarea)
    if(!recordatorio){
        throw new HttpError(404, "RECORDATORIO_NOT_FOUND", "El recordatorio no fue encontrada");
    }
    return recordatorio;
}

/** Crea un nuevo recordatorio para una tarea
 * @async
 * @function createRecordatorio
 * @param {string|number} id_tarea - Identificador de la tarea
 * @param {Object} recordatorio - Datos del recordatorio que se desea crear
 * @returns {Promise<Object>} Retorna el recordatorio creado
 */
export async function createRecordatorio(id_tarea, recordatorio) {
    return recordatorioRepository.createRecordatorio(id_tarea, recordatorio);
}

/** Reemplaza los datos de un recordatorio existente.
 * @async
 * @function replaceRecordatorio
 * @param {string|number} id - Identificador del recordatorio que se desea reemplazar
 * @param {string|number} id_tarea - Identificador de la tarea
 * @param {Object} recordatorio - Nuevos datos del recordatorio
 * @returns {Promise<Object>} - Retorna el recordatorio actualizado
 * @throws {HttpError} Código 404 (RECORDATORIO_NOT_FOUND) si el recordatorio no existe
 */
export async function replaceRecordatorio(id, id_tarea, recordatorio) {
    await getRecordatorioById(id, id_tarea);
    return recordatorioRepository.patchRecordatorio(id, id_tarea, recordatorio);
}

/** Actualiza los datos de un recordatorio existente
 * @async
 * @function updateRecordatorio
 * @param {string|number} id - Identificador del recordatorio
 * @param {string|number} id_tarea - Identificador de la tarea
 * @param {Object} patchRecordatorio - Datos del recordatorio que se desean modificar
 * @returns {Promise<Object>} - Retorna el recordatorio con los datos actualizados
 * @throws {HttpError} Código 404 (RECORDATORIO_NOT_FOUND) si el recordatorio no existe
 */
export async function updateRecordatorio(id, id_tarea, patchRecordatorio) {
    await getRecordatorioById(id, id_tarea);
    return recordatorioRepository.patchRecordatorio(id, id_tarea, patchRecordatorio);
}

/** Elimina un recordatorio perteneciente a una tarea
 * @async
 * @function removeRecordatorio
 * @param {string|number} id - Identificador del recordatorio
 * @param {string|number} id_tarea - Identificador de la tarea
 * @returns {Promise<void>}  No retorna ningún valor si el recordatorio es eliminada correctamente
 * @throws {HttpError} Código 404 (RECORDATORIO_NOT_FOUND) si el recordatorio no existe
 */
export async function removeRecordatorio(id, id_tarea) {
    await getRecordatorioById(id, id_tarea);
    await recordatorioRepository.deleteRecordatorio(id, id_tarea);
}