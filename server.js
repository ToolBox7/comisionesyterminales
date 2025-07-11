const express = require('express');
const path = require('path');
const fs = require('fs');
const basicAuth = require('express-basic-auth');
const app = express();

// Configuración básica
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Autenticación para el panel de admin
const authMiddleware = basicAuth({
    users: { admin: process.env.ADMIN_PASSWORD || 'admin123' },
    challenge: true,
    realm: 'Panel de Administración'
});

// Rutas de la API
app.get('/api/terminals', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'public/data/terminals.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Error al leer terminales:', err);
        res.status(500).json({ error: 'Error al cargar terminales' });
    }
});

app.post('/api/terminals', authMiddleware, (req, res) => {
    try {
        const terminals = req.body;
        fs.writeFileSync(
            path.join(__dirname, 'public/data/terminals.json'), 
            JSON.stringify(terminals, null, 2)
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Error al guardar terminales:', err);
        res.status(500).json({ error: 'Error al guardar terminales' });
    }
});

// Ruta para el panel de admin
app.get('/admin', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin/index.html'));
});

// Todas las demás rutas van al index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});