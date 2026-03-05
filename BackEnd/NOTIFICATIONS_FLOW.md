# 📧 Sistema de Notificaciones - Flujo Completo

## ✅ Implementación Actual

### 1. **Cliente Solicita Presupuesto** (sin registro)

- **Endpoint**: `POST /api/bookings/guest`
- **Datos requeridos**:
  - `clientName`: Nombre del cliente
  - `clientEmail` o `clientPhone`: Según método de contacto
  - `contactMethod`: "Mail", "Whatsapp" o "Mensaje de texto"
  - `description`: Descripción del problema
  - `location`: Ubicación
  - `urgency`: Nivel de urgencia
  - `problemPhoto`: Foto del problema (opcional)

- **Notificaciones automáticas**:
  1. ✉️ **Al cliente**: Confirmación de solicitud enviada
     - Email o WhatsApp según su elección
     - Mensaje: "Tu solicitud fue enviada, recibirás presupuesto en 48hs"
  2. ✉️ **Al profesional**: Nueva solicitud recibida
     - Email con detalles de la solicitud
     - Link para ver en su dashboard

### 2. **Profesional Envía Presupuesto**

- **Endpoint**: `POST /api/bookings/:id/send-budget`
- **Datos requeridos**:
  - `budgetPrice`: Precio del presupuesto
  - `budgetDetails`: Detalles del trabajo
  - `budgetMaterials`: Materiales necesarios (opcional)
  - `budgetTime`: Tiempo estimado (opcional)

- **Notificaciones automáticas**:
  ✉️ **Al cliente**: Presupuesto detallado
  - Email o WhatsApp con:
    - Precio
    - Detalles del trabajo
    - Materiales
    - Tiempo estimado
    - Link para ver más detalles

### 3. **Estados del Booking**

```typescript
enum BookingStatus {
  PENDING      // Solicitud enviada, esperando presupuesto
  ACCEPTED     // Profesional envió presupuesto
  REJECTED     // Profesional rechazó
  CONFIRMED    // Cliente confirmó presupuesto
  IN_PROGRESS  // Trabajo en curso
  COMPLETED    // Trabajo finalizado
  CANCELLED    // Cancelado
}
```

## 📁 Archivos Modificados

### Backend

1. **`/BackEnd/prisma/schema.prisma`**
   - ✅ `clientId` ahora opcional
   - ✅ `clientName` agregado
   - ✅ `clientEmail`, `clientPhone`, `clientContactMethod` ya existían

2. **`/BackEnd/src/routes/bookings.ts`**
   - ✅ Endpoint `/guest` actualizado con validaciones
   - ✅ Llamadas a funciones de notificación
   - ✅ Notificación en creación de booking
   - ✅ Notificación al enviar presupuesto

3. **`/BackEnd/src/utils/notifications.ts`** (NUEVO)
   - ✅ `sendClientConfirmationEmail()`
   - ✅ `sendClientConfirmationWhatsApp()`
   - ✅ `sendBudgetToClientEmail()`
   - ✅ `sendBudgetToClientWhatsApp()`
   - ✅ `sendProviderNewBookingNotification()`

### Frontend

4. **`/FrontEnd/src/app/contact-details/page.tsx`**
   - ✅ Formulario con método de contacto
   - ✅ Campos condicionales (email/teléfono)
   - ✅ Modal de confirmación personalizado
   - ✅ Envío con todos los datos al backend

## 🔧 Próximos Pasos (TODO)

### 1. **Implementar Servicio de Email**

```bash
npm install nodemailer
```

```typescript
// Ejemplo con Nodemailer
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransporter({
  service: "gmail", // o SMTP custom
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: '"Serco" <noreply@serco.com>',
    to,
    subject,
    html,
  });
}
```

### 2. **Implementar Servicio de WhatsApp/SMS**

Opciones:

- **Twilio** (WhatsApp + SMS)
- **WhatsApp Business API**
- **MessageBird**

```bash
npm install twilio
```

```typescript
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export async function sendWhatsApp(to: string, message: string) {
  await client.messages.create({
    from: "whatsapp:+14155238886", // Twilio sandbox number
    to: `whatsapp:${to}`,
    body: message,
  });
}
```

### 3. **Variables de Entorno**

Agregar a `.env`:

```env
# Email
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-password-de-aplicacion

# Twilio (WhatsApp/SMS)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. **Plantillas de Email HTML**

Crear carpeta `/BackEnd/src/templates/` con plantillas HTML profesionales:

- `client-confirmation.html`
- `provider-new-booking.html`
- `client-budget-received.html`

### 5. **Cola de Trabajos (Opcional pero recomendado)**

Para envíos asíncronos robustos:

```bash
npm install bull redis
```

## 📊 Flujo Visual

```
Cliente → Formulario → POST /api/bookings/guest
                              ↓
                        Crear Booking (BD)
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
         📧 Cliente          📧 Profesional
    "Presupuesto pedido"   "Nueva solicitud"
                              ↓
                    Profesional responde
                              ↓
              POST /api/bookings/:id/send-budget
                              ↓
                   Guardar presupuesto (BD)
                              ↓
                      📧 Cliente
              "Presupuesto recibido"
              (con precio y detalles)
```

## 🎯 Beneficios de esta Arquitectura

1. ✅ **Sin registro obligatorio**: Cliente puede solicitar sin crear cuenta
2. ✅ **Trazabilidad**: Todo queda registrado en BD con email/teléfono
3. ✅ **Notificaciones automáticas**: En cada paso del flujo
4. ✅ **Escalable**: Fácil agregar más canales (Telegram, SMS, etc.)
5. ✅ **Flexible**: Profesional elige cómo enviar presupuesto
6. ✅ **Profesional**: Emails con templates HTML personalizados

## 📝 Notas Importantes

- Las funciones en `notifications.ts` están listas, solo falta conectar el servicio real
- Los mensajes están comentados con el contenido sugerido
- El sistema maneja errores de notificación sin afectar el flujo principal
- Los logs con emojis (📧, 📱, ✅, ⚠️) facilitan el debugging
