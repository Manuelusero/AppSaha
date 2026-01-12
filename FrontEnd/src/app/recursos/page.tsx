'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

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
      excerpt: 'Las reseñas son clave para tu éxito en SERCO. Aprende estrategias efectivas para solicitar feedback positivo de tus clientes satisfechos.',
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
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

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
          Artículos, guías y consejos prácticos para hacer crecer tu negocio y destacarte como profesional en SERCO.
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

      <Footer />
    </div>
  );
}
