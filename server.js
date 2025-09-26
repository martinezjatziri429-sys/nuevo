const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

// 1. Indicar a Express que la carpeta con los archivos públicos es 'frontend/practicas'
// Esta línea ya está correcta. Mantiene 'practicas' como la carpeta raíz para archivos estáticos.
const publicPath = path.join(__dirname, 'frontend', 'practicas');
app.use(express.static(publicPath));

// 2. Definir la ruta de inicio ('/')
// Ahora, al visitar localhost:3000, se servirá el archivo HTML de la carpeta 'PAGIAN DE INICIO'.
app.get('/', (req, res) => {
    // La función path.join crea una ruta segura para diferentes sistemas operativos.
    // __dirname apunta a la carpeta donde se encuentra tu archivo de servidor.
    // Luego, navegas a las carpetas 'frontend', 'practicas', y 'PAGIAN DE INICIO' para encontrar el archivo.
    // El nombre del archivo HTML que quieres servir debe ser el que corresponda a la página de inicio.
    res.sendFile(path.join(publicPath, 'PAGIAN DE INICIO', 'paginainicio.html'));
});

// 3. Configuración de la API para el Leaderboard del juego (se mantiene igual)
app.use(cors());
app.use(express.json());

const SCORES_FILE = path.join(__dirname, 'scores.json');

app.get('/scores', (req, res) => {
    fs.readFile(SCORES_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading scores file:", err);
            return res.json([]);
        }
        res.json(JSON.parse(data));
    });
});

app.post('/scores', (req, res) => {
    const newScore = req.body;
    fs.readFile(SCORES_FILE, 'utf8', (err, data) => {
        const scores = (err || !data) ? [] : JSON.parse(data);
        scores.push(newScore);
        fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Error writing scores file:", writeErr);
                return res.status(500).send('Error al guardar la puntuación.');
            }
            res.status(201).send('Puntuación guardada');
        });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor iniciado. Visita http://localhost:${PORT} para ver tu portafolio.`);
});