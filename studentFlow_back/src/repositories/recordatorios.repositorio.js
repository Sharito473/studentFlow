import { pool } from "../config/database.js";

/** Define los campos del recordatorio que se pueden utilizar para ordenar los resultados
 * @constant
 * @property {string} id - Identificador del recordatorio
 * @property {string} id_tarea - Campo utilizado para ordenar por identificador de tarea
 * @property {string} mensaje - Mensaje del recordatorio
 * @property {string} fecha_hora - fecha y hora del recordatorio
 * @property {string} canal - Canal donde se enviara el recordatorio
 * @property {string} leido - Verificar si el recordatorio fue leido
 * @property {string} createdAt - Campo utilizado para ordenar por fecha de creación
 */
const sortableFields = {
    id: "r.id_recordatorio",
    id_tarea: "r.id_tarea",
    mensaje: "r.mensaje",
    fecha_hora: "r.fecha_hora",
    canal: "r.canal",
    leido: "r.leido",
    createdAt: "r.created_at"
};


/** Organiza los parámetros de ordenamiento por fecha de creacion
 * @function normalizeSort
 * @param {string} sort - Nombre del campo por el cual se desea ordenar
 * @param {string} order - Dirección del ordenamiento, ascendente o descendente
 * @returns {string} - Retorna el nombre de la columna y la dirección del ordenamiento
 */
function normalizeSort(sort, order) {
  const column = sortableFields[sort] || sortableFields.createdAt;
  const direction = String(order).toLocaleLowerCase() === "desc" ? "DESC" : "ASC";

  return `${column} ${direction}`
}


/** Convierte los datos obtenidos de la base de datos en un objeto de recordatorio
 * @function mapRecordatorio
 * @param {Object} row - Objeto que contiene los datos de un recordatorio obtenidos de la base de datos
 * @param {number} row.id - Identificador del recordatorio
 * @param {number} row.id_tarea - Identificador de la tarea
 * @returns {Object} Retorna un objeto con la información organizada del recordatorio
 */
function mapRecordatorio(row) {
  if (!row) return null;
  return {
    id: row.id_recordatorio,
    id_tarea: row.id_tarea,
    mensaje: row.mensaje,
    fecha_hora: row.fecha_hora,
    canal: row.canal,
    leido: Boolean(row.leido), // Convierte el 1/0 de la base de datos a un booleano real (true/false)
    createdAt: row.created_at,
    tarea: row.tarea_titulo || null,
    materia: row.materia_nombre || null
  };
}

/**
 * Obtiene todos los recordatorios registrados en el sistema con su respectiva tarea y materia
 * @async
 * @function findAll
 * @param {Object} filters - Filtros de paginación y ordenamiento
 * @returns {Promise<Array>} Lista de recordatorios
 */
export async function findAll(filters = {}) {
    const orden = normalizeSort(filters.sort, filters.order);
    
    const [rows] = await pool.query(
      `SELECT 
          r.id_recordatorio, 
          r.id_tarea, 
          r.mensaje, 
          DATE_FORMAT(r.fecha_hora, '%Y-%m-%d %H:%i:%s') AS fecha_hora,
          r.canal, 
          r.leido, 
          DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
          t.titulo AS tarea_titulo, 
          m.nombre AS materia_nombre
        FROM recordatorio r
        JOIN tarea t ON r.id_tarea = t.id_tarea
        JOIN materia m ON t.id_materia = m.id_materia
        ORDER BY ${orden}`
    );
    return rows.map(mapRecordatorio);
}

/**
 * Busca un recordatorio por su ID
 * @async
 * @function findById
 * @param {number|string} id - Identificador del recordatorio
 * @param {number|string} id_tarea - Identificador de la tarea
 * @returns {Promise<Object|null>} El recordatorio encontrado o null
 */
export async function findById(id, id_tarea) {
    const [rows] = await pool.query(
      `SELECT 
          r.id_recordatorio, 
          r.id_tarea, 
          r.mensaje, 
          r.fecha_hora, 
          r.canal, 
          r.leido, 
          r.created_at,
          t.titulo AS tarea_titulo, 
          m.nombre AS materia_nombre
        FROM recordatorio r
        JOIN tarea t ON r.id_tarea = t.id_tarea
        JOIN materia m ON t.id_materia = m.id_materia
        WHERE r.id_recordatorio = ? AND r.id_tarea = ?`,
        [id, id_tarea]
    );
    return rows[0] ? mapRecordatorio(rows[0]) : null;
}

/** Crea un nuevo recordatorio asociada a una tarea
 * @async
 * @function createRecordatorio
 * @param {string|number} id_tarea - Identificador de la tarea propietaria del recordatorio
 * @param {Object} recordatorio - Contiene la información del recordatorio
 * @param {string} recordatorio.mensaje - Mensaje del recordatorio
 * @param {datetime} recordatorio.fecha_hora - Fecha y hora del recordatorio
 * @param {enum} recordatorio.canal - Canal por el quese enviare el recordario
 * @param {boolean} recordatorio.leido - Indica si el recordario fue leido
 * @returns {Promise<Object|null>} - Retorna el recordatorio creada
 */
export async function createRecordatorio(id_tarea, recordatorio) {
  const [result] = await pool.execute(
    `INSERT INTO recordatorio (id_tarea, mensaje, fecha_hora, canal, leido)
      VALUES (?, ?, ?, ?, ?)`,
    [
      id_tarea,
      recordatorio.mensaje,
      recordatorio.fecha_hora,
      recordatorio.canal,
      recordatorio.leido ? 1 : 0
    ]
  );

  return findById(result.insertId, id_tarea);
}

/** Actualiza los datos de un recordario
 * @async
 * @function patchRecordatorio
 * @param {string|number} id - Identificador del recordario que se desea actualizar
 * @param {string|number} id_tarea - Identificador de la tarea propietaria del recordatorio
 * @param {Object} partialRecordatorio - Contiene los datos del recordatiro que se desean modificar
 * @returns {Promise<Object|null>} Retorna el recordatorio actualizado
 */
export async function patchRecordatorio(id, id_tarea, partialRecordatorio) {
  const fields = [];
  const params = [];

  if (partialRecordatorio.mensaje !== undefined) {
    fields.push("mensaje = ?");
    params.push(partialRecordatorio.mensaje);
  }

  if (partialRecordatorio.fecha_hora !== undefined) {
    fields.push("fecha_hora = ?");
    params.push(partialRecordatorio.fecha_hora);
  }

  if (partialRecordatorio.canal !== undefined) {
    fields.push("canal = ?");
    params.push(partialRecordatorio.canal);
  }

  if (partialRecordatorio.leido !== undefined) {
    fields.push("leido = ?");
    params.push(partialRecordatorio.leido? 1 : 0); //Convertir a 1 o 0 para MySQL
  }

  if (fields.length === 0) {
    return findById(id, id_tarea);
  }

  params.push(id, id_tarea);

  await pool.execute(
    `UPDATE recordatorio
      SET ${fields.join(", ")}
      WHERE id_recordatorio = ? AND id_tarea = ?`,
    params
  );

  return findById(id, id_tarea);
}

/** Elimina un recordatorio perteneciente a una tarea
 * @async
 * @function deleteRecordatorio
 * @param {string|number} id - Identificador del recordatorio que se desea eliminar
 * @param {string|number} id_tarea - Identificador de la tarea propietaria a un recordatorio
 * @returns {Promise<boolean>} Retorna true si el recordatorio fue eliminada y false si no se encontró un recordatorio que coincida 
 */
export async function deleteRecordatorio(id, id_tarea) {
  const [result] = await pool.execute(
    "DELETE FROM recordatorio WHERE id_recordatorio = ? AND id_tarea = ?",
    [id, id_tarea]
  );

  return result.affectedRows > 0;
}

