'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

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
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

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

      <Footer />
    </div>
  );
}
