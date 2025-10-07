# 📊 Documentación del Schema de Base de Datos - SAHA

## 🎯 Visión General

Base de datos diseñada para una plataforma de contratación de servicios profesionales (oficios) que conecta clientes con proveedores de servicios.

---

## 📋 Enumeraciones (Enums)

### UserRole

Define el rol del usuario en la plataforma:

- `CLIENT` - Usuario que contrata servicios
- `PROVIDER` - Usuario que ofrece servicios
- `ADMIN` - Administrador de la plataforma

### ServiceCategory

Categorías de servicios disponibles:

- `PLOMERIA` - Plomería
- `ELECTRICIDAD` - Electricidad
- `CARPINTERIA` - Carpintería
- `PINTURA` - Pintura
- `LIMPIEZA` - Limpieza
- `JARDINERIA` - Jardinería
- `MECANICA` - Mecánica
- `CONSTRUCCION` - Construcción
- `REPARACIONES` - Reparaciones generales
- `MUDANZAS` - Mudanzas
- `TECNOLOGIA` - Tecnología/IT
- `OTRO` - Otros servicios

### BookingStatus

Estados del ciclo de vida de una solicitud:

1. `PENDING` - Solicitud enviada, esperando respuesta del proveedor
2. `ACCEPTED` - Proveedor aceptó la solicitud
3. `REJECTED` - Proveedor rechazó la solicitud
4. `CONFIRMED` - Cliente confirmó después de aceptación
5. `IN_PROGRESS` - Servicio en progreso
6. `COMPLETED` - Servicio completado
7. `CANCELLED` - Cancelado por cliente o proveedor

### NotificationType

Tipos de notificaciones del sistema:

- `BOOKING_REQUEST` - Nueva solicitud recibida
- `BOOKING_ACCEPTED` - Solicitud aceptada
- `BOOKING_REJECTED` - Solicitud rechazada
- `BOOKING_CANCELLED` - Solicitud cancelada
- `BOOKING_COMPLETED` - Servicio completado
- `NEW_REVIEW` - Nueva reseña recibida
- `NEW_MESSAGE` - Nuevo mensaje
- `SYSTEM` - Notificación del sistema

---

## 📊 Modelos (Tablas)

### 👤 User

**Propósito**: Almacena información de todos los usuarios (clientes y proveedores)

| Campo           | Tipo            | Descripción                       |
| --------------- | --------------- | --------------------------------- |
| id              | String (PK)     | Identificador único (CUID)        |
| email           | String (Unique) | Email del usuario                 |
| password        | String          | Contraseña hasheada               |
| name            | String          | Nombre completo                   |
| phone           | String?         | Teléfono (opcional)               |
| avatar          | String?         | URL de foto de perfil             |
| role            | UserRole        | Rol (CLIENT/PROVIDER/ADMIN)       |
| isEmailVerified | Boolean         | Email verificado (default: false) |
| isActive        | Boolean         | Cuenta activa (default: true)     |
| lastLogin       | DateTime?       | Último inicio de sesión           |
| createdAt       | DateTime        | Fecha de creación                 |
| updatedAt       | DateTime        | Última actualización              |

**Relaciones**:

- `providerProfile` → ProviderProfile (1:1, opcional)
- `bookingsAsClient` → Booking[] (1:N)
- `reviewsGiven` → Review[] (1:N)
- `favoriteProviders` → Favorite[] (1:N)
- `notifications` → Notification[] (1:N)
- `messagesSent` → Message[] (1:N)
- `messagesReceived` → Message[] (1:N)

---

### 🛠️ ProviderProfile

**Propósito**: Perfil extendido para usuarios que ofrecen servicios

| Campo              | Tipo               | Descripción                                |
| ------------------ | ------------------ | ------------------------------------------ |
| id                 | String (PK)        | Identificador único                        |
| userId             | String (Unique FK) | Referencia a User                          |
| bio                | String?            | Biografía/descripción personal             |
| serviceCategory    | ServiceCategory    | Categoría principal de servicio            |
| serviceDescription | String?            | Descripción detallada del servicio         |
| experience         | Int?               | Años de experiencia                        |
| pricePerHour       | Float?             | Precio por hora                            |
| location           | String?            | Ubicación                                  |
| serviceRadius      | Int?               | Radio de servicio en km                    |
| isAvailable        | Boolean            | Disponible para trabajar (default: true)   |
| isVerified         | Boolean            | Verificado por plataforma (default: false) |
| rating             | Float              | Calificación promedio (default: 0)         |
| totalReviews       | Int                | Total de reseñas (default: 0)              |
| totalBookings      | Int                | Total de reservas (default: 0)             |
| completedBookings  | Int                | Reservas completadas (default: 0)          |
| certifications     | String?            | URLs de certificados (JSON)                |
| portfolioImages    | String?            | URLs de portfolio (JSON)                   |
| createdAt          | DateTime           | Fecha de creación                          |
| updatedAt          | DateTime           | Última actualización                       |

**Relaciones**:

- `user` → User (N:1)
- `bookings` → Booking[] (1:N)
- `reviews` → Review[] (1:N)
- `favoritedBy` → Favorite[] (1:N)

---

### 📅 Booking

**Propósito**: Solicitudes/contrataciones de servicios

| Campo              | Tipo          | Descripción                      |
| ------------------ | ------------- | -------------------------------- |
| id                 | String (PK)   | Identificador único              |
| clientId           | String (FK)   | Referencia al cliente            |
| providerId         | String (FK)   | Referencia al proveedor          |
| serviceDate        | DateTime      | Fecha del servicio               |
| serviceTime        | String?       | Hora preferida (ej: "10:00 AM")  |
| description        | String        | Descripción del trabajo          |
| address            | String?       | Dirección del servicio           |
| status             | BookingStatus | Estado actual (default: PENDING) |
| totalPrice         | Float?        | Precio total acordado            |
| estimatedHours     | Float?        | Horas estimadas                  |
| providerNotes      | String?       | Notas del proveedor              |
| clientNotes        | String?       | Notas del cliente                |
| acceptedAt         | DateTime?     | Fecha de aceptación              |
| rejectedAt         | DateTime?     | Fecha de rechazo                 |
| completedAt        | DateTime?     | Fecha de completado              |
| cancelledAt        | DateTime?     | Fecha de cancelación             |
| cancellationReason | String?       | Razón de cancelación             |
| createdAt          | DateTime      | Fecha de creación                |
| updatedAt          | DateTime      | Última actualización             |

**Relaciones**:

- `client` → User (N:1)
- `provider` → ProviderProfile (N:1)
- `review` → Review (1:1, opcional)

---

### ⭐ Review

**Propósito**: Calificaciones y reseñas de servicios completados

| Campo            | Tipo               | Descripción                |
| ---------------- | ------------------ | -------------------------- |
| id               | String (PK)        | Identificador único        |
| bookingId        | String (Unique FK) | Referencia a Booking       |
| clientId         | String (FK)        | Cliente que hace la reseña |
| providerId       | String (FK)        | Proveedor calificado       |
| rating           | Int                | Calificación 1-5 estrellas |
| comment          | String?            | Comentario (opcional)      |
| providerResponse | String?            | Respuesta del proveedor    |
| respondedAt      | DateTime?          | Fecha de respuesta         |
| createdAt        | DateTime           | Fecha de creación          |
| updatedAt        | DateTime           | Última actualización       |

**Relaciones**:

- `booking` → Booking (N:1)
- `client` → User (N:1)
- `provider` → ProviderProfile (N:1)

**Índices**:

- `providerId` (para búsquedas rápidas)
- `clientId` (para búsquedas rápidas)

---

### ❤️ Favorite

**Propósito**: Proveedores favoritos de los usuarios

| Campo      | Tipo        | Descripción                |
| ---------- | ----------- | -------------------------- |
| id         | String (PK) | Identificador único        |
| userId     | String (FK) | Usuario que marca favorito |
| providerId | String (FK) | Proveedor marcado          |
| createdAt  | DateTime    | Fecha de creación          |

**Relaciones**:

- `user` → User (N:1)
- `provider` → ProviderProfile (N:1)

**Constraints**:

- Unique: `[userId, providerId]` (no duplicados)

**Índices**:

- `userId`
- `providerId`

---

### 🔔 Notification

**Propósito**: Notificaciones para los usuarios

| Campo     | Tipo             | Descripción               |
| --------- | ---------------- | ------------------------- |
| id        | String (PK)      | Identificador único       |
| userId    | String (FK)      | Usuario destinatario      |
| type      | NotificationType | Tipo de notificación      |
| title     | String           | Título de la notificación |
| message   | String           | Mensaje/contenido         |
| isRead    | Boolean          | Leída (default: false)    |
| metadata  | String?          | Datos adicionales (JSON)  |
| createdAt | DateTime         | Fecha de creación         |

**Relaciones**:

- `user` → User (N:1)

**Índices**:

- `[userId, isRead]` (para queries eficientes)

---

### 💬 Message

**Propósito**: Mensajes entre usuarios

| Campo      | Tipo        | Descripción            |
| ---------- | ----------- | ---------------------- |
| id         | String (PK) | Identificador único    |
| senderId   | String (FK) | Usuario emisor         |
| receiverId | String (FK) | Usuario receptor       |
| content    | String      | Contenido del mensaje  |
| isRead     | Boolean     | Leído (default: false) |
| createdAt  | DateTime    | Fecha de creación      |

**Relaciones**:

- `sender` → User (N:1)
- `receiver` → User (N:1)

**Índices**:

- `[senderId, receiverId]`
- `[receiverId, isRead]`

---

## 🔄 Flujos de Datos Principales

### 1️⃣ Flujo de Contratación

```
Cliente busca proveedor
    ↓
Crea Booking (status: PENDING)
    ↓
Proveedor recibe notificación (BOOKING_REQUEST)
    ↓
Proveedor acepta/rechaza (status: ACCEPTED/REJECTED)
    ↓
Cliente recibe notificación (BOOKING_ACCEPTED/REJECTED)
    ↓
[Si aceptado] Cliente confirma (status: CONFIRMED)
    ↓
Servicio se realiza (status: IN_PROGRESS)
    ↓
Servicio completado (status: COMPLETED)
    ↓
Cliente deja Review
```

### 2️⃣ Flujo de Calificación

```
Booking completado
    ↓
Cliente crea Review (rating + comment)
    ↓
Se actualiza rating promedio del ProviderProfile
    ↓
Proveedor recibe notificación (NEW_REVIEW)
    ↓
[Opcional] Proveedor responde
```

---

## 📈 Métricas Calculadas

### Para ProviderProfile:

- **rating**: Promedio de todas las calificaciones recibidas
- **totalReviews**: Contador de reviews
- **totalBookings**: Total de bookings recibidos
- **completedBookings**: Bookings con status COMPLETED

### Cálculos:

- **Tasa de aceptación**: `ACCEPTED / total PENDING`
- **Tasa de completado**: `COMPLETED / (ACCEPTED + CONFIRMED + IN_PROGRESS)`
- **Ingresos estimados**: `SUM(totalPrice WHERE status = COMPLETED)`

---

## 🔐 Consideraciones de Seguridad

1. **Passwords**: Siempre hasheadas con bcrypt (10 rounds)
2. **Cascade Deletes**:
   - User → ProviderProfile (CASCADE)
   - User → Favorites (CASCADE)
   - User → Notifications (CASCADE)
   - Booking → Review (CASCADE)
3. **Soft Deletes**: User.isActive (en lugar de borrar)
4. **Verificación**: User.isEmailVerified, ProviderProfile.isVerified

---

## 🚀 Optimizaciones

### Índices Críticos:

- Review: `providerId`, `clientId`
- Favorite: `userId`, `providerId`
- Notification: `[userId, isRead]`
- Message: `[senderId, receiverId]`, `[receiverId, isRead]`

### Consultas Frecuentes:

1. Buscar proveedores por categoría/ubicación
2. Obtener bookings pendientes de un proveedor
3. Obtener notificaciones no leídas
4. Calcular rating promedio de un proveedor

---

## 📝 Notas de Implementación

### Campos JSON:

- `ProviderProfile.certifications`: Array de URLs
- `ProviderProfile.portfolioImages`: Array de URLs
- `Notification.metadata`: Objeto con datos contextuales

### Ejemplo metadata:

```json
{
  "bookingId": "cm123...",
  "providerName": "Juan Pérez",
  "serviceCategory": "PLOMERIA"
}
```

---

## 🔄 Próximas Expansiones (Opcionales)

1. **Tabla de Disponibilidad**: Horarios específicos del proveedor
2. **Sistema de Pagos**: Integración con pasarelas de pago
3. **Geolocalización**: Campos lat/long para búsquedas cercanas
4. **Chat en Tiempo Real**: WebSockets + persistencia
5. **Multimedia**: Tabla separada para imágenes/videos
6. **Reportes**: Tabla para reportes de usuarios/proveedores

---

📅 **Última actualización**: Octubre 7, 2025  
📧 **Contacto**: Para preguntas sobre el schema, contactar al equipo de desarrollo
