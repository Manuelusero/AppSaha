'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

export default function Recursos() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: '10 Consejos para Mejorar tu Perfil de Proveedor',
      excerpt: 'Descubrí cómo optimizar tu perfil para atraer más clientes y destacarte entre la competencia. Incluye tips sobre fotos profesionales, descripciones efectivas y más.',
      category: 'Marketing',
      date: '15 de diciembre, 2025',
      readTime: '5 min',
      image: '/Frame16.png'
    },
    {
      id: '2',
      title: 'Cómo Establecer tus Tarifas de Manera Competitiva',
      excerpt: 'Guía completa para calcular tus tarifas considerando costos, mercado local y experiencia. Aprende a equilibrar competitividad con rentabilidad.',
      category: 'Finanzas',
      date: '12 de diciembre, 2025',
      readTime: '7 min',
      image: '/Frame16.png'
    },
    {
      id: '3',
      title: 'La Importancia de las Reseñas y Cómo Conseguirlas',
      excerpt: 'Las reseñas son clave para tu éxito en SAHA. Aprende estrategias efectivas para solicitar feedback positivo de tus clientes satisfechos.',
      category: 'Reputación',
      date: '10 de diciembre, 2025',
      readTime: '4 min',
      image: '/Frame16.png'
    },
    {
      id: '4',
      title: 'Herramientas Digitales Esenciales para Profesionales',
      excerpt: 'Descubre las mejores apps y herramientas para gestionar tu agenda, presupuestos, facturación y comunicación con clientes de manera profesional.',
      category: 'Tecnología',
      date: '8 de diciembre, 2025',
      readTime: '6 min',
      image: '/Frame16.png'
    },
    {
      id: '5',
      title: 'Cómo Gestionar Clientes Difíciles con Profesionalismo',
      excerpt: 'Estrategias probadas para manejar situaciones complicadas, mantener la calma y convertir experiencias negativas en oportunidades de crecimiento.',
      category: 'Atención al Cliente',
      date: '5 de diciembre, 2025',
      readTime: '8 min',
      image: '/Frame16.png'
    },
    {
      id: '6',
      title: 'Tendencias del Mercado de Servicios en 2025',
      excerpt: 'Análisis de las especialidades más demandadas, cambios en preferencias de clientes y oportunidades emergentes en el sector de servicios.',
      category: 'Tendencias',
      date: '1 de diciembre, 2025',
      readTime: '10 min',
      image: '/Frame16.png'
    }
  ];

  const categories = ['Todos', 'Marketing', 'Finanzas', 'Reputación', 'Tecnología', 'Atención al Cliente', 'Tendencias'];
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header 
        className="px-6 py-4 flex items-center justify-between"
        style={{ 
          background: 'linear-gradient(180deg, rgba(36, 76, 135, 0.8) 0%, rgba(255, 252, 249, 0.8) 100%)',
          height: '150px'
        }}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <Image 
            src="/Logo.png" 
            alt="SaHa Logo" 
            width={120} 
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>
        <button
          onClick={() => router.push('/provider-signup')}
          className="px-6 py-2 rounded-full border-2 transition-colors"
          style={{ 
            fontFamily: 'Maitree, serif',
            fontSize: '16px',
            borderColor: '#244C87',
            color: '#244C87',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          Espacio del trabajador
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Título principal */}
        <h1 
          className="text-center mb-6"
          style={{ 
            fontFamily: 'Maitree, serif', 
            fontSize: '48px', 
            fontWeight: 700, 
            color: '#244C87',
            lineHeight: '1.2'
          }}
        >
          Recursos para Proveedores
        </h1>

        <p 
          className="text-center mb-12 max-w-3xl mx-auto"
          style={{ 
            fontFamily: 'Maitree, serif', 
            fontSize: '18px', 
            color: '#666',
            lineHeight: '1.6'
          }}
        >
          Artículos, guías y consejos prácticos para hacer crecer tu negocio y destacarte como profesional en SAHA.
        </p>

        {/* Search bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-full border-2 outline-none"
            style={{ 
              fontFamily: 'Maitree, serif',
              fontSize: '16px',
              borderColor: '#244C87',
              color: '#000000'
            }}
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-6 py-2 rounded-full transition-all duration-300"
              style={{ 
                fontFamily: 'Maitree, serif',
                fontSize: '16px',
                backgroundColor: selectedCategory === category ? '#244C87' : 'transparent',
                color: selectedCategory === category ? '#FFFFFF' : '#244C87',
                border: `2px solid #244C87`,
                cursor: 'pointer'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div 
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Imagen del post */}
              <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Contenido */}
              <div className="p-6">
                {/* Category badge */}
                <span 
                  className="inline-block px-3 py-1 rounded-full text-sm mb-3"
                  style={{ 
                    fontFamily: 'Maitree, serif',
                    backgroundColor: '#E8F0FC',
                    color: '#244C87'
                  }}
                >
                  {post.category}
                </span>

                <h3 
                  className="mb-3"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '20px', 
                    fontWeight: 600, 
                    color: '#244C87',
                    lineHeight: '1.4'
                  }}
                >
                  {post.title}
                </h3>

                <p 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '14px', 
                    color: '#666',
                    lineHeight: '1.6'
                  }}
                >
                  {post.excerpt}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-200">
                  <span style={{ fontFamily: 'Maitree, serif', color: '#999' }}>
                    📅 {post.date}
                  </span>
                  <span style={{ fontFamily: 'Maitree, serif', color: '#999' }}>
                    ⏱️ {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p style={{ fontFamily: 'Maitree, serif', fontSize: '18px', color: '#666' }}>
              No se encontraron artículos con ese criterio de búsqueda.
            </p>
          </div>
        )}

        {/* Newsletter signup */}
        <div className="mt-16 bg-blue-50 rounded-3xl p-12 text-center">
          <h2 
            className="mb-4"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '32px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            Recibí consejos exclusivos en tu email
          </h2>
          <p 
            className="mb-8"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '18px', 
              color: '#666'
            }}
          >
            Suscribite a nuestro newsletter y recibí contenido valioso cada semana.
          </p>
          <div className="flex gap-4 max-w-xl mx-auto flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-6 py-3 rounded-full border-2 outline-none"
              style={{ 
                fontFamily: 'Maitree, serif',
                fontSize: '16px',
                borderColor: '#244C87',
                color: '#000000'
              }}
            />
            <button
              className="px-8 py-3 rounded-full transition-all duration-300 hover:shadow-xl whitespace-nowrap"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '16px',
                backgroundColor: '#244C87',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Suscribirme
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-white mt-20">
        <div className="w-full bg-[#244C87]" style={{ height: '60px' }}></div>
        
        <div className="w-full bg-white py-8">
          <div className="flex justify-center">
            <Image 
              src="/Logo.png" 
              alt="SaHa Logo" 
              width={484} 
              height={134}
              className="w-auto"
              style={{ maxWidth: '484px', height: 'auto' }}
            />
          </div>
        </div>

        <div className="w-full bg-[#244C87] py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-16" style={{ gap: '86px' }}>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center">
              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Para Clientes</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => router.push('/#buscar-servicios')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Buscar Servidores</button></li>
                  <li><button onClick={() => router.push('/#como-funciona')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>¿Cómo Funciona?</button></li>
                  <li><button onClick={() => router.push('/seguridad-confianza')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Seguridad y Confianza</button></li>
                  <li><button onClick={() => router.push('/ayuda')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Ayuda</button></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Para Proveedores</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => router.push('/provider-signup')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Sumate como proveedor</button></li>
                  <li><button onClick={() => router.push('/experiencias')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Experiencias</button></li>
                  <li><button onClick={() => router.push('/recursos')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Recursos útiles</button></li>
                  <li><button onClick={() => router.push('/soporte-proveedores')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Soporte Proveedores</button></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6" style={{ fontFamily: 'Maitree, serif', fontWeight: 400, fontSize: '24px' }}>Empresa</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Sobre nosotros</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Trabaja con nosotros</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Contacto</a></li>
                  <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px' }}>Prensa</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/30 mb-8"></div>

            <div className="text-center">
              <p style={{ fontFamily: 'Maitree, serif', fontStyle: 'italic', fontSize: '16px' }}>Creado por Bren y Manu</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
