import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurar que las carpetas existan
const uploadsDir = path.join(__dirname, '../../uploads');
const profileDir = path.join(uploadsDir, 'profile');
const dniDir = path.join(uploadsDir, 'dni');
const certificatesDir = path.join(uploadsDir, 'certificates');
const portfolioDir = path.join(uploadsDir, 'portfolio');

[uploadsDir, profileDir, dniDir, certificatesDir, portfolioDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadsDir;
    
    // Determinar la carpeta según el fieldname
    switch (file.fieldname) {
      case 'fotoPerfil':
        uploadPath = profileDir;
        break;
      case 'fotoDniFrente':
      case 'fotoDniDorso':
        uploadPath = dniDir;
        break;
      case 'certificados':
        uploadPath = certificatesDir;
        break;
      case 'fotosTrabajos':
        uploadPath = portfolioDir;
        break;
      default:
        uploadPath = uploadsDir;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único con timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, name);
  }
});

// Filtro de archivos (solo imágenes y PDFs)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, gif) y PDFs'));
  }
};

// Configuración de multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB por archivo
  },
  fileFilter: fileFilter
});

// Middleware para manejar múltiples archivos del registro de proveedor
export const uploadProviderFiles = upload.fields([
  { name: 'fotoPerfil', maxCount: 1 },
  { name: 'fotoDniFrente', maxCount: 1 },
  { name: 'fotoDniDorso', maxCount: 1 },
  { name: 'certificados', maxCount: 5 },
  { name: 'fotosTrabajos', maxCount: 5 }
]);
