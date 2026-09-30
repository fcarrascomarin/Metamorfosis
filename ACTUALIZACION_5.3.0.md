# Metamorfosis 5.3.0 · OS 10.4

- Revisión responsive integral del sitio público y Metamorfosis OS: botones, tarjetas, imágenes y fondos conservan jerarquía y no se cortan en móvil.
- Jerarquía tipográfica ajustada para que títulos, subtítulos y texto de apoyo se lean en orden natural.
- Espacio Familiar reforzado en café/amarillo con mayor contraste en textos, campos y botones.
- Eliminado el selector “Verbo actual” y simplificada la barra superior familiar para privilegiar información cotidiana.
- Agregadas listas editables y eliminables de “Necesarios a corto plazo” y “Supermercado”.
- Lista de necesarios precargada con “Porcionadores en ml” y “Seguro plástico para cerrar puertas del refrigerador”; supermercado queda vacío.
- Campo comercial incorpora eliminación explícita de actores.
- Repositorio permite limpiar documentos desarrollados por error o que ya no se necesiten.
- Oportunidades/cotizaciones ahora se pueden editar y eliminar desde el OS, incluyendo persistencia en PostgreSQL para registros remotos.
- Se mantiene la regla transversal de que toda información creada por el equipo debe poder corregirse o retirarse cuando corresponda.

- Campo comercial completo editable en detalle (actor, organización, tipo, prioridad, acceso, función, lectura comercial, contexto y límites), además de eliminable.
- “Hogar y pendientes” pasa a “Hogar y compras” para reflejar el uso cotidiano real de la sección.
- En móvil, las imágenes conceptuales del equipo reducen su altura de forma proporcional y usan `contain`: se preserva la imagen completa sin sacrificar demasiado espacio vertical.
