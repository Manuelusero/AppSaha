'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ContinuarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [name, setName] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); return; }

    const verify = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_URL}/api/auth/verify-email/${token}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        // Persist session data so the signup form at step 2 can use the userId
        localStorage.setItem('preRegisterId', data.userId);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);

        setName(data.name?.split(' ')[0] || '');
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };
    verify();
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div style={centered}>
        <p style={subtitle}>Verificando tu email...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={centered}>
        <div style={card}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>❌</div>
          <h1 style={heading}>Enlace inválido o expirado</h1>
          <p style={subtitle}>El enlace de verificación ya no es válido. Intentá registrarte nuevamente.</p>
          <button style={btn} onClick={() => router.push('/provider-signup')}>
            Volver al registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={centered}>
      <div style={card}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h1 style={heading}>¡Email verificado{name ? `, ${name}` : ''}!</h1>
        <p style={subtitle}>Tu cuenta fue verificada correctamente. Ahora podés continuar completando tu perfil profesional.</p>
        <button style={btn} onClick={() => router.push('/provider-signup?step=2')}>
          Continuar completando mi perfil
        </button>
        <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '16px', fontFamily: 'Maitree, serif' }}>
          También podés iniciar sesión más tarde y completarlo desde tu dashboard.
        </p>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const centered: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#FFFCF9',
  padding: '24px',
};

const card: React.CSSProperties = {
  background: 'white',
  borderRadius: '24px',
  padding: '48px 36px',
  maxWidth: '420px',
  width: '100%',
  textAlign: 'center',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
};

const heading: React.CSSProperties = {
  fontFamily: 'Maitree, serif',
  fontSize: '22px',
  fontWeight: 600,
  color: '#244C87',
  margin: '0 0 12px',
};

const subtitle: React.CSSProperties = {
  fontFamily: 'Maitree, serif',
  fontSize: '15px',
  color: '#6B7280',
  lineHeight: 1.6,
  margin: '0 0 28px',
};

const btn: React.CSSProperties = {
  background: '#244C87',
  color: 'white',
  border: 'none',
  borderRadius: '999px',
  padding: '13px 28px',
  fontFamily: 'Maitree, serif',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  width: '100%',
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ContinuarPage() {
  return (
    <Suspense fallback={<div style={centered}><p style={subtitle}>Cargando...</p></div>}>
      <ContinuarContent />
    </Suspense>
  );
}
