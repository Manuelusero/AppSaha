# 🔍 SEO Roadmap – SERCO

Pendientes para mejorar el posicionamiento en Google una vez que haya tráfico real.

---

## 1. URLs amigables para perfiles de prestadores

**Problema actual:**

```
/search-results?servicio=Plomeros&ubicacion=cordoba&especialidades=...
/providers/123
```

**Objetivo:**

```
/plomeros-en-cordoba
/providers/juan-lopez-plomero-cordoba
```

**Qué hay que hacer:**

- Agregar campo `slug` en la DB del prestador (ej: `juan-lopez-plomero-cordoba`)
- Cambiar las rutas dinámicas de `/providers/[id]` a `/providers/[slug]`
- Redirigir las URLs viejas con `redirect()` de Next.js para no perder posicionamiento
- Generar `generateMetadata()` dinámico con nombre + especialidad + ciudad del prestador

---

## 2. Páginas de categoría por ciudad (Landing SEO)

Páginas estáticas que rankean cuando alguien busca en Google:

> _"plomeros en córdoba"_, _"electricistas buenos aires"_, etc.

**Rutas a crear:**

```
/servicios/[especialidad]/[ciudad]
```

Ejemplo: `/servicios/plomeros/cordoba` → aparece en Google para "plomeros en córdoba"

**Contenido de cada página:**

- H1 con keyword: "Plomeros en Córdoba"
- Lista de los mejores prestadores de esa categoría/ciudad (datos reales de la DB)
- Reseñas destacadas
- CTA para buscar más o registrarse como prestador
- `generateStaticParams()` para pre-renderizar las combinaciones más buscadas

**Prioridad de ciudades:**

1. Buenos Aires (CABA + GBA)
2. Córdoba
3. Rosario
4. Mendoza
5. Mar del Plata

**Prioridad de especialidades:**

1. Plomeros
2. Electricistas
3. Pintores
4. Gasistas
5. Albañiles

---

## 3. SEO con reseñas (UGC – User Generated Content)

Cada reseña que deja un cliente es contenido indexable por Google.

**Para que funcione bien:**

- Las reseñas deben mostrarse en el HTML del servidor (no cargarse con JS en el cliente)
- Usar `schema.org/Review` para que Google las muestre como "estrellas" en los resultados
- Implementar `schema.org/LocalBusiness` en los perfiles de prestadores

**Ejemplo de schema.org a agregar en `/providers/[slug]/page.tsx`:**

```tsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: provider.name,
    description: provider.bio,
    address: { "@type": "PostalAddress", addressLocality: provider.city },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: provider.rating,
      reviewCount: provider.reviewCount,
    },
  })}
</script>
```

---

## 4. Sitemap dinámico

Crear `/app/sitemap.ts` para que Google descubra todas las páginas:

```ts
// /FrontEnd/src/app/sitemap.ts
export default async function sitemap() {
  const providers = await fetchAllProviders();
  return [
    { url: "https://serco.com.ar", lastModified: new Date() },
    { url: "https://serco.com.ar/buscar", lastModified: new Date() },
    ...providers.map((p) => ({
      url: `https://serco.com.ar/providers/${p.slug}`,
      lastModified: p.updatedAt,
    })),
  ];
}
```

---

## 5. robots.txt

Crear `/public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /dashboard-client/
Disallow: /dashboard-provider/
Disallow: /debug-storage/
Sitemap: https://serco.com.ar/sitemap.xml
```

---

## Estado

| Tarea                      | Prioridad | Estado           |
| -------------------------- | --------- | ---------------- |
| URLs amigables prestadores | 🔴 Alta   | Pendiente        |
| Páginas categoría/ciudad   | 🔴 Alta   | Pendiente        |
| Schema.org en perfiles     | 🟡 Media  | Pendiente        |
| Sitemap dinámico           | 🟡 Media  | Pendiente        |
| robots.txt                 | 🟢 Baja   | Pendiente        |
| OG images (diseñadora)     | 🔴 Alta   | Esperando imagen |
