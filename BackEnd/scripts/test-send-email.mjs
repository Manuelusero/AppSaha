import dotenv from 'dotenv';
// Cargar .env específico del BackEnd para no depender del cwd
dotenv.config({ path: './BackEnd/.env' });

(async () => {
    try {
        const mod = await import('../dist/utils/notifications.js');
        const { sendEmailVerification } = mod;
        const result = await sendEmailVerification('test@example.com', 'Prueba', 'https://example.com/verify');
        console.log('Resultado sendEmailVerification:', result);
    } catch (err) {
        console.error('Error ejecutando sendEmailVerification:', err);
    }
})();
