# Metamorfosis Web v5.8

## Dirección conceptual
La web deja de presentar Metamorfosis como “laboratorio” y adopta la identidad **Jardín de innovación · Concepción**: un espacio donde se siembran preguntas, se observa en contexto, se prueba con cuidado y se hace crecer aquello que demuestra valor.

## Cómo trabaja Metamorfosis
Se eliminó el panel explicativo único de la v5.7.

La sección ahora tiene dos capas separadas:

1. **Qué observamos**
   - Operación
   - Personas
   - Entorno
   - Condiciones de operación
   - Cada concepto abre su propia explicación debajo de su título.
   - Solo un concepto permanece abierto dentro del grupo.

2. **Cómo trabajamos**
   - Entender
   - Delimitar
   - Probar
   - Medir
   - Transferir
   - Cada etapa despliega su explicación dentro de su propia tarjeta.
   - Solo una etapa permanece abierta dentro del grupo.

Esto evita mezclar dimensiones de análisis con etapas del método.

## Preguntas que cultivamos
La antigua sección “Preguntas que estamos explorando” deja de ocupar una pantalla completa. Ahora funciona como un bloque compacto de investigación aplicada con cuatro preguntas desplegables. El objetivo es demostrar capacidad intelectual sin saturar la navegación.

## Código editable
En `src/styles.css` buscar:

`WEB PÚBLICA V5.8 · JARDÍN DE INNOVACIÓN · CONCEPTOS DESPLEGABLES`

El bloque está dividido y comentado en:
- Escena general
- Encabezado
- Cabecera de capas
- Jardín central
- Dimensiones
- Método
- Cierre
- Preguntas que cultivamos
- Jardín institucional
- Desktop bajo
- Tablet
- Móvil

En `src/PublicApp.jsx` buscar:

`04C · CÓMO TRABAJA METAMORFOSIS · DOS CAPAS, DOS LÓGICAS`

## SEO
`index.html` fue actualizado para describir a Metamorfosis como **jardín de innovación** en lugar de laboratorio de innovación.

## Validación técnica
No fue posible ejecutar el build local porque la copia del proyecto no contiene `node_modules`. Antes de desplegar:

```bash
npm install
npm run build:public
```
