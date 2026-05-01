import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import providersRouter from './routes/providers.js';
import bookingsRouter from './routes/bookings.js';
import reviewsRouter from './routes/reviews.js';
import supportRouter from './routes/support.js';
import messagesRouter from './routes/messages.js';
import favoritesRouter from './routes/favorites.js';
import cronRouter from './routes/cron.js';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares CORS - Configuración para desarrollo y producción
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Permitir requests sin origin (como desde Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      process.env.FRONTEND_URL,
      'https://serco-eosin.vercel.app',
      'https://app-saha.vercel.app',
    ].filter(Boolean); // Eliminar valores undefined/null
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS: Origin no permitido:', origin);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200 // Para navegadores antiguos
};

// Aplicar CORS
app.use(cors(corsOptions));

// Middleware adicional para debugging CORS
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta uploads (solo en local/no-Vercel)
// En Vercel serverless usar almacenamiento externo como Cloudinary
if (!process.env.VERCEL) {
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API funcionando correctamente! 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rutas de API
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/providers', providersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/support', supportRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/cron', cronRouter);

// Manejo de errores básico
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl 
  });
});

// Export app for Vercel
export default app;

// Solo iniciar servidor si no estamos en Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌍 URL: http://localhost:${PORT}`);
    console.log(`📋 Rutas disponibles:`);
    console.log(`   AUTH:`);
    console.log(`   - POST /api/auth/signup - Registro de proveedores`);
    console.log(`   - POST /api/auth/signup-client - Registro de clientes`);
    console.log(`   - POST /api/auth/login - Login`);
    console.log(`   - GET  /api/auth/me - Usuario actual`);
    console.log(`   PROVIDERS:`);
    console.log(`   - POST /api/providers/register - Registro de proveedor con archivos`);
    console.log(`   - GET  /api/providers - Listar proveedores`);
    console.log(`   - GET  /api/providers/:id - Detalle de proveedor`);
    console.log(`   FILES:`);
    console.log(`   - GET  /uploads/:folder/:filename - Servir archivos estáticos`);
    console.log(`   BOOKINGS:`);
    console.log(`   - POST /api/bookings - Crear solicitud`);
    console.log(`   - GET  /api/bookings - Listar solicitudes`);
    console.log(`   - PATCH /api/bookings/:id/status - Actualizar estado`);
    console.log(`   REVIEWS:`);
    console.log(`   - POST /api/reviews - Crear reseña`);
    console.log(`   - GET  /api/reviews/provider/:providerId - Reseñas de proveedor`);
    console.log(`   - GET  /api/reviews/booking/:bookingId - Reseña de booking`);
    console.log(`   - PATCH /api/reviews/:id/response - Responder reseña`);
  });
}
