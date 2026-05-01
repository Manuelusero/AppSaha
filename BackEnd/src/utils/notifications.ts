import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Remitente provisional. Cuando haya dominio verificado en Resend cambiar por ej: notificaciones@serco.com.ar
const FROM = 'Serco <onboarding@resend.dev>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://app-saha.vercel.app';

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FFFCF9;font-family:'Georgia',serif;">
  <div style="max-width:560px;margin:40px auto;background:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#244C87;padding:28px 32px;">
      <h1 style="margin:0;color:#FFFFFF;font-size:22px;font-weight:600;letter-spacing:0.5px;">Serco</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Servicios del hogar y más</p>
    </div>
    <div style="padding:32px;">
      ${content}
    </div>
    <div style="padding:20px 32px;border-top:1px solid #F0E8E0;text-align:center;">
      <p style="margin:0;color:#9CA3AF;font-size:12px;">Este email fue enviado automáticamente. No respondas este mensaje.</p>
    </div>
  </div>
</body>
</html>`;

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

// ─── Confirmación al cliente: solicitud recibida ──────────────────────────────

export async function sendClientConfirmationEmail(
  email: string,
  clientName: string,
  bookingId: string
) {
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Tu solicitud fue enviada — Serco',
      html: emailWrapper(`
        <h2 style="margin:0 0 16px;color:#244C87;font-size:20px;">Hola, ${clientName}!</h2>
        <p style="color:#374151;line-height:1.6;">Tu solicitud de presupuesto fue enviada exitosamente. El profesional la revisará y te enviará su presupuesto a la brevedad.</p>
        <div style="background:#F9FAFB;border-radius:12px;padding:16px;margin:24px 0;">
          <p style="margin:0;color:#6B7280;font-size:13px;">Número de solicitud</p>
          <p style="margin:4px 0 0;color:#374151;font-size:14px;font-weight:600;">${bookingId}</p>
        </div>
        <p style="color:#374151;line-height:1.6;">Te notificaremos cuando el presupuesto esté listo.</p>
        <p style="color:#374151;margin-top:24px;">Saludos,<br><strong>Equipo Serco</strong></p>
      `)
    });
    console.log(`📧 Confirmación enviada a ${email}`);
    return { success: true, method: 'email' };
  } catch (error) {
    console.error('❌ Error enviando confirmación al cliente:', error);
    return { success: false, method: 'email' };
  }
}

export async function sendClientConfirmationWhatsApp(
  phone: string,
  clientName: string,
  bookingId: string
) {
  // TODO: Implementar con Twilio cuando tengamos el número de WhatsApp Business
  console.log(`📱 [TODO] WhatsApp confirmación → ${phone}`);
  return { success: true, method: 'whatsapp' };
}

// ─── Presupuesto al cliente ───────────────────────────────────────────────────

export async function sendBudgetToClientEmail(
  email: string,
  clientName: string,
  providerName: string,
  budget: BudgetData,
  bookingId: string,
  providerPhone?: string
) {
  try {
    const precio = new Intl.NumberFormat('es-AR').format(budget.price);
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Tu presupuesto de ${providerName} está listo — Serco`,
      html: emailWrapper(`
        <h2 style="margin:0 0 8px;color:#244C87;font-size:20px;">Hola, ${clientName}!</h2>
        <p style="color:#374151;line-height:1.6;margin-bottom:24px;"><strong>${providerName}</strong> revisó tu solicitud y te envía el siguiente presupuesto:</p>

        <div style="background:#F0F4FF;border-radius:16px;padding:20px;margin-bottom:20px;">
          <div style="margin-bottom:12px;">
            <span style="color:#6B7280;font-size:14px;">Valor estimado</span>
            <p style="margin:4px 0 0;color:#244C87;font-size:24px;font-weight:700;">$${precio}</p>
          </div>
          ${budget.estimatedTime ? `
          <div style="margin-bottom:10px;">
            <span style="color:#6B7280;font-size:13px;">Tiempo estimado</span>
            <p style="margin:4px 0 0;color:#374151;font-size:14px;">${budget.estimatedTime}</p>
          </div>` : ''}
          <div style="margin-bottom:${budget.materials ? '10px' : '0'};">
            <span style="color:#6B7280;font-size:13px;">Descripción del trabajo</span>
            <p style="margin:4px 0 0;color:#374151;font-size:14px;line-height:1.5;">${budget.details}</p>
          </div>
          ${budget.materials ? `
          <div>
            <span style="color:#6B7280;font-size:13px;">Materiales incluidos</span>
            <p style="margin:4px 0 0;color:#374151;font-size:14px;">${budget.materials}</p>
          </div>` : ''}
        </div>

        ${providerPhone ? `
        <div style="background:#F0F9F4;border-radius:14px;padding:18px;margin-top:20px;">
          <p style="margin:0 0 6px;color:#374151;font-size:14px;font-weight:600;">Contactar al profesional</p>
          <p style="margin:0 0 14px;color:#6B7280;font-size:13px;">${providerName} · ${providerPhone}</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <a href="tel:${providerPhone.replace(/\s/g,'')}"
               style="display:inline-block;background:#244C87;color:#FFFFFF;text-decoration:none;padding:10px 20px;border-radius:999px;font-size:13px;font-weight:600;">
              📞 Llamar
            </a>
            <a href="https://wa.me/${providerPhone.replace(/[^0-9]/g,'')}"
               style="display:inline-block;background:#25D366;color:#FFFFFF;text-decoration:none;padding:10px 20px;border-radius:999px;font-size:13px;font-weight:600;">
              💬 WhatsApp
            </a>
          </div>
        </div>` : `<p style="color:#6B7280;font-size:13px;line-height:1.5;">Si tenés preguntas, podés contactarte directamente con el profesional.</p>`}
        <p style="color:#374151;margin-top:24px;">Saludos,<br><strong>Equipo Serco</strong></p>
      `)
    });
    console.log(`📧 Presupuesto enviado a ${email}`);
    return { success: true, method: 'email' };
  } catch (error) {
    console.error('❌ Error enviando presupuesto al cliente:', error);
    return { success: false, method: 'email' };
  }
}

export async function sendBudgetToClientWhatsApp(
  phone: string,
  clientName: string,
  providerName: string,
  budget: BudgetData,
  bookingId: string
) {
  // TODO: Implementar con Twilio cuando tengamos el número de WhatsApp Business
  console.log(`📱 [TODO] WhatsApp presupuesto → ${phone}`);
  return { success: true, method: 'whatsapp' };
}

// ─── Notificación al proveedor: nueva solicitud ───────────────────────────────

export async function sendProviderNewBookingNotification(
  email: string,
  providerName: string,
  booking: BookingData
) {
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Tenés una nueva solicitud — Serco',
      html: emailWrapper(`
        <h2 style="margin:0 0 16px;color:#244C87;font-size:20px;">Hola, ${providerName}!</h2>
        <p style="color:#374151;line-height:1.6;">Recibiste una nueva solicitud de presupuesto:</p>

        <div style="background:#F9FAFB;border-radius:12px;padding:20px;margin:20px 0;">
          <div style="margin-bottom:10px;">
            <span style="color:#6B7280;font-size:13px;">Cliente</span>
            <p style="margin:4px 0 0;color:#374151;font-size:14px;font-weight:600;">${booking.clientName}</p>
          </div>
          <div style="margin-bottom:10px;">
            <span style="color:#6B7280;font-size:13px;">Descripción</span>
            <p style="margin:4px 0 0;color:#374151;font-size:14px;">${booking.description}</p>
          </div>
          <div style="margin-bottom:10px;">
            <span style="color:#6B7280;font-size:13px;">Ubicación</span>
            <p style="margin:4px 0 0;color:#374151;font-size:14px;">${booking.location}</p>
          </div>
          <div>
            <span style="color:#6B7280;font-size:13px;">Urgencia</span>
            <p style="margin:4px 0 0;color:#374151;font-size:14px;">${booking.urgency || 'Normal'}</p>
          </div>
        </div>

        <a href="${FRONTEND_URL}/solicitudes-trabajo"
           style="display:inline-block;background:#244C87;color:#FFFFFF;text-decoration:none;padding:12px 28px;border-radius:999px;font-size:14px;font-weight:600;margin-top:8px;">
          Ver solicitud
        </a>
        <p style="color:#374151;margin-top:24px;">Saludos,<br><strong>Equipo Serco</strong></p>
      `)
    });
    console.log(`📧 Nueva solicitud notificada a proveedor ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error notificando al proveedor:', error);
    return { success: false };
  }
}

// ─── Rechazo al cliente ───────────────────────────────────────────────────────

export async function sendRejectionToClientEmail(
  email: string,
  clientName: string,
  providerName: string,
  reason: string | null
) {
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Actualización sobre tu solicitud — Serco',
      html: emailWrapper(`
        <h2 style="margin:0 0 16px;color:#244C87;font-size:20px;">Hola, ${clientName}!</h2>
        <p style="color:#374151;line-height:1.6;">Lamentablemente <strong>${providerName}</strong> no puede tomar tu solicitud en este momento.</p>
        ${reason ? `
        <div style="background:#FEF2F2;border-left:3px solid #EF4444;border-radius:0 12px 12px 0;padding:14px 18px;margin:20px 0;">
          <span style="color:#6B7280;font-size:13px;">Motivo indicado</span>
          <p style="margin:4px 0 0;color:#374151;font-size:14px;">${reason}</p>
        </div>` : ''}
        <p style="color:#374151;line-height:1.6;">Podés buscar otro profesional disponible en nuestra plataforma.</p>
        <a href="${FRONTEND_URL}/buscar"
           style="display:inline-block;background:#244C87;color:#FFFFFF;text-decoration:none;padding:12px 28px;border-radius:999px;font-size:14px;font-weight:600;margin-top:8px;">
          Buscar otro profesional
        </a>
        <p style="color:#374151;margin-top:24px;">Saludos,<br><strong>Equipo Serco</strong></p>
      `)
    });
    console.log(`📧 Rechazo notificado a ${email}`);
    return { success: true, method: 'email' };
  } catch (error) {
    console.error('❌ Error enviando rechazo al cliente:', error);
    return { success: false, method: 'email' };
  }
}

export async function sendRejectionToClientWhatsApp(
  phone: string,
  clientName: string,
  providerName: string,
  reason: string | null
) {
  // TODO: Implementar con Twilio cuando tengamos el número de WhatsApp Business
  console.log(`📱 [TODO] WhatsApp rechazo → ${phone}`);
  return { success: true, method: 'whatsapp' };
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
