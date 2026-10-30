// EJEMPLO COMPLETO: Consultar un recordatorio (GET).
// Página: llamadoCompleto/recordatorios/obtener.html, servida por el servidor del proyecto.
// Toda la solicitud y la presentación del resultado están en este archivo.

async function obtenerRecordatorio(evento) {
  // Evitar que el formulario recargue la página al enviarse.
    evento.preventDefault();

    const mensajeEstado = document.querySelector("#estado");
    const boton = document.querySelector("#enviar");
    const cuerpoTabla = document.querySelector("#resultado-body");
    cuerpoTabla.replaceChildren();
    mensajeEstado.textContent = "Enviando solicitud…";
    mensajeEstado.dataset.type = "loading";
    boton.disabled = true;

    try {
        // 1. Definir la base del endpoint global para recordatorios.
        const endpointBase = "/api/v1/recordatorio";

        // 2. Leer y validar el ID del recordatorio.
        const idRecordatorio = Number(document.querySelector("#recordatorio-id").value);
        if (!Number.isSafeInteger(idRecordatorio) || idRecordatorio < 1) {
            throw new Error("El ID del recordatorio debe ser un entero mayor que cero.");
        }

        // 3. Construir la URL global con el ID del recordatorio.
        const url = `${endpointBase}/${idRecordatorio}`;
        console.log("URL de la solicitud:", url);

        // 4. Enviar la petición GET y esperar la respuesta con await.
        const respuesta = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });

        // 5. Leer el cuerpo JSON y convertirlo en un objeto JavaScript.
        const resultado = await respuesta.json();

        // 6. Comprobar el estado HTTP y los errores reportados por el API.
        if (!respuesta.ok || resultado.success === false) {
            throw new Error(resultado.error?.message
                || `La solicitud falló con el estado HTTP ${respuesta.status}`);
        }

        // 7. Extraer el recordatorio que devuelve el backend.
        const recordatorio = resultado.data;
        console.log("Recordatorio recibido:", recordatorio);

        // 8. Crear una fila y mostrar cada dato como texto en la tabla.
        const fila = document.createElement("tr");
        const valores = [
            recordatorio.id,
            recordatorio.id_tarea,
            recordatorio.mensaje,
            recordatorio.fecha_hora,
            recordatorio.canal,
            recordatorio.leido ? "Leído" : "No leído",
            recordatorio.tarea || "N/A",
            recordatorio.materia || "N/A"
        ];
        for (const valor of valores) {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.append(celda);
        }
        cuerpoTabla.append(fila);
        mensajeEstado.textContent = `HTTP ${respuesta.status} · Recordatorio consultado correctamente.`;
        mensajeEstado.dataset.type = "success";
    } catch (error) {
        // 9. Mostrar errores de conexión, validación o respuestas del backend.
        console.error("No se pudo completar la operación:", error.message);
        mensajeEstado.textContent = error.message;
        mensajeEstado.dataset.type = "error";
    } finally {
        // Permitir otra solicitud tanto si funcionó como si falló.
        boton.disabled = false;
    }
}

// 10. Ejecutar la función al enviar el formulario; abrir la página no envía la operación.
document.querySelector("#formulario-recordatorio").addEventListener("submit", obtenerRecordatorio);