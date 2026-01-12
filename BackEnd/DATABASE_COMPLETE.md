# 🗄️ Documentación Completa de Base de Datos - SERCO

## 📊 Visión General

Base de datos diseñada para plataforma de contratación de servicios profesionales que conecta **clientes** con **proveedores de servicios verificados**.

**Stack:**

- **ORM**: Prisma
- **Desarrollo**: SQLite
- **Producción**: PostgreSQL (recomendado)

---

## 🎯 Enumeraciones (Enums)

### UserRole

```prisma
enum UserRole {
  CLIENT    // Usuario que contrata servicios
  PROVIDER  // Usuario que ofrece servicios
  ADMIN     // Administrador de la plataforma
}
```

### ServiceCategory

```prisma
enum ServiceCategory {
  PLOMERIA        // Plomería
  ELECTRICIDAD    // Electricidad
  CARPINTERIA     // Carpintería
  PINTURA         // Pintura
  LIMPIEZA        // Limpieza
  JARDINERIA      // Jardinería
  MECANICA        // Mecánica
  CONSTRUCCION    // Construcción
  REPARACIONES    // Reparaciones generales
  MUDANZAS        // Mudanzas
  TECNOLOGIA      // Tecnología/IT
  OTRO            // Otros servicios
}
```

### BookingStatus

```prisma
enum BookingStatus {
  PENDING       // 1. Solicitud enviada, esperando respuesta
  ACCEPTED      // 2. Proveedor aceptó
  REJECTED      // 3. Proveedor rechazó
  CONFIRMED     // 4. Cliente confirmó
  IN_PROGRESS   // 5. Servicio en progreso
  COMPLETED     // 6. Servicio completado
  CANCELLED     // 7. Cancelado
}
```

### NotificationType

```prisma
enum NotificationType {
  BOOKING_REQUEST   // Nueva solicitud recibida
  BOOKING_ACCEPTED  // Solicitud aceptada
  BOOKING_REJECTED  // Solicitud rechazada
  BOOKING_CANCELLED // Solicitud cancelada
  BOOKING_COMPLETED // Servicio completado
  NEW_REVIEW        // Nueva reseña recibida
  NEW_MESSAGE       // Nuevo mensaje
  SYSTEM            // Notificación del sistema
}
```

---

## 📋 Modelos (Tablas)

### 👤 User

Usuario base del sistema (clientes y proveedores).

```prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  password        String
  name            String
  phone           String?
  avatar          String?
  role            UserRole @default(CLIENT)
  isEmailVerified Boolean  @default(false)
  isActive        Boolean  @default(true)
  lastLogin       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relaciones
  providerProfile    ProviderProfile?
  bookingsAsClient   Booking[]       @relation("ClientBookings")
  reviewsGiven       Review[]        @relation("ClientReviews")
  favoriteProviders  Favorite[]
  notifications      Notification[]
  messagesSent       Message[]       @relation("SentMessages")
  messagesReceived   Message[]       @relation("ReceivedMessages")
}
```

**Campos principales:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | String (PK) | Identificador único (CUID) |
| `email` | String (Unique) | Email del usuario |
| `password` | String | Contraseña hasheada |
| `name` | String | Nombre completo |
| `phone` | String? | Teléfono (opcional) |
| `role` | UserRole | CLIENT/PROVIDER/ADMIN |
| `isEmailVerified` | Boolean | Email verificado (default: false) |
| `isActive` | Boolean | Cuenta activa (default: true) |

---

### 🛠️ ProviderProfile

Perfil extendido para proveedores de servicios.

```prisma
model ProviderProfile {
  id                  String          @id @default(cuid())
  userId              String          @unique
  user                User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Información del servicio
  bio                 String?
  serviceCategory     ServiceCategory
  serviceDescription  String?
  specialties         String?         // JSON array
  experience          Int?            // Años de experiencia
  pricePerHour        Decimal?
  location            String?
  serviceRadius       Int?            // Km de cobertura

  // Estado y métricas
  isAvailable         Boolean         @default(true)
  isVerified          Boolean         @default(false)
  rating              Float           @default(0)
  totalReviews        Int             @default(0)
  totalBookings       Int             @default(0)
  completedBookings   Int             @default(0)

  // Redes sociales
  instagram           String?
  facebook            String?
  linkedin            String?
  website             String?

  // Multimedia
  profilePhoto        String?
  workPhotos          String?         // JSON array de URLs
  videoUrls           String?         // JSON array de URLs

  // Documentación oficial
  dniNumber           String?
  dniDocument         String?         // URL del DNI escaneado
  criminalRecord      String?         // URL del certificado
  certifications      String?         // JSON array de certificados
  portfolioImages     String?         // JSON array de imágenes

  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt

  // Relaciones
  bookings            Booking[]
  reviews             Review[]        @relation("ProviderReviews")
  references          ProviderReference[]
  favoritedBy         Favorite[]
  workSchedule        WorkSchedule[]
  conversations       Conversation[]
}
```

**Campos destacados:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `serviceCategory` | Enum | Categoría principal de servicio |
| `specialties` | JSON | Array de especialidades específicas |
| `experience` | Int | Años de experiencia |
| `pricePerHour` | Decimal | Precio por hora de servicio |
| `serviceRadius` | Int | Km de cobertura desde ubicación |
| `rating` | Float | Calificación promedio (0-5) |
| `isVerified` | Boolean | Verificado por la plataforma |
| `profilePhoto` | String | URL de foto de perfil |
| `workPhotos` | JSON | Array de URLs de trabajos realizados |
| `certifications` | JSON | Array de certificados profesionales |

---

### 📅 Booking

Solicitudes de servicio.

```prisma
model Booking {
  id              String        @id @default(cuid())
  clientId        String
  client          User          @relation("ClientBookings", fields: [clientId], references: [id])
  providerId      String
  provider        ProviderProfile @relation(fields: [providerId], references: [id])

  // Detalles del servicio
  serviceDate     DateTime?
  serviceTime     String?
  description     String
  address         String?
  location        String?
  estimatedHours  Int?
  clientNotes     String?
  problemPhoto    String?       // Foto del problema

  // Estado y pagos
  status          BookingStatus @default(PENDING)
  totalPrice      Decimal?
  isPaid          Boolean       @default(false)

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relaciones
  review          Review?
  notifications   Notification[]
  conversation    Conversation?
}
```

---

### ⭐ Review

Reseñas y calificaciones.

```prisma
model Review {
  id                String   @id @default(cuid())
  bookingId         String   @unique
  booking           Booking  @relation(fields: [bookingId], references: [id])
  clientId          String
  client            User     @relation("ClientReviews", fields: [clientId], references: [id])
  providerId        String
  provider          ProviderProfile @relation("ProviderReviews", fields: [providerId], references: [id])

  rating            Int      // 1-5 estrellas
  comment           String?
  providerResponse  String?  // Respuesta del proveedor
  respondedAt       DateTime?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

---

### 📞 ProviderReference

Referencias personales del proveedor.

```prisma
model ProviderReference {
  id            String          @id @default(cuid())
  providerId    String
  provider      ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)

  name          String
  phone         String
  relationship  String          // "Cliente anterior", "Empleador", etc.

  createdAt     DateTime        @default(now())
}
```

---

### 💬 Conversation & Message

Sistema de mensajería interna.

```prisma
model Conversation {
  id          String          @id @default(cuid())
  providerId  String
  provider    ProviderProfile @relation(fields: [providerId], references: [id])
  bookingId   String?         @unique
  booking     Booking?        @relation(fields: [bookingId], references: [id])

  messages    Message[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

model Message {
  id              String       @id @default(cuid())
  conversationId  String
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderId        String
  sender          User         @relation("SentMessages", fields: [senderId], references: [id])
  receiverId      String
  receiver        User         @relation("ReceivedMessages", fields: [receiverId], references: [id])

  content         String
  isRead          Boolean      @default(false)

  createdAt       DateTime     @default(now())
}
```

---

### 🔔 Notification

Notificaciones del sistema.

```prisma
model Notification {
  id          String           @id @default(cuid())
  userId      String
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  type        NotificationType
  title       String
  message     String
  bookingId   String?
  booking     Booking?         @relation(fields: [bookingId], references: [id])

  isRead      Boolean          @default(false)
  createdAt   DateTime         @default(now())
}
```

---

### ⭐ Favorite

Proveedores favoritos del cliente.

```prisma
model Favorite {
  id          String          @id @default(cuid())
  userId      String
  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  providerId  String
  provider    ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)

  createdAt   DateTime        @default(now())

  @@unique([userId, providerId])
}
```

---

### 📅 WorkSchedule

Horarios de disponibilidad del proveedor.

```prisma
model WorkSchedule {
  id          String          @id @default(cuid())
  providerId  String
  provider    ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)

  dayOfWeek   Int             // 0=Domingo, 1=Lunes, ..., 6=Sábado
  startTime   String          // "09:00"
  endTime     String          // "18:00"
  isActive    Boolean         @default(true)

  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}
```

---

## 🔧 Comandos Útiles

### Ver base de datos (UI visual)

```bash
cd BackEnd
npx prisma studio
```

Abre en `http://localhost:5555`

### Crear nueva migración

```bash
npx prisma migrate dev --name descripcion_cambio
```

### Aplicar migraciones en producción

```bash
npx prisma migrate deploy
```

### Regenerar Prisma Client

```bash
npx prisma generate
```

### Resetear base de datos (¡CUIDADO!)

```bash
npx prisma migrate reset
```

### Seed data (opcional)

```bash
npm run seed
```

---

## 📊 Relaciones Principales

```
User (CLIENT)
  └─> Booking (muchas solicitudes)
        └─> Review (una reseña por booking)
        └─> Conversation (mensajes)

User (PROVIDER)
  └─> ProviderProfile (un perfil extendido)
        └─> Booking (muchas solicitudes recibidas)
        └─> Review (muchas reseñas recibidas)
        └─> ProviderReference (referencias)
        └─> WorkSchedule (horarios)
```

---

## 🚀 Ejemplos de Queries

### Buscar proveedores por categoría y ubicación

```typescript
const providers = await prisma.providerProfile.findMany({
  where: {
    serviceCategory: "PLOMERIA",
    location: { contains: "Buenos Aires" },
    isAvailable: true,
    isVerified: true,
  },
  include: {
    user: true,
    reviews: true,
  },
  orderBy: {
    rating: "desc",
  },
});
```

### Crear booking

```typescript
const booking = await prisma.booking.create({
  data: {
    clientId: userId,
    providerId: providerProfileId,
    description: "Reparación de cañería",
    serviceDate: new Date("2024-01-15"),
    address: "Av. Corrientes 1234",
    status: "PENDING",
  },
});
```

### Obtener estadísticas del proveedor

```typescript
const stats = await prisma.providerProfile.findUnique({
  where: { userId: providerId },
  select: {
    rating: true,
    totalReviews: true,
    totalBookings: true,
    completedBookings: true,
  },
});
```

---

## 🔒 Consideraciones de Seguridad

- ✅ Passwords hasheados con bcrypt
- ✅ JWT para autenticación
- ✅ Validación de datos con Prisma
- ✅ Soft delete con `isActive`
- ✅ Cascade delete configurado
- ⚠️ Implementar rate limiting en producción
- ⚠️ Sanitizar inputs del usuario
- ⚠️ Validar archivos subidos

---

## 📈 Optimizaciones

### Índices recomendados

```prisma
@@index([email])
@@index([serviceCategory, location])
@@index([status, createdAt])
@@index([rating])
```

### Paginación

```typescript
const providers = await prisma.providerProfile.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
});
```

---

**Para más detalles, ver `/BackEnd/prisma/schema.prisma`**
