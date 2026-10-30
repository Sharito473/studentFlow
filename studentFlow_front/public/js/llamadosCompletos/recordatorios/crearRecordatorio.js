// EJEMPLO COMPLETO: Crear recordatorio (POST).
// Página: llamadoCompleto/recordatorios/crear.html, servida por el servidor del proyecto.
// Toda la solicitud y la presentación del resultado están en este archivo.

async function crearRecordatorio(evento) {
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

        // 2. Leer y validar el ID de la tarea asociada para incluirlo en el body.
        const idTarea = Number(document.querySelector("#tarea-id").value);
        if (!Number.isSafeInteger(idTarea) || idTarea < 1) {
            throw new Error("El ID de la tarea debe ser un entero mayor que cero.");
        }

        // 3. Leer los campos del formulario, incluyendo el id_tarea en el objeto JavaScript.
        const datosRecordatorio = {
            id_tarea: idTarea,
            mensaje: document.querySelector("#mensaje").value.trim(),
            fecha_hora: document.querySelector("#fecha-hora").value,
            canal: document.querySelector("#canal").value.trim(),
            leido: document.querySelector("#leido").value === "true"
        };

        // 4. Utilizar la URL global limpia.
        const url = endpointBase;
        console.log("URL de la solicitud:", url);
        console.log("Datos enviados:", datosRecordatorio);

        // 5. Enviar la petición POST y esperar la respuesta con await.
        const respuesta = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosRecordatorio)
        });

        // 6. Leer el cuerpo JSON y convertirlo en un objeto JavaScript.
        const resultado = await respuesta.json();

        // 7. Comprobar el estado HTTP y los errores reportados por el API.
        if (!respuesta.ok || resultado.success === false) {
            throw new Error(resultado.error?.message
                || `La solicitud falló con el estado HTTP ${respuesta.status}`);
        }

        // 8. Extraer el recordatorio que devuelve el backend.
        const recordatorio = resultado.data;
        console.log("Recordatorio recibido:", recordatorio);

        // 9. Crear una fila y mostrar cada dato como texto en la tabla.
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
        mensajeEstado.textContent = `HTTP ${respuesta.status} · Recordatorio creado. ID: ${recordatorio.id}.`;
        mensajeEstado.dataset.type = "success";
    } catch (error) {
        // 10. Mostrar errores de conexión, validación o respuestas del backend.
        console.error("No se pudo completar la operación:", error.message);
        mensajeEstado.textContent = error.message;
        mensajeEstado.dataset.type = "error";
    } finally {
        // Permitir otra solicitud tanto si funcionó como si falló.
        boton.disabled = false;
    }
}

// 11. Ejecutar la función al enviar el formulario; abrir la página no envía la operación.
document.querySelector("#formulario-recordatorio").addEventListener("submit", crearRecordatorio);