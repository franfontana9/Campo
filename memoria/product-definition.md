# Definición del producto — Campo

## Problema
En Argentina la comercialización de granos físicos (soja, maíz, trigo) se apoya en relaciones personales, llamados y corredores. No existe una herramienta digital simple donde productores, acopios, corredores y compradores puedan publicar y descubrir ofertas sin fricción.

## Propuesta de valor (MVP)
Un marketplace B2B donde en minutos podés:
1. publicar una oferta de grano,
2. explorar ofertas disponibles,
3. mostrar interés en una oferta,
4. iniciar contacto con la contraparte.

## Audiencia
- Vendedores: productores, acopios, cooperativas, corredores.
- Compradores: exportadores, molinos, fábricas de alimento balanceado, corredores.
- Perfil "ambos" (ej. corredor) también está soportado.

## Alcance del MVP

### Incluye
- Registro / login con Supabase Auth.
- Perfil con razón social, teléfono, ubicación, tipo de usuario.
- Publicaciones de oferta (grano, toneladas, ubicación, precio/modalidad, fecha de entrega, descripción, estado).
- Marketplace con filtros (grano, ubicación, rango de toneladas, modalidad).
- Detalle de publicación + botón "Me interesa" con mensaje.
- Dashboard con publicaciones propias + intereses enviados/recibidos.
- Panel admin mínimo para moderar.
- UI B2B sobria y responsive.

### No incluye (fuera de alcance por ahora)
- Pagos integrados.
- Logística y fletes.
- Contratos legales o firma digital.
- Integración con bolsa o precios en tiempo real.
- Reputación, scoring, IA.
- Notificaciones push/email avanzadas.
- Chat en tiempo real.
- Multi-rol corporativo (varias sucursales por empresa).

## Granos soportados
- Soja
- Maíz
- Trigo
- Girasol
- Sorgo
- Cebada
- Avena
- Arroz

## KPIs de validación
- Nº de registros.
- Nº de publicaciones activas.
- Ratio publicaciones / intereses.
- Conversaciones iniciadas (clicks en "Me interesa").
- Retención a 7/30 días.
