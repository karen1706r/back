const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

// Definir la ruta de predicción
router.get('/predict-sales', (req, res) => {
    exec('python3 ./scripts/predict_sales.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando el script de predicción: ${error.message}`);
            return res.status(500).send(`Error al ejecutar predicción: ${error.message}`);
        }

        // Si stderr contiene advertencias que no queremos considerar errores, las ignoramos
        if (stderr && !stderr.includes("Importing plotly failed")) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send(`Error en el script de predicción: ${stderr}`);
        }

        // Intenta parsear la salida de stdout para asegurarse de que sea un JSON válido
        try {
            console.log("Salida stdout del script:", stdout); // Imprime la salida para verificarla
            const prediction = JSON.parse(stdout); // Convierte la salida en JSON
            res.json(prediction); // Envía la predicción al frontend
        } catch (parseError) {
            console.error('Error al parsear la respuesta de Python:', parseError);
            console.error('Salida de stdout:', stdout); // Registro de la salida para diagnóstico
            res.status(500).send(`Error al procesar los datos de predicción: ${parseError.message}`);
        }
    });
});

module.exports = router;
