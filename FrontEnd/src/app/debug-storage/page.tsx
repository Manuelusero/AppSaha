'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearStoragePage() {
  const router = useRouter();
  const [storageData, setStorageData] = useState<Record<string, string>>({});

  useEffect(() => {
    // Leer todo el localStorage
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    setStorageData(data);
  }, []);

  const clearAll = () => {
    localStorage.clear();
    alert('LocalStorage limpiado. Redirigiendo al login...');
    router.push('/login');
  };

  const clearSpecific = (key: string) => {
    localStorage.removeItem(key);
    const newData = { ...storageData };
    delete newData[key];
    setStorageData(newData);
    alert(`Clave "${key}" eliminada`);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1 style={{ marginBottom: '20px' }}>🔧 Debug - LocalStorage</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={clearAll}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          🗑️ Limpiar Todo y Volver al Login
        </button>
      </div>

      <h2 style={{ marginBottom: '15px' }}>Datos Actuales:</h2>
      
      {Object.keys(storageData).length === 0 ? (
        <p>No hay datos en localStorage</p>
      ) : (
        <div>
          {Object.entries(storageData).map(([key, value]) => (
            <div 
              key={key}
              style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: '#2563eb' }}>{key}:</strong>
                  <br />
                  <span style={{ 
                    wordBreak: 'break-all',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {value.length > 200 ? value.substring(0, 200) + '...' : value}
                  </span>
                </div>
                <button
                  onClick={() => clearSpecific(key)}
                  style={{
                    marginLeft: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h2>Instrucciones:</h2>
        <ol>
          <li>Haz clic en "Limpiar Todo y Volver al Login"</li>
          <li>O elimina claves específicas si sabes cuál está causando problemas</li>
          <li>Luego vuelve a iniciar sesión</li>
        </ol>
      </div>
    </div>
  );
}
