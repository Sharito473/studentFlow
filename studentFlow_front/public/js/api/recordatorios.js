import { request } from "./http.js";

function recordatorioPath(idRecordatorio) {
  const recParsed = Number(idRecordatorio);
  
  if (!Number.isSafeInteger(recParsed) || recParsed < 1) {
    throw new TypeError("El ID del recordatorio debe ser un entero mayor que cero.");
  }
  return `/recordatorio/${recParsed}`;
}

/** Filtros: search, page, limit, sort y order. Listado general global. */
export function listarRecordatorio(filtros = {}) {
  return request(`/recordatorio`, { query: filtros });
}

export function obtenerRecordatorio(idRecordatorio) {
  return request(recordatorioPath(idRecordatorio));
}

export function crearRecordatorio(recordatorio) {
  // El id_tarea ahora viaja dentro del objeto 'recordatorio' (en el body)
  return request(`/recordatorio`, { method: "POST", body: recordatorio });
}

/** PUT envía la representación completa; los opcionales omitidos se restablecen. */
export function reemplazarRecordatorio(idRecordatorio, recordatorio) {
  return request(recordatorioPath(idRecordatorio), { method: "PUT", body: recordatorio });
}

/** PATCH envía solamente los campos que se quieren modificar. */
export function actualizarRecordatorio(idRecordatorio, cambios) {
  return request(recordatorioPath(idRecordatorio), { method: "PATCH", body: cambios });
}

/** Devuelve null cuando el backend responde 204. */
export function eliminarRecordatorio(idRecordatorio) {
  return request(recordatorioPath(idRecordatorio), { method: "DELETE" });
}