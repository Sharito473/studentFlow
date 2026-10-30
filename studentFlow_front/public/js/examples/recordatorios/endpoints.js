import { consultarEstado } from "../../api/health.js";
import {
    listarRecordatorio, obtenerRecordatorio, crearRecordatorio,
    reemplazarRecordatorio, actualizarRecordatorio, eliminarRecordatorio
} from "../../api/recordatorios.js";
import {
    recordatorioEjemplo, 
    reemplazoRecordatorioEjemplo, 
    cambiosRecordatorioEjemplo, 
    filtrosRecordatorioEjemplo
} from "./datos.js";

// Cada ejemplo se ejecuta únicamente cuando una página llama a ejecutar().
// Para operaciones por ID, usar uno devuelto por listarRecordatorio o crearRecordatorio.
export const ejemplos = {
    health: {
        etiqueta: "Estado del servicio", metodo: "GET", ruta: "/health",
        descripcion: "Comprueba que el backend puede conectarse a MySQL.",
        ejecutar: () => consultarEstado()
    },
    listar: {
        etiqueta: "Listar recordatorio", metodo: "GET", ruta: "/recordatorio",
        descripcion: "Consulta con filtros, ordenamiento y paginación.",
        entrada: "Filtros (JSON)", datos: filtrosRecordatorioEjemplo,
        ejecutar: (filtros) => listarRecordatorio(filtros)
    },
    obtener: {
        etiqueta: "Consultar un recordatorio", metodo: "GET", ruta: "/recordatorio/:id", requiereId: true,
        descripcion: "Consulta un recordatorio existente por su identificador.",
        ejecutar: (idRecordatorio) => obtenerRecordatorio(idRecordatorio)
    },
    crear: {
        etiqueta: "Crear un recordatorio", metodo: "POST", ruta: "/recordatorio",
        descripcion: "Crea un recordatorio nuevo.",
        entrada: "Nuevo recordatorio (JSON)", datos: recordatorioEjemplo,
        ejecutar: (recordatorio) => crearRecordatorio(recordatorio)
    },
    reemplazar: {
        etiqueta: "Reemplazar un recordatorio", metodo: "PUT", ruta: "/recordatorio/:id", requiereId: true,
        descripcion: "Reemplaza los datos de un recordatorio existente con el objeto completo.",
        entrada: "Recordatorio completo (JSON)", datos: reemplazoRecordatorioEjemplo,
        ejecutar: (idRecordatorio, recordatorio) => reemplazarRecordatorio(idRecordatorio, recordatorio)
    },
    actualizar: {
        etiqueta: "Actualizar algunos campos", metodo: "PATCH", ruta: "/recordatorio/:id", requiereId: true,
        descripcion: "Modifica únicamente los campos enviados.",
        entrada: "Cambios (JSON)", datos: cambiosRecordatorioEjemplo,
        ejecutar: (idRecordatorio, cambios) => actualizarRecordatorio(idRecordatorio, cambios)
    },
    eliminar: {
        etiqueta: "Eliminar un recordatorio", metodo: "DELETE", ruta: "/recordatorio/:id", requiereId: true,
        descripcion: "Elimina de la base de datos el recordatorio indicado.",
        ejecutar: (idRecordatorio) => eliminarRecordatorio(idRecordatorio)
    }
};