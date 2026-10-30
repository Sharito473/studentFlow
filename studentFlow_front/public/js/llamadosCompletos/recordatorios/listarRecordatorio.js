// EJEMPLO: consultar el listado de recordatorios de una tarea del API.
// Cargar desde una página servida por el frontend.

async function listarRecordatorio() {
    // 1. Definir el endpoint.
  // El servidor del frontend reenvía esta ruta al backend.
    const endpoint = "/api/v1/recordatorio";

    // 2. Preparar los filtros que enviaremos en la URL
    const filtros = new URLSearchParams({
        page: "1",
        limit: "20",
        sort: "fecha_hora",
        order: "asc"
    });

    // 3. Construir la URL completa.
    const url = `${endpoint}?${filtros.toString()}`;
    console.log("URL que vamos a consultar:", url);

    // Buscar los elementos del HTML donde mostraremos el resultado.
  // Si no existen, el ejemplo seguirá mostrando los datos en la consola.
    const cuerpoTabla = document.querySelector("#recordatorio-body") || document.querySelector("#resultado-body");
    const mensajeEstado = document.querySelector("#estado");
    const resumenPaginacion = document.querySelector("#paginacion");
    const botonRecargar = document.querySelector("#recargar-recordatorio") || document.querySelector("#enviar");

    if (cuerpoTabla) cuerpoTabla.replaceChildren();
    if (resumenPaginacion) resumenPaginacion.textContent = "";
    if (botonRecargar) botonRecargar.disabled = true;
    if (mensajeEstado) {
        mensajeEstado.textContent = "Consultando recordatorios…";
        mensajeEstado.dataset.type = "loading";
    }

    try {
        // 4. Enviar la petición HTTP.
        // GET consulta información y no necesita un cuerpo (body).
        // await espera hasta recibir la respuesta del servidor.
        const respuesta = await fetch(url, {
            method: "GET",
            headers: { 
                Accept: "application/json" 
            }
        });

        // 5. Convertir el cuerpo JSON en un objeto JavaScript.
        // El backend devuelve: { success, data, meta }.
        const resultado = await respuesta.json();

        // 6. Comprobar si el servidor reportó un error.
        // respuesta.ok es true para estados HTTP entre 200 y 299.
        /* if (!respuesta.ok || resultado.success === false) {
        throw new Error(resultado.error?.message || `La consulta falló con el estado HTTP ${respuesta.status}`);
        } */
        if (!respuesta.ok || resultado.success === false) {
            const mensaje = resultado.error?.message
            || `La consulta falló con el estado HTTP ${respuesta.status}`;
            throw new Error(mensaje);
        }

        // 7. Extraer los recordatorios y la información de paginación.
        const recordatorio = resultado.data;
        const paginacion = resultado.meta;

        // 8. Mostrar la información en la consola y en la tabla HTML.
        console.table(recordatorio);
        console.log("Total de materias:", paginacion.total);
        console.log("Página actual:", paginacion.page);
        console.log("Total de páginas:", paginacion.pages);

        if (cuerpoTabla) {
            // Recorrer el arreglo recibido y crear una fila por cada recordatorio
            for (const recordatorios of recordatorio) {
                const fila = document.createElement("tr");
                const valores = [
                    recordatorios.id,
                    recordatorios.mensaje,
                    recordatorios.fecha_hora,
                    recordatorios.canal,
                    recordatorios.leido ? "Leído" : "No leído",
                    recordatorios.tarea ?? "Sin tarea",
                    recordatorios.materia ?? "Sin materia"
                ];

                // Cada valor se convierte en una celda de la fila.
                for (const valor of valores) {
                    const celda = document.createElement("td");
                    // textContent muestra el dato como texto, sin interpretarlo como HTML.
                    celda.textContent = valor;
                    fila.append(celda);
                }
                cuerpoTabla.append(fila);
            }
        }

        if (mensajeEstado) {
        mensajeEstado.textContent = recordatorio.length === 0
            ? "No se encontraron recordatorios."
            : "Recordatorios consultados correctamente.";
        mensajeEstado.dataset.type = "success";
        }

        if (resumenPaginacion && recordatorio.length > 0) {
        resumenPaginacion.textContent = `Mostrando ${recordatorio.length} de ${paginacion.total} recordatorio. Página ${paginacion.page} de ${paginacion.pages}.`;
        }
    } catch (error) {
        // 9. Manejar problemas de conexión, respuestas inválidas
    // o errores reportados por el API.
        console.error("No se pudieron listar los recordatorios:", error.message);
        if (mensajeEstado) {
        mensajeEstado.textContent = `No se pudieron listar los recordatorios: ${error.message}`;
        mensajeEstado.dataset.type = "error";
        }
    } finally {
        // Volver a habilitar el botón tanto si la consulta funcionó como si falló.
        if (botonRecargar) botonRecargar.disabled = false;
    }
}

// Ejecutar automáticamente al cargar la página
listarRecordatorio();

// Permitir recargar al hacer clic en el botón
//document.querySelector("#recargar-recordatorio")?.addEventListener("click", listarRecordatorio);