import express from 'express';

const router = express.Router();

// Endpoint para recibir mensajes de contacto
router.post('/contact', async (req, res) => {
  try {
    const { nombre, email, asunto, mensaje } = req.body;

    // Validar datos
    if (!nombre || !email || !asunto || !mensaje) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'El formato del email no es válido' 
      });
    }

    // Por ahora solo guardamos en consola
    // TODO: Implementar envío de email real con nodemailer o servicio similar
    console.log('📧 Nuevo mensaje de soporte recibido:');
    console.log('==========================================');
    console.log('Fecha:', new Date().toISOString());
    console.log('Nombre:', nombre);
    console.log('Email:', email);
    console.log('Asunto:', asunto);
    console.log('Mensaje:', mensaje);
    console.log('==========================================\n');

    res.status(200).json({ 
      success: true,
      message: 'Mensaje recibido correctamente. Te responderemos a la brevedad.' 
    });

  } catch (error) {
    console.error('Error al procesar mensaje de soporte:', error);
    res.status(500).json({ 
      error: 'Error al procesar tu mensaje. Por favor, intentá nuevamente.' 
    });
  }
});

export default router;
