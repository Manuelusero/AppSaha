# Schema de Base de Datos - SaHa Platform

## Modelos Principales

### 1. User

Usuario base del sistema (clientes y proveedores).

**Campos principales:**

- `email`, `password`: Autenticación
- `name`, `phone`, `avatar`: Información básica
- `role`: CLIENT | PROVIDER | ADMIN
- `isEmailVerified`, `isActive`: Estados de cuenta

**Relaciones:**

- `providerProfile`: Perfil de proveedor (si role = PROVIDER)
- `bookingsAsClient`: Reservas como cliente
- `reviewsGiven`: Reseñas escritas
- `favoriteProviders`: Proveedores favoritos
- `notifications`: Notificaciones
- `messagesSent/messagesReceived`: Mensajes

---

### 2. ProviderProfile

Perfil extendido para proveedores de servicios.

#### Datos Básicos

- `serviceCategory`: PLOMERIA | ELECTRICIDAD | CARPINTERIA | PINTURA | etc.
- `serviceDescription`: Descripción del servicio
- `experience`: Años de experiencia
- `pricePerHour`: Precio por hora
- `location`: Ubicación del proveedor
- `serviceRadius`: Radio de cobertura (km)
- `isAvailable`: Disponible para nuevas reservas
- `isVerified`: Verificado por la plataforma
- `rating`: Calificación promedio
- `totalReviews`: Cantidad de reseñas
- `totalBookings`: Total de reservas
- `completedBookings`: Reservas completadas

#### Redes Sociales (Nuevo)

- `instagram`: @usuario de Instagram
- `facebook`: URL de Facebook
- `linkedin`: URL de LinkedIn
- `website`: Sitio web personal

#### Multimedia (Nuevo)

- `profilePhoto`: URL de foto de perfil
- `workPhotos`: JSON array con URLs de fotos de trabajos realizados
  ```json
  ["https://storage.com/photo1.jpg", "https://storage.com/photo2.jpg"]
  ```
- `videoUrls`: JSON array con URLs de videos (YouTube, Vimeo)
  ```json
  ["https://youtube.com/watch?v=xxx", "https://vimeo.com/xxx"]
  ```

#### Documentación Oficial (Nuevo)

- `dniNumber`: Número de DNI
- `dniDocument`: URL del archivo escaneado del DNI (frente y dorso)
- `criminalRecord`: URL del certificado de antecedentes penales

#### Certificados Profesionales

- `certifications`: JSON array con URLs de certificados
  ```json
  [
    {
      "name": "Matrícula de Electricista",
      "url": "https://storage.com/cert1.pdf",
      "issuer": "Ministerio de Trabajo",
      "date": "2020-05-15"
    }
  ]
  ```

**Relaciones:**

- `user`: Usuario asociado
- `bookings`: Reservas recibidas
- `reviews`: Reseñas recibidas
- `favoritedBy`: Usuarios que lo marcaron como favorito
- `references`: Referencias laborales

---

### 3. ProviderReference (Nuevo)

Referencias laborales de los proveedores.

**Campos:**

- `providerId`: ID del proveedor
- `name`: Nombre completo de la referencia
- `phone`: Teléfono de contacto
- `relationship`: Tipo de relación (cliente, colega, empleador, etc.)

**Ejemplo de uso:**

```typescript
{
  name: "Juan Pérez",
  phone: "+54 11 1234-5678",
  relationship: "Cliente - Trabajo de pintura en 2023"
}
```

---

### 4. Booking

Reservas/Contrataciones de servicios.

**Estados (BookingStatus):**

- `PENDING`: Solicitud enviada, esperando respuesta
- `ACCEPTED`: Proveedor aceptó
- `REJECTED`: Proveedor rechazó
- `CONFIRMED`: Cliente confirmó después de aceptación
- `IN_PROGRESS`: Servicio en progreso
- `COMPLETED`: Servicio completado
- `CANCELLED`: Cancelado

**Campos principales:**

- `serviceDate`, `serviceTime`: Cuándo se realizará el servicio
- `description`: Descripción del trabajo solicitado
- `address`: Dirección donde se realizará
- `status`: Estado actual
- `totalPrice`, `estimatedHours`: Precio y tiempo estimado
- `providerNotes`, `clientNotes`: Notas adicionales

---

### 5. Review

Reseñas de servicios completados.

**Campos:**

- `bookingId`: Reserva asociada (única, una reseña por booking)
- `rating`: 1-5 estrellas
- `comment`: Comentario del cliente
- `providerResponse`: Respuesta del proveedor (opcional)

---

### 6. Favorite

Proveedores favoritos de los clientes.

**Restricción:** Un usuario no puede agregar el mismo proveedor dos veces.

---

### 7. Notification

Notificaciones del sistema.

**Tipos (NotificationType):**

- `BOOKING_REQUEST`: Nueva solicitud recibida
- `BOOKING_ACCEPTED`: Solicitud aceptada
- `BOOKING_REJECTED`: Solicitud rechazada
- `BOOKING_CANCELLED`: Solicitud cancelada
- `BOOKING_COMPLETED`: Servicio completado
- `NEW_REVIEW`: Nueva reseña recibida
- `NEW_MESSAGE`: Nuevo mensaje
- `SYSTEM`: Notificación del sistema

---

### 8. Message

Mensajes entre usuarios (chat interno).

**Campos:**

- `senderId`, `receiverId`: Usuarios involucrados
- `content`: Contenido del mensaje
- `isRead`: Leído o no

---

## Flujo de Registro de Proveedor

1. **Crear User** con `role = PROVIDER`
2. **Crear ProviderProfile** asociado
3. **Subir documentación:**
   - DNI escaneado → `dniDocument`
   - Antecedentes penales → `criminalRecord`
   - Certificados → `certifications`
4. **Subir multimedia:**
   - Foto perfil → `profilePhoto`
   - Fotos trabajos → `workPhotos`
   - Videos → `videoUrls`
5. **Crear ProviderReference** (mínimo 2)
6. **Agregar redes sociales:**
   - Instagram, Facebook, LinkedIn, Website

---

## Queries Útiles

### Buscar proveedores por categoría y ubicación

```typescript
const providers = await prisma.providerProfile.findMany({
  where: {
    serviceCategory: "PINTURA",
    location: {
      contains: "Buenos Aires",
    },
    isAvailable: true,
    isVerified: true,
  },
  include: {
    user: {
      select: {
        name: true,
        email: true,
        avatar: true,
      },
    },
    reviews: {
      select: {
        rating: true,
        comment: true,
      },
    },
  },
  orderBy: {
    rating: "desc",
  },
});
```

### Crear proveedor completo

```typescript
const provider = await prisma.user.create({
  data: {
    email: "juan@example.com",
    password: hashedPassword,
    name: "Juan Pérez",
    phone: "+54 11 1234-5678",
    role: "PROVIDER",
    providerProfile: {
      create: {
        serviceCategory: "PINTURA",
        serviceDescription: "Pintor profesional con 10 años de experiencia",
        experience: 10,
        location: "Buenos Aires",
        instagram: "@juanpintor",
        dniNumber: "12345678",
        dniDocument: "https://storage.com/dni.pdf",
        criminalRecord: "https://storage.com/antecedentes.pdf",
        workPhotos: JSON.stringify([
          "https://storage.com/photo1.jpg",
          "https://storage.com/photo2.jpg",
        ]),
        references: {
          create: [
            {
              name: "María González",
              phone: "+54 11 9876-5432",
              relationship: "Cliente - Pintura de casa 2023",
            },
            {
              name: "Pedro López",
              phone: "+54 11 5555-1234",
              relationship: "Colega - Trabajos conjuntos",
            },
          ],
        },
      },
    },
  },
  include: {
    providerProfile: {
      include: {
        references: true,
      },
    },
  },
});
```

---

## Índices para Performance

Todos los modelos tienen índices automáticos en:

- Primary keys (`@id`)
- Foreign keys (`@relation`)
- Unique constraints (`@unique`)
- Custom indexes (`@@index`)

Los índices personalizados incluyen:

- `Review`: Por `providerId` y `clientId`
- `Favorite`: Por `userId` y `providerId`
- `Notification`: Por `userId` e `isRead`
- `Message`: Por `senderId`, `receiverId` e `isRead`
- `ProviderReference`: Por `providerId`

---

## Próximos Pasos

1. ✅ Schema actualizado con nuevos campos
2. ✅ Migración aplicada a la base de datos
3. ⏳ Crear API endpoints para:
   - Registro de proveedores
   - Upload de archivos (S3, Cloudinary, etc.)
   - Búsqueda y filtrado
4. ⏳ Implementar sistema de autenticación JWT
5. ⏳ Conectar formulario del frontend con API
