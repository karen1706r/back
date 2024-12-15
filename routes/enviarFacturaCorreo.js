const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');

// Configuración de Multer para manejar la subida de archivos
const upload = multer();

// Ruta para enviar la factura por correo
router.post('/', upload.single('pdf'), async (req, res) => {
    const { email } = req.body; // Email del destinatario
    const file = req.file; // Archivo PDF de la factura

    // Logs para depuración
    console.log('Cuerpo de la petición:', req.body);
    console.log('Archivo recibido:', file);

    // Validar el correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        console.error('Correo electrónico no válido:', email);
        return res.status(400).json({ error: 'Correo electrónico no válido' });
    }

    // Validar que se haya recibido un archivo
    if (!file) {
        console.error('No se ha recibido el archivo');
        return res.status(400).json({ error: 'No se ha recibido el archivo' });
    }

    // Configura Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'skclenterprise@gmail.com', 
            pass: 'chmv mssa fjjn aabn' // Usa tu contraseña de aplicación
        }
    });

    // Configuración del correo electrónico con adjunto
    const mailOptions = {
        from: 'skclenterprise@gmail.com',
        to: email,
        subject: 'Tu Factura de Amor a la Mexicana',
        text: `Hola, Gracias por tu compra en Amor a la Mexicana. Enviamos tu factura para que puedas revisarla. Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos. ¡Que tengas un gran día! Saludos, El equipo de Amor a la Mexicana`,
        attachments: [
            {
                filename: file.originalname,
                content: file.buffer // Aquí se adjunta el archivo PDF
            }
        ]
    };
    

    try {
        // Enviar el correo
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error enviando correo:', error);
        res.status(500).json({ error: 'Hubo un problema al enviar el correo', details: error.toString() });
    }
});

module.exports = router;
