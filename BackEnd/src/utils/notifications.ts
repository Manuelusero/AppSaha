/**
 * UTILIDADES PARA NOTIFICACIONES
 * 
 * Este archivo contiene las funciones para enviar notificaciones
 * por email, WhatsApp y SMS a clientes y proveedores.
 * 
 * TODO: Implementar las funciones reales con servicios como:
 * - Nodemailer para emails
 * - Twilio para WhatsApp/SMS
 * - O servicios alternativos según preferencia
 */

interface BookingData {
  id: string;
  clientName: string;
  description: string;
  location: string;
  urgency?: string;
}

interface BudgetData {
  price: number;
  details: string;
  materials?: string;
  estimatedTime: string;
}

/**
 * NOTIFICACIONES AL CLIENTE
 */

// Confirmar que la solicitud fue enviada
export async function sendClientConfirmationEmail(
  email: string, 
  clientName: string, 
  bookingId: string
) {
  console.log(`📧 Enviando email de confirmación a ${email}`);
  
  // TODO: Implementar envío de email
  /*
  const emailContent = {
    to: email,
    subject: 'Presupuesto solicitado - Serco',
    html: `
      <h1>Hola ${clientName},</h1>
      <p>Tu solicitud de presupuesto ha sido enviada exitosamente.</p>
      <p>En las próximas 48 horas recibirás el presupuesto detallado.</p>
      <p>Número de solicitud: ${bookingId}</p>
      <br>
      <p>Saludos,<br>Equipo Serco</p>
    `
  };
  
  await emailService.send(emailContent);
  */
  
  return { success: true, method: 'email' };
}

export async function sendClientConfirmationWhatsApp(
  phone: string,
  clientName: string,
  bookingId: string
) {
  console.log(`📱 Enviando WhatsApp de confirmación a ${phone}`);
  
  // TODO: Implementar envío de WhatsApp
  /*
  const message = `Hola ${clientName}! Tu solicitud de presupuesto fue enviada exitosamente.
En las próximas 48hs recibirás el presupuesto detallado.

Número de solicitud: ${bookingId}

- Serco`;
  
  await whatsappService.send(phone, message);
  */
  
  return { success: true, method: 'whatsapp' };
}

// Enviar presupuesto detallado cuando el profesional responde
export async function sendBudgetToClientEmail(
  email: string,
  clientName: string,
  providerName: string,
  budget: BudgetData,
  bookingId: string
) {
  console.log(`📧 Enviando presupuesto por email a ${email}`);
  
  // TODO: Implementar envío de presupuesto
  /*
  const emailContent = {
    to: email,
    subject: `Presupuesto de ${providerName} - Serco`,
    html: `
      <h1>Hola ${clientName},</h1>
      <p>${providerName} ha enviado su presupuesto:</p>
      
      <h2>Detalles del presupuesto</h2>
      <p><strong>Precio:</strong> $${budget.price}</p>
      <p><strong>Tiempo estimado:</strong> ${budget.estimatedTime}</p>
      <p><strong>Detalles:</strong></p>
      <p>${budget.details}</p>
      ${budget.materials ? `<p><strong>Materiales:</strong> ${budget.materials}</p>` : ''}
      
      <p>Para aceptar o consultar más detalles, ingresa a tu solicitud:</p>
      <a href="https://serco.com/bookings/${bookingId}">Ver presupuesto completo</a>
      
      <br><br>
      <p>Saludos,<br>Equipo Serco</p>
    `
  };
  
  await emailService.send(emailContent);
  */
  
  return { success: true, method: 'email' };
}

export async function sendBudgetToClientWhatsApp(
  phone: string,
  clientName: string,
  providerName: string,
  budget: BudgetData,
  bookingId: string
) {
  console.log(`📱 Enviando presupuesto por WhatsApp a ${phone}`);
  
  // TODO: Implementar envío de presupuesto
  /*
  const message = `Hola ${clientName}!

${providerName} ha enviado su presupuesto:

💰 Precio: $${budget.price}
⏱️ Tiempo: ${budget.estimatedTime}

📝 ${budget.details}

Para ver el presupuesto completo: https://serco.com/bookings/${bookingId}

- Serco`;
  
  await whatsappService.send(phone, message);
  */
  
  return { success: true, method: 'whatsapp' };
}

/**
 * NOTIFICACIONES AL PROFESIONAL
 */

// Notificar nueva solicitud al profesional
export async function sendProviderNewBookingNotification(
  email: string,
  providerName: string,
  booking: BookingData
) {
  console.log(`📧 Notificando nueva solicitud a ${email}`);
  
  // TODO: Implementar notificación al profesional
  /*
  const emailContent = {
    to: email,
    subject: 'Nueva solicitud de presupuesto - Serco',
    html: `
      <h1>Hola ${providerName},</h1>
      <p>Tienes una nueva solicitud de presupuesto:</p>
      
      <ul>
        <li><strong>Cliente:</strong> ${booking.clientName}</li>
        <li><strong>Servicio:</strong> ${booking.description}</li>
        <li><strong>Ubicación:</strong> ${booking.location}</li>
        <li><strong>Urgencia:</strong> ${booking.urgency || 'Media'}</li>
      </ul>
      
      <p>Ingresa a tu panel para ver los detalles y enviar tu presupuesto.</p>
      <a href="https://serco.com/dashboard/bookings/${booking.id}">Ver solicitud</a>
      
      <br><br>
      <p>Equipo Serco</p>
    `
  };
  
  await emailService.send(emailContent);
  */
  
  return { success: true };
}

export default {
  sendClientConfirmationEmail,
  sendClientConfirmationWhatsApp,
  sendBudgetToClientEmail,
  sendBudgetToClientWhatsApp,
  sendProviderNewBookingNotification,
  sendRejectionToClientEmail,
  sendRejectionToClientWhatsApp
};

// TODO: Notificación de rechazo al cliente
// Implementar cuando tengamos credenciales de email (Nodemailer/Resend) y WhatsApp (Twilio)

export async function sendRejectionToClientEmail(
  email: string,
  clientName: string,
  providerName: string,
  reason: string | null
) {
  console.log(`📧 [TODO] Enviar rechazo por email a ${email}`);

  // TODO: Implementar con Nodemailer o Resend
  /*
  const emailContent = {
    to: email,
    subject: `Tu solicitud a ${providerName} no pudo ser tomada`,
    html: `
      <h1>Hola ${clientName},</h1>
      <p>${providerName} no puede tomar tu solicitud en este momento.</p>
      ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
      <p>Podés buscar otro profesional disponible en nuestra plataforma.</p>
      <br>
      <p>Saludos,<br>Equipo SAHA</p>
    `
  };
  await emailService.send(emailContent);
  */

  return { success: true, method: 'email' };
}

export async function sendRejectionToClientWhatsApp(
  phone: string,
  clientName: string,
  providerName: string,
  reason: string | null
) {
  console.log(`📱 [TODO] Enviar rechazo por WhatsApp a ${phone}`);

  // TODO: Implementar con Twilio
  /*
  const message = `Hola ${clientName}!

Lamentablemente ${providerName} no puede tomar tu solicitud en este momento.
${reason ? `\nMotivo: ${reason}` : ''}

Podés buscar otro profesional en nuestra plataforma.

- Equipo SAHA`;
  await whatsappService.send(phone, message);
  */

  return { success: true, method: 'whatsapp' };
}
