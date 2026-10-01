# Metamorfosis LAB v5.21 — auditoría integral

Base exacta del ZIP v5.19 adjuntado, más los cambios editoriales de v5.20, con una nueva capa CSS v5.21 al final de `src/styles.css`.

- Hero validado; el origen regional aparece solo en su titular y Concepción únicamente en el footer.
- Navegación con cálculo dinámico del encabezado y margen de seguridad de 2 px.
- Secciones principales con altura mínima de pantalla útil en escritorio. Cuando una tarjeta se expande, el contenido **puede crecer**: no se recorta información.
- Mapa y cinco etapas visibles en dos columnas en escritorio; en pantallas pequeñas se apilan.
- Tarjetas plegables preservan `[hidden]` y evitan paneles aparentes vacíos.
- Espaciado, iconos y alineación de tarjetas afinados.
- Equipo resumido y aireado; sección de contacto sin altura rígida que recorte el formulario.
- Titulares breves en una línea en escritorio amplio; en tablet, móvil o zoom se permite el salto para no superponer ni ocultar contenido.
- Backend, administrador, imágenes, formularios y dependencias intactos.

Validar despliegue visual final en navegador/dispositivos reales tras publicar. No incluye `.env` ni `node_modules` (igual que el repositorio original).
