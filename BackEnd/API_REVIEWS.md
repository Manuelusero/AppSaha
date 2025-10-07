# 📚 API de Reviews - Documentación

## 🎯 Descripción General

Sistema completo de calificaciones y reseñas que permite a los clientes evaluar servicios completados y a los proveedores responder a dichas evaluaciones.

---

## 🔐 Autenticación

Todas las rutas marcadas con 🔒 requieren autenticación JWT mediante el header:

```
Authorization: Bearer <token>
```

---

## 📍 Endpoints

### 1. Crear Reseña 🔒

**POST** `/api/reviews`

Permite a un cliente crear una reseña para un servicio completado.

**Permisos**: Solo CLIENTES

**Body**:

```json
{
  "bookingId": "cm123...",
  "rating": 5,
  "comment": "Excelente servicio, muy profesional"
}
```

**Validaciones**:

- ✅ Usuario debe ser el cliente del booking
- ✅ Booking debe estar en estado `COMPLETED`
- ✅ Rating debe ser entre 1-5
- ✅ No puede haber reseña previa para ese booking

**Respuesta exitosa** (201):

```json
{
  "message": "Reseña creada exitosamente",
  "review": {
    "id": "cm789...",
    "bookingId": "cm123...",
    "clientId": "user456...",
    "providerId": "prov789...",
    "rating": 5,
    "comment": "Excelente servicio...",
    "createdAt": "2025-10-07T...",
    "client": {
      "id": "user456...",
      "name": "Juan Pérez",
      "avatar": null
    }
  },
  "newProviderRating": 4.8
}
```

**Efectos secundarios**:

1. 📊 Actualiza `rating` y `totalReviews` del proveedor
2. 🔔 Crea notificación para el proveedor

---

### 2. Obtener Reseñas de un Proveedor

**GET** `/api/reviews/provider/:providerId`

Lista todas las reseñas de un proveedor con paginación y estadísticas.

**Query Parameters**:

- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)

**Ejemplo**: `/api/reviews/provider/prov789?page=1&limit=5`

**Respuesta** (200):

```json
{
  "reviews": [
    {
      "id": "rev123...",
      "rating": 5,
      "comment": "Excelente trabajo",
      "providerResponse": null,
      "respondedAt": null,
      "createdAt": "2025-10-07T...",
      "client": {
        "id": "user456...",
        "name": "Juan Pérez",
        "avatar": null
      },
      "booking": {
        "serviceDate": "2025-10-10T...",
        "description": "Reparación de tubería"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 23,
    "totalPages": 5
  },
  "stats": {
    "averageRating": 4.7,
    "totalReviews": 23,
    "ratingDistribution": [
      { "rating": 5, "_count": { "rating": 15 } },
      { "rating": 4, "_count": { "rating": 6 } },
      { "rating": 3, "_count": { "rating": 2 } }
    ]
  }
}
```

---

### 3. Obtener Reseña de un Booking

**GET** `/api/reviews/booking/:bookingId`

Obtiene la reseña específica de un booking.

**Respuesta** (200):

```json
{
  "id": "rev123...",
  "bookingId": "book456...",
  "clientId": "user789...",
  "providerId": "prov012...",
  "rating": 5,
  "comment": "Muy buen servicio",
  "providerResponse": "Gracias por tu confianza",
  "respondedAt": "2025-10-08T...",
  "createdAt": "2025-10-07T...",
  "client": {
    "id": "user789...",
    "name": "María González",
    "avatar": "https://..."
  },
  "provider": {
    "id": "prov012...",
    "user": {
      "name": "Carlos Electricista"
    }
  }
}
```

**Error** (404):

```json
{
  "error": "Reseña no encontrada"
}
```

---

### 4. Responder a una Reseña 🔒

**PATCH** `/api/reviews/:id/response`

Permite al proveedor responder a una reseña recibida.

**Permisos**: Solo PROVEEDORES (y solo sus propias reseñas)

**Body**:

```json
{
  "providerResponse": "Muchas gracias por tu confianza. Fue un placer trabajar contigo."
}
```

**Respuesta** (200):

```json
{
  "message": "Respuesta agregada exitosamente",
  "review": {
    "id": "rev123...",
    "rating": 5,
    "comment": "Excelente servicio",
    "providerResponse": "Muchas gracias por tu confianza...",
    "respondedAt": "2025-10-07T17:30:00Z",
    "client": {
      "id": "user456...",
      "name": "Juan Pérez",
      "avatar": null
    }
  }
}
```

**Efectos secundarios**:

- 🔔 Crea notificación para el cliente

---

### 5. Obtener Reseñas de un Cliente

**GET** `/api/reviews/client/:clientId`

Lista todas las reseñas realizadas por un cliente.

**Respuesta** (200):

```json
[
  {
    "id": "rev123...",
    "rating": 5,
    "comment": "Muy buen servicio",
    "providerResponse": null,
    "createdAt": "2025-10-07T...",
    "provider": {
      "id": "prov789...",
      "user": {
        "name": "Carlos Plomero",
        "avatar": null
      }
    },
    "booking": {
      "serviceDate": "2025-10-05T...",
      "description": "Reparación urgente"
    }
  }
]
```

---

## ⚠️ Códigos de Error

| Código | Descripción                                   |
| ------ | --------------------------------------------- |
| 400    | Datos inválidos o falta información requerida |
| 401    | Token no proporcionado o inválido             |
| 403    | No tienes permiso para esta acción            |
| 404    | Recurso no encontrado                         |
| 500    | Error interno del servidor                    |

---

## 🔄 Flujo Completo de Uso

### Escenario: Cliente califica un servicio

1. **Cliente completa un servicio** (Booking status = `COMPLETED`)

2. **Cliente crea reseña**:

```bash
POST /api/reviews
Authorization: Bearer <client_token>
{
  "bookingId": "book123",
  "rating": 5,
  "comment": "Excelente trabajo"
}
```

3. **Sistema automáticamente**:

   - ✅ Calcula nuevo promedio del proveedor
   - 🔔 Envía notificación al proveedor

4. **Proveedor ve sus reseñas**:

```bash
GET /api/reviews/provider/prov456
```

5. **Proveedor responde** (opcional):

```bash
PATCH /api/reviews/rev789/response
Authorization: Bearer <provider_token>
{
  "providerResponse": "Gracias por tu confianza"
}
```

6. **Cliente recibe notificación** de la respuesta

---

## 📊 Actualización Automática de Ratings

Cuando se crea una reseña, el sistema actualiza automáticamente:

```javascript
// ProviderProfile se actualiza con:
{
  rating: (suma de todos los ratings) / (total de reviews),
  totalReviews: número total de reseñas
}
```

**Ejemplo**:

- Reviews previos: [5, 4, 5, 3] → Rating actual: 4.25
- Nueva review: 5
- Reviews totales: [5, 4, 5, 3, 5]
- **Nuevo rating: 4.4** ✨

---

## 🎨 Casos de Uso Frontend

### Mostrar reseñas en perfil de proveedor:

```javascript
const response = await fetch(
  `http://localhost:8000/api/reviews/provider/${providerId}?page=1&limit=10`
);
const { reviews, stats } = await response.json();

// Mostrar:
// - Rating promedio: stats.averageRating
// - Total: stats.totalReviews
// - Distribución de estrellas: stats.ratingDistribution
// - Lista de reseñas con paginación
```

### Formulario de calificar servicio:

```javascript
const createReview = async (bookingId, rating, comment) => {
  const response = await fetch("http://localhost:8000/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookingId, rating, comment }),
  });
  return response.json();
};
```

### Proveedor responde:

```javascript
const respondToReview = async (reviewId, response) => {
  await fetch(`http://localhost:8000/api/reviews/${reviewId}/response`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${providerToken}`,
    },
    body: JSON.stringify({ providerResponse: response }),
  });
};
```

---

## 🔒 Restricciones de Seguridad

1. ✅ Solo clientes pueden crear reseñas
2. ✅ Solo el cliente del booking puede calificarlo
3. ✅ Solo se pueden calificar servicios completados
4. ✅ Una reseña por booking (no duplicados)
5. ✅ Solo el proveedor puede responder sus propias reseñas
6. ✅ Ratings válidos: 1-5 estrellas

---

## 💡 Mejores Prácticas

### Para Clientes:

- 📝 Sé específico en tus comentarios
- ⭐ Califica justamente (1-5)
- 🕐 Califica poco después de completar el servicio

### Para Proveedores:

- 💬 Responde todas las reseñas (especialmente las negativas)
- 🙏 Agradece las reseñas positivas
- 🛠️ Usa feedback constructivo para mejorar

---

## 📈 Próximas Mejoras (Opcional)

1. **Reportar reseñas inapropiadas**
2. **Editar reseñas** (dentro de X días)
3. **Marcar reseñas como útiles**
4. **Filtrar reseñas** por rating
5. **Verificar reseñas** (badge de "compra verificada")

---

📅 **Última actualización**: Octubre 7, 2025  
🚀 **Versión API**: 1.0.0
