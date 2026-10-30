// Controlador para gestionar las peticiones HTTP relacionadas con el recordatorio de una tarea

import { request } from "express";
import * as recordatorioService from "../services/recordatorios.service.js";
import { sendNoContent, sendSuccess } from "../utils/api-response.js";

import {
    validateCreateRecordatorio,
    validateRecordatorioId,
    validateRecordatorioListQuery,
    validatePatchRecordario
} from "../validators/recordatorios.validator.js";

/** Obtiene la lista de recordatorios registrados para una tarea
 * @async
 * @function listRecordatorio
 * @param {Object} request - La información que llega del usuario
 * @param {Object} request.params - Parámetros de la ruta
 * @param {string|number} request.params.id_tarea - Identificador de la tarea propietaria de los recordatorios
 * @param {Object} request.query - Parámetros de consulta para filtrar o listar recordatorios
 * @param {Object} response - La respuesta que se le va a devolver al usuario
 * @param {Function} next - Si algo sale mal, esta función se llama para avisarle al manejador de errores
 * @returns {Promise<Object>} Retorna la lista de recordatorios de la tarea
 * @throws {Error} Envía cualquier error al middleware de manejo de errores
 */
export async function listRecordatorio(request, response, next) {
    try {
        const filters = validateRecordatorioListQuery(request.query);
        const result = await recordatorioService.listRecordatorio(filters);
        return sendSuccess(response, result.data, 200, result.meta);
    } catch (error) {
        return next(error);
    }
}

/** Obtiene un recordatorio específico a partir de su identificador
 * @async
 * @function getRecordatorio
 * @param {Object} request - La información que llega del usuario
 * @param {Object} request.params - Datos que se envían en la dirección web para identificar un recurso específico
 * @param {string|number} request.params.id_tarea - Identificador de la tarea propietaria de los recordatorios
 * @param {Object} request.query - Parámetros de consulta para filtrar o listar recordatorios
 * @param {Object} response - La respuesta que se le va a devolver al usuario
 * @param {Function} next - Función que envía el error al siguiente middleware(manejo de errores)
 * @returns {Promise<Object>} Retorna la información de un recordatorio solicitada
 * @throws {Error} Envía cualquier error al middleware de manejo de errores
*/
export async function getRecordatorio(request, response, next) {
    try {
        const id = validateRecordatorioId(request.params.id)
        const recordatorio = await recordatorioService.getRecordatorioById(id, request.params.id_tarea);
        return sendSuccess(response, recordatorio)
    } catch (error) {
        return next(error); 
    }
}

/** Crea un recordatorio nuevo para uan tarea autenticada
 * @async
 * @function createRecordatorio
 * @param {Object} request - La información que llega del usuario
 * @param {Object} request.body - Datos del recordatorio a crear
 * @param {Object} request.params - Datos que se envían en la dirección web para identificar un recurso específico
 * @param {string|number} request.params.id_tarea - Identificador de la tarea propietaria de los recordatorios
 * @param {Object} response - La respuesta que se le va a devolver al usuario
 * @param {Function} next - Función que envía el error al siguiente middleware
 * @returns {Promise<Object>} - Devuelve el recordatorio creada y confirma la operación con el código de estado 201
 * @throws {Error} Envía cualquier error al middleware de manejo de errores
 */
export async function createRecordatorio(request, response, next) {
    try {
        const payload = validateCreateRecordatorio(request.body);
        const recordatorio = await recordatorioService.createRecordatorio(request.params.id_tarea, payload);
        return sendSuccess(response, recordatorio, 201);
    } catch (error) {
        return next(error);
    }
}

/** Reemplaza completamente la información de un recordatorio existente.
 * @async
 * @function replaceRecordatorio
 * @param {Object} request - La información que llega del usuario
 * @param {Object} request.params - Datos que se envían en la dirección web para identificar un recurso específico
 * @param {string|number} request.params.id_tarea - Identificador de la tarea propietaria de los recordatorios
 * @param {Object} request.body - Nuevos datos del recordatorio
 * @param {Object} response - La respuesta que se le va a devolver al usuario
 * @param {Function} next - Función que envía el error al siguiente middleware
 * @returns {Promise<Object>} Retorna el recordatorio actualizado
 * @throws {Error} Envía cualquier error al middleware de manejo de errores
 */
export async function replaceRecordatorio(request, response, next) {
    try {
        const id = validateRecordatorioId(request.params.id);
        const payload = validateCreateRecordatorio(request.body);
        const recordatorio = await recordatorioService.replaceRecordatorio(id, request.params.id_tarea, payload);
        return sendSuccess(response, recordatorio);
    } catch (error) {
        return next(error);
    }
}

/** Actualiza la información de un recordatorio existente.
 * @async
 * @function updateRecordatorio
 * @param {Object} request - La información que llega del usuario
 * @param {Object} request.params - Datos para identificar recursos específicos
 * @param {string|number} request.params.id - Identificador del recordatorio
 * @param {string|number} request.params.id_tarea - Identificador de la tarea propietaria
 * @param {Object} request.body - Datos del recordatorio que se van a modificar
 * @param {Object} response - La respuesta que se le va a devolver al usuario
 * @param {Function} next - Función que envía el error al siguiente middleware
 * @returns {Promise<Object>} Retorna el recordatorio con la información actualizada
 * @throws {Error} Envía cualquier error al middleware de manejo de errores.
 */
export async function updateRecordatorio(request, response, next) {
    try {
        const id = validateRecordatorioId(request.params.id);
        const id_tarea = validateTareaId(request.params.id_tarea); 
        const payload = validatePatchRecordatorio(request.body);
        
        const recordatorio = await recordatorioService.updateRecordatorio(id, id_tarea, payload);
        return sendSuccess(response, recordatorio);
    } catch (error) {
        return next(error);
    }
}

/** Elimina un recordatorio de la tarea autenticada
 * @async
 * @function deleteRecordatorio
 * @param {Object} request - La información que llega del usuario
 * @param {string|number} request.params.id - Identificador del recordatorio
 * @param {string|number} request.params.id_tarea - Identificador de la tarea propietaria
 * @param {Object} response - La respuesta que se le va a devolver al usuario
 * @param {Function} next - Función que envía el error al siguiente middleware
 * @returns {Promise<void>} No retorna contenido cuando la eliminación es exitosa
 * @throws {Error} Envía cualquier error al middleware de manejo de errores
 */
export async function deleteRecordatorio(request, response, next) {
    try {
        const id = validateRecordatorioId(request.params.id);
        await recordatorioService.removeRecordatorio(id, request.params.id_tarea);
        return sendNoContent(response);
    } catch (error) {
        return next(error);
    }
}