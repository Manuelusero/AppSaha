// ============================================================
// SEO: Revisar con la diseñadora antes de lanzar
// Completar: title, description, openGraph image
// ============================================================
import type { Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { colors, typography } from '@/styles/tokens';

export const metadata: Metadata = {
  // TODO ✏️ Revisar con diseñadora
  title: 'Política de Privacidad – SERCO',
  description:
    'Conocé cómo SERCO recopila, usa y protege tu información personal conforme a la Ley 25.326 de Protección de Datos Personales.',
  // TODO ✏️ Agregar imagen OG cuando esté disponible
  // openGraph: {
  //   title: 'Política de Privacidad – SERCO',
  //   description: '...',
  //   images: [{ url: '/og-privacidad.png', width: 1200, height: 630 }],
  // },
};

const LAST_UPDATED = '19 de marzo de 2026';
const COMPANY_NAME = 'SERCO';
const COMPANY_EMAIL = 'privacidad@serco.com.ar'; // TODO ✏️ confirmar email real
const COMPANY_ADDRESS = 'Buenos Aires, Argentina'; // TODO ✏️ confirmar dirección

// ============================================================
// HELPERS
// ============================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="mb-3"
        style={{
          fontFamily: typography.fontFamily.primary,
          fontSize: '22px',
          fontWeight: 600,
          color: colors.primary.main,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontFamily: typography.fontFamily.primary,
          fontSize: '16px',
          lineHeight: '1.8',
          color: colors.neutral[700],
        }}
      >
        {children}
      </div>
    </section>
  );
}

// ============================================================
// ============================================================
// PAGE
// ============================================================

// Botón de volver — necesita 'use client' por useRouter
import BackButton from './BackButton';

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFCF9' }}>
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-16">
        {/* Encabezado */}
        <div className="mb-12">
          <BackButton />
          <h1
            className="mb-3"
            style={{
              fontFamily: typography.fontFamily.primary,
              fontSize: '40px',
              fontWeight: 700,
              color: colors.primary.main,
              lineHeight: '1.2',
            }}
          >
            Política de Privacidad
          </h1>
          <p style={{ fontFamily: typography.fontFamily.primary, fontSize: '14px', color: colors.neutral[500] }}>
            Última actualización: {LAST_UPDATED}
          </p>
        </div>

        {/* Introducción */}
        <Section title="1. Introducción">
          <p>
            En <strong>{COMPANY_NAME}</strong> nos comprometemos a proteger tu privacidad. Esta Política de
            Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos la información personal que
            nos proporcionás al usar nuestra plataforma, en cumplimiento de la{' '}
            <strong>Ley 25.326 de Protección de Datos Personales</strong> de la República Argentina.
          </p>
          <p className="mt-3">
            Al acceder o usar los servicios de {COMPANY_NAME}, aceptás los términos de esta política.
          </p>
        </Section>

        {/* Datos que recopilamos */}
        <Section title="2. Datos que recopilamos">
          <p className="mb-2">Podemos recopilar los siguientes tipos de información:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Datos de registro:</strong> nombre, apellido, dirección de correo electrónico,
              contraseña (encriptada), número de teléfono.
            </li>
            <li>
              <strong>Datos de perfil:</strong> foto de perfil, DNI (para prestadores), certificados
              habilitantes, portfolio de trabajos.
            </li>
            <li>
              <strong>Datos de actividad:</strong> servicios buscados, reservas realizadas, reseñas y
              valoraciones.
            </li>
            <li>
              <strong>Datos de uso:</strong> dirección IP, tipo de dispositivo, páginas visitadas, duración
              de sesión (mediante cookies analíticas, solo si las aceptaste).
            </li>
            <li>
              <strong>Datos de ubicación:</strong> ciudad o localidad que ingresás al buscar servicios.
            </li>
          </ul>
        </Section>

        {/* Uso de la información */}
        <Section title="3. Uso de la información">
          <p className="mb-2">Usamos tus datos para:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Brindarte acceso a la plataforma y gestionar tu cuenta.</li>
            <li>Conectarte con prestadores de servicios según tu búsqueda.</li>
            <li>Procesar y gestionar solicitudes de presupuesto.</li>
            <li>Enviarte notificaciones relacionadas con tu actividad en {COMPANY_NAME}.</li>
            <li>Mejorar la experiencia del usuario y el rendimiento de la plataforma.</li>
            <li>Cumplir con obligaciones legales aplicables.</li>
          </ul>
          <p className="mt-3">
            <strong>No vendemos ni cedemos tu información personal a terceros</strong> con fines
            comerciales sin tu consentimiento explícito.
          </p>
        </Section>

        {/* Cookies */}
        <Section title="4. Uso de cookies">
          <p className="mb-2">
            Utilizamos cookies para mejorar tu experiencia. Las categorías son:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Necesarias:</strong> esenciales para el funcionamiento del sitio (autenticación,
              seguridad). Siempre activas.
            </li>
            <li>
              <strong>Analíticas:</strong> nos ayudan a entender cómo usás el sitio (datos anónimos).
              Solo se activan con tu consentimiento.
            </li>
            <li>
              <strong>Marketing:</strong> permiten mostrarte contenido relevante. Solo se activan con tu
              consentimiento.
            </li>
          </ul>
          <p className="mt-3">
            Podés gestionar tus preferencias de cookies en cualquier momento desde el banner de cookies
            o eliminándolas desde la configuración de tu navegador.
          </p>
        </Section>

        {/* Almacenamiento y seguridad */}
        <Section title="5. Almacenamiento y seguridad">
          <p>
            Tus datos se almacenan en servidores seguros. Aplicamos medidas técnicas y organizativas
            para proteger tu información contra accesos no autorizados, pérdida o alteración, incluyendo
            cifrado en tránsito (HTTPS) y en reposo.
          </p>
          <p className="mt-3">
            Los datos de identificación de prestadores (DNI, certificados) se almacenan únicamente durante
            el proceso de verificación y son eliminados conforme a nuestra política de retención de datos.
          </p>
        </Section>

        {/* Retención de datos */}
        <Section title="6. Retención de datos">
          <p>
            Conservamos tu información personal mientras tu cuenta esté activa o sea necesaria para
            prestarte el servicio. Si solicitás la eliminación de tu cuenta, procederemos a borrar o
            anonimizar tus datos dentro de los <strong>30 días hábiles</strong>, salvo obligación
            legal en contrario.
          </p>
        </Section>

        {/* Tus derechos */}
        <Section title="7. Tus derechos">
          <p className="mb-2">
            Conforme a la Ley 25.326 y el RGPD (si aplicara), tenés derecho a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Acceso:</strong> conocer qué datos tenemos sobre vos.</li>
            <li><strong>Rectificación:</strong> corregir datos incorrectos o incompletos.</li>
            <li><strong>Supresión:</strong> solicitar la eliminación de tus datos ("derecho al olvido").</li>
            <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos para fines específicos.</li>
            <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado y legible.</li>
          </ul>
          <p className="mt-3">
            Para ejercer estos derechos, escribinos a{' '}
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              style={{ color: colors.primary.main, textDecoration: 'underline' }}
            >
              {COMPANY_EMAIL}
            </a>
            .
          </p>
        </Section>

        {/* Menores */}
        <Section title="8. Menores de edad">
          <p>
            {COMPANY_NAME} no está dirigida a menores de 18 años. No recopilamos conscientemente datos
            de personas menores de edad. Si tomamos conocimiento de ello, procederemos a eliminar esa
            información de forma inmediata.
          </p>
        </Section>

        {/* Cambios */}
        <Section title="9. Cambios a esta política">
          <p>
            Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos mediante un
            aviso en la plataforma o por email ante cambios significativos. El uso continuado del servicio
            tras la publicación de cambios implica tu aceptación.
          </p>
        </Section>

        {/* Contacto */}
        <Section title="10. Contacto">
          <p>
            Si tenés preguntas sobre esta política o el tratamiento de tus datos, contactanos:
          </p>
          <ul className="mt-3 space-y-1">
            <li>
              📧{' '}
              <a
                href={`mailto:${COMPANY_EMAIL}`}
                style={{ color: colors.primary.main, textDecoration: 'underline' }}
              >
                {COMPANY_EMAIL}
              </a>
            </li>
            <li>📍 {COMPANY_ADDRESS}</li>
          </ul>
        </Section>

        {/* Separador */}
        <div className="border-t mt-12 pt-6" style={{ borderColor: colors.secondary.dark }}>
          <p style={{ fontFamily: typography.fontFamily.primary, fontSize: '13px', color: colors.neutral[400] }}>
            © {new Date().getFullYear()} {COMPANY_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
