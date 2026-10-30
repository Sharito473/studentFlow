import { Router } from "express"

import {
    listRecordatorio,
    getRecordatorio,
    createRecordatorio,
    replaceRecordatorio,
    updateRecordatorio,
    deleteRecordatorio
}from "../controllers/recordatorios.controller.js"


/**
 * Crea las rutas relacionadas con los recordatorios
 * @constant
 * @type {Router}
 */
const router = Router(); 

router.get("/", listRecordatorio); //Obtiene la lista de recordatorio
router.get("/:id", getRecordatorio) // Obtiene un recordatorio específico
router.post("/", createRecordatorio); // Crea un nuevo recordatorio
router.put("/:id", replaceRecordatorio); //Reemplaza un recordatorio
router.patch("/:id", updateRecordatorio); // Actualiza un recordatorio
router.delete("/:id", deleteRecordatorio); // Elimina un recordatorio

export default router;