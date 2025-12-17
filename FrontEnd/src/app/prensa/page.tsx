'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  date: string;
  category: string;
  image: string;
  url?: string;
}

export default function Prensa() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const articles: Article[] = [
    {
      id: '1',
      title: 'SERCO: La Plataforma que Revoluciona el Mercado de Servicios en Argentina',
      excerpt: 'Una nueva startup argentina conecta a profesionales con clientes de manera segura y transparente, transformando la forma en que contratamos servicios en el país.',
      source: 'La Nación',
      date: '15 de diciembre, 2025',
      category: 'Noticias',
      image: '/Frame16.png'
    },
    {
      id: '2',
      title: 'Emprendedores Argentinos Crean Solución Innovadora para Trabajadores Independientes',
      excerpt: 'SERCO democratiza el acceso a oportunidades laborales para profesionales de servicios, permitiéndoles hacer crecer sus negocios sin depender del boca a boca.',
      source: 'Clarín Pyme',
      date: '10 de diciembre, 2025',
      category: 'Emprendimientos',
      image: '/Frame16.png'
    },
    {
      id: '3',
      title: 'Tecnología al Servicio de la Confianza: Cómo SERCO Verifica Profesionales',
      excerpt: 'La startup implementa un sistema de verificación de identidad y reseñas que garantiza seguridad para clientes y profesionales por igual.',
      source: 'Infobae Tecnología',
      date: '5 de diciembre, 2025',
      category: 'Tecnología',
      image: '/Frame16.png'
    },
    {
      id: '4',
      title: 'El Futuro del Trabajo: SERCO y la Economía de Servicios Digitales',
      excerpt: 'Análisis sobre cómo plataformas como SERCO están transformando el mercado laboral argentino y creando nuevas oportunidades para profesionales independientes.',
      source: 'iProfesional',
      date: '1 de diciembre, 2025',
      category: 'Análisis',
      image: '/Frame16.png'
    },
    {
      id: '5',
      title: 'SERCO Entre las 10 Startups más Prometedoras de Argentina',
      excerpt: 'La plataforma de servicios fue reconocida por inversores y expertos como una de las propuestas más innovadoras del ecosistema emprendedor local.',
      source: 'Ámbito Financiero',
      date: '28 de noviembre, 2025',
      category: 'Reconocimientos',
      image: '/Frame16.png'
    },
    {
      id: '6',
      title: 'Testimonios: Profesionales que Triplicaron sus Ingresos Gracias a SERCO',
      excerpt: 'Historias reales de trabajadores independientes que lograron estabilizar y hacer crecer sus negocios utilizando la plataforma.',
      source: 'TN Economía',
      date: '20 de noviembre, 2025',
      category: 'Casos de Éxito',
      image: '/Frame16.png'
    }
  ];

  const categories = ['Todos', 'Noticias', 'Emprendimientos', 'Tecnología', 'Análisis', 'Reconocimientos', 'Casos de Éxito'];

  const filteredArticles = selectedCategory === 'Todos' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

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
            alt="Serco Logo" 
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
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 
            className="mb-6"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '48px', 
              fontWeight: 700, 
              color: '#244C87',
              lineHeight: '1.2'
            }}
          >
            SERCO en los Medios
          </h1>
          <p 
            className="max-w-3xl mx-auto"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '20px', 
              color: '#666',
              lineHeight: '1.8'
            }}
          >
            Descubrí lo que dicen los principales medios sobre SERCO y cómo estamos transformando 
            el mercado de servicios en Argentina.
          </p>
        </div>

        {/* Press Kit CTA */}
        <div className="bg-blue-50 rounded-3xl p-8 mb-12 text-center">
          <h2 
            className="mb-4"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '24px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            ¿Sos periodista?
          </h2>
          <p 
            className="mb-6"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '16px', 
              color: '#666',
              lineHeight: '1.6'
            }}
          >
            Descargá nuestro kit de prensa con logos, imágenes y material de comunicación.
          </p>
          <button
            onClick={() => router.push('/contacto')}
            className="px-8 py-3 rounded-full transition-all duration-300"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '16px',
              fontWeight: 500,
              backgroundColor: '#244C87',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Contacto de Prensa
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-6 py-2 rounded-full transition-all duration-300"
              style={{ 
                fontFamily: 'Maitree, serif',
                fontSize: '15px',
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

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredArticles.map((article) => (
            <div 
              key={article.id}
              className="bg-white rounded-3xl overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category & Date */}
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ 
                      fontFamily: 'Maitree, serif',
                      backgroundColor: '#E8F0FC',
                      color: '#244C87'
                    }}
                  >
                    {article.category}
                  </span>
                  <span 
                    style={{ 
                      fontFamily: 'Maitree, serif',
                      fontSize: '12px',
                      color: '#999'
                    }}
                  >
                    {article.date}
                  </span>
                </div>

                {/* Source */}
                <p 
                  className="mb-2"
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '14px', 
                    fontWeight: 600,
                    color: '#244C87'
                  }}
                >
                  📰 {article.source}
                </p>

                {/* Title */}
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
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '14px', 
                    color: '#666',
                    lineHeight: '1.6'
                  }}
                >
                  {article.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-blue-50 rounded-3xl p-12 mb-16">
          <h2 
            className="text-center mb-12"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '36px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            SERCO en Números
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Profesionales Registrados' },
              { number: '2,000+', label: 'Servicios Completados' },
              { number: '15+', label: 'Menciones en Medios' },
              { number: '4.8/5', label: 'Calificación Promedio' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '40px', 
                    fontWeight: 700, 
                    color: '#244C87',
                    marginBottom: '8px'
                  }}
                >
                  {stat.number}
                </p>
                <p 
                  style={{ 
                    fontFamily: 'Maitree, serif', 
                    fontSize: '14px', 
                    color: '#666'
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-white rounded-3xl border-2 border-gray-200 p-12 text-center">
          <h2 
            className="mb-4"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '32px', 
              fontWeight: 600, 
              color: '#244C87'
            }}
          >
            ¿Querés Cubrir Nuestra Historia?
          </h2>
          <p 
            className="mb-8 max-w-2xl mx-auto"
            style={{ 
              fontFamily: 'Maitree, serif', 
              fontSize: '18px', 
              color: '#666',
              lineHeight: '1.6'
            }}
          >
            Estamos disponibles para entrevistas, notas de prensa y colaboraciones. 
            Contactanos para coordinar una reunión.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/contacto')}
              className="px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '18px',
                fontWeight: 500,
                backgroundColor: '#244C87',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Contactar Prensa
            </button>
            <a
              href="mailto:prensa@serco.com"
              className="px-8 py-4 rounded-full transition-all duration-300 border-2 inline-flex items-center justify-center"
              style={{ 
                fontFamily: 'Maitree, serif', 
                fontSize: '18px',
                fontWeight: 500,
                backgroundColor: 'transparent',
                color: '#244C87',
                borderColor: '#244C87',
                textDecoration: 'none'
              }}
            >
              prensa@serco.com
            </a>
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
              alt="Serco Logo" 
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
                  <li><button onClick={() => router.push('/sobre-nosotros')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Sobre nosotros</button></li>
                  <li><button onClick={() => router.push('/trabaja-con-nosotros')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Trabaja con nosotros</button></li>
                  <li><button onClick={() => router.push('/contacto')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Contacto</button></li>
                  <li><button onClick={() => router.push('/prensa')} className="hover:opacity-80 transition-opacity" style={{ fontFamily: 'Maitree, serif', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>Prensa</button></li>
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
