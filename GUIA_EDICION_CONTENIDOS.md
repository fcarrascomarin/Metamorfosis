# Guía rápida para editar la web pública

La web pública y el panel interno permanecen separados:

- **Web pública:** `src/PublicApp.jsx` + `src/publicContent.js` + estilos públicos en `src/styles.css`.
- **Panel privado:** `src/AdminApp.jsx` y sus módulos. Los cambios visuales de esta actualización están limitados a `.public-site`, por lo que no alteran Metamorfosis OS.

## 1. Textos que se editan sin tocar la estructura

El archivo principal para contenidos repetibles es:

```text
src/publicContent.js
```

Ahí puedes cambiar:

- `publicNavigation`: nombres y destinos del menú.
- `gardenPrinciples`: tarjetas de la sección **El jardín**.
- `publicCapabilities`: capacidades, descripciones y principios.
- `publicCases`: casos, etiquetas, textos, palabras clave y llamada a la acción.

Cada elemento conserva una estructura clara. Ejemplo:

```js
{
  icon: 'campaign',
  title: 'Mercado, marca y comercialización',
  text: 'Descripción principal.',
  principle: 'Frase breve de criterio.'
}
```

## 2. Textos principales de cada sección

Los títulos y párrafos introductorios están en:

```text
src/PublicApp.jsx
```

Busca los componentes `SectionHeading` dentro de estas secciones:

- `id="jardin"`
- `id="capacidades"`
- `id="mapa"`
- `id="proyectos"`
- `id="contacto"`

También en `PublicApp.jsx` se edita el texto principal del hero, dentro de:

```jsx
<section id="inicio" ...>
```

## 3. Datos de contacto

Se editan en:

```text
src/data.js
```

Objeto:

```js
export const contact = { ... }
```

Modifica ahí teléfono, correo, ubicación y cobertura. El formulario, footer y botón de WhatsApp usan esos datos automáticamente.

## 4. Imágenes de fondo

Están en:

```text
src/assets/images/jardin/
```

Los archivos actuales son:

- `hero-jardin.webp`
- `jardin-terrazas.webp`
- `trabajo-metodo.webp`
- `mapa-transformacion.webp`
- `proyectos-vivos.webp`
- `contacto-jardin.webp`

Para reemplazar una imagen sin editar código, conserva el mismo nombre y formato.

## 5. Logos de casos

La composición visual de los casos está en el componente:

```jsx
CaseBrand
```

ubicado en `src/PublicApp.jsx`.

- **Metamorfosis OS** usa `public/logo-metamorfosis-transparente.png`.
- **Juana de Arco** usa `public/assets/brand/logo-juana-de-arco.png`.
- **CM** usa `public/assets/brand/logo-cm-banqueteria.png`.

Para reemplazar cualquiera de ellos, conserva el nombre del archivo o actualiza la ruta dentro de `CaseBrand`. Mantén `alt` o `aria-label` para accesibilidad.

## 6. Estilos y tamaños

Los ajustes nuevos están al final de:

```text
src/styles.css
```

Busca el comentario:

```css
Armonía visual pública · navegación, método, casos y footer · 2026-08
```

Las reglas están precedidas por `.public-site`. Esto evita que una modificación de la vitrina pública cambie accidentalmente el panel privado.

## 7. Navegación y anclas

La función:

```js
scrollToPublicSection()
```

calcula dinámicamente la altura real del encabezado fijo. Así cada sección queda alineada justo debajo del menú y no a mitad de pantalla.

No es necesario añadir valores manuales por sección.

## 8. Compilación y despliegue

Web pública en Cloudflare Pages:

```bash
npm run build:public
```

Directorio de salida:

```text
dist-public
```

Panel privado en Render:

```bash
npm run build:admin
```

Después:

```bash
npm start
```
