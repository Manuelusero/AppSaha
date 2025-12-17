# 🚀 Despliegue Rápido - SERCO

## ✅ Cambios Completados

### Rebranding

- ✅ Todo el texto cambiado de "SAHA" a "SERCO"
- ⚠️ **Pendiente**: Cambiar logos (Logo.png y Frame16.png)

### Optimización iPhone

- ✅ CSS optimizado para notch y safe areas
- ✅ Viewport configurado para iOS
- ✅ Tamaños táctiles optimizados

## 📱 Despliegue Más Rápido (Solo Frontend)

### Opción 1: Vercel (Recomendado - 5 minutos)

1. **Crear cuenta en Vercel:**

   - Ir a [vercel.com](https://vercel.com)
   - Registrarse con GitHub

2. **Preparar código:**

   ```bash
   cd /Users/manuelusero/Desktop/Proyect\ SAHA/FrontEnd
   ```

3. **Instalar Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

4. **Desplegar:**
   ```bash
   vercel
   ```
   - Seguir las instrucciones en pantalla
   - Confirmar configuración por defecto
   - ¡Listo! Te dará una URL pública

**URL ejemplo:** `https://serco-xxx.vercel.app`

### Opción 2: Netlify (Alternativa)

1. **Crear cuenta:** [netlify.com](https://netlify.com)

2. **Desplegar vía drag & drop:**
   ```bash
   cd /Users/manuelusero/Desktop/Proyect\ SAHA/FrontEnd
   npm run build
   ```
   - Arrastrar carpeta `.next` a Netlify
   - ¡Listo!

## ⚠️ Importante para Demo

### Backend Temporal

Por ahora, el backend está en `localhost:8000`. Para la demo:

**Opción A - Demo local:**

1. Mantener backend corriendo en tu Mac
2. Compartir pantalla o usar ngrok para exponer temporalmente

**Opción B - Backend en Railway (10 minutos):**

1. Ir a [railway.app](https://railway.app)
2. Crear proyecto
3. Deploy desde GitHub
4. Actualizar URL en FrontEnd

### Variables de Entorno

Si despliegas backend, actualizar en FrontEnd:

```bash
# En Vercel, agregar variable de entorno:
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app
```

## 🎨 Próximos Pasos

1. **Logo:**

   - Recibir nuevo logo de diseñadora
   - Reemplazar `Logo.png` en `/FrontEnd/public/`
   - Tamaños recomendados:
     - Logo principal: 484x134px (actual)
     - Logo header: 120x40px (actual)

2. **Favicon:**

   - Crear favicon.ico
   - Colocar en `/FrontEnd/public/`

3. **Imágenes de perfil:**
   - Frame16.png es el placeholder actual
   - Reemplazar con imágenes reales

## 📞 Testing en iPhone

1. **Abrir Safari en iPhone**
2. **Ir a la URL de Vercel**
3. **Agregar a Home Screen** (para probar como PWA)
4. **Verificar:**
   - ✅ Notch no cubre contenido
   - ✅ Barra inferior no interfiere
   - ✅ Formularios se pueden usar bien
   - ✅ Navegación suave

## 🔧 Comandos Útiles

### Local:

```bash
# Frontend
cd FrontEnd
npm run dev  # http://localhost:3000

# Backend
cd BackEnd
npm start    # http://localhost:8000
```

### Build para producción:

```bash
cd FrontEnd
npm run build
npm run start  # Preview de producción
```

## 📊 Estado del Proyecto

- ✅ Frontend: Completo y listo para demo
- ✅ Backend: Funcional localmente
- ⚠️ Base de datos: SQLite local (ok para demo)
- 🔄 Autenticación: JWT funcionando
- 🔄 Uploads: Multer local (funciona para demo)

## 💡 Recomendación

Para mostrar a la diseñadora:

1. Desplegar frontend en Vercel (5 min)
2. Backend mantenerlo local por ahora
3. Para funciones que requieren backend, mostrar con datos mock o tu computadora
4. Enfocarse en el diseño, flujo y UX

Una vez aprobado el diseño:

- Desplegar backend completo
- Conectar base de datos en nube
- Configurar dominio propio
