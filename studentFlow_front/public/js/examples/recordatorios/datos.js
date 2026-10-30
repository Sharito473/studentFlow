// Son payloads de ejemplo, no respuestas simuladas: las consultas usan el API real.
export const recordatorioEjemplo = {
    mensaje: "Revisar la documentación del backend antes de la asesoría.",
    fecha_hora: "2026-06-01T10:00:00",
    canal: "in_app",
    leido: false
};

export const reemplazoRecordatorioEjemplo = {
    mensaje: "Revisar la documentación y validar los endpoints con Postman.",
    fecha_hora: "2026-06-01T11:30:00",
    canal: "in_app",
    leido: true
};

export const cambiosRecordatorioEjemplo = { leido: true };

export const filtrosRecordatorioEjemplo = {
    search: "",
    leido: false,
    page: 1,
    limit: 20,
    sort: "fecha_hora",
    order: "asc"
};