# Conectar EXPLORA IA a Drive (≈10 min)
1. Crea una carpeta en Drive (ej. "EXPLORA IA – Entregas"). Copia su ID (lo que va después de `/folders/` en la URL).
2. Crea una Hoja de cálculo nueva → **Extensiones → Apps Script**. Borra lo que haya, pega `Code.gs` y cambia `CARPETA_ID` por el ID.
3. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier persona**. Autoriza los permisos y copia la URL que termina en `/exec`.
4. En `js/data.js` pega esa URL en `E.API="..."`.
5. Publica el sitio otra vez (donde ya lo tienes alojado).
6. Prueba: registra un participante, sube un archivo y revisa que aparezca en la Hoja (pestaña "Entregas") y en la carpeta.
7. La Galería es automática: cada entrega aparece apenas se envía. Si necesitas quitar una, escribe **SI** en la última columna (OCULTAR) de esa fila.
Si cambias `Code.gs` después: Implementar → Administrar implementaciones → editar → Nueva versión.
