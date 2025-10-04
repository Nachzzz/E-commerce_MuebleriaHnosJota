const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Endpoint GET /api/productos
app.get("/api/productos", (req, res) => {
    const filePath = path.join(__dirname, "data", "productos.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error leyendo productos.json:", err);
            return res.status(500).json({ error: "No se pudo leer el archivo de productos" });
        }

        const productos = JSON.parse(data);
        res.json(productos);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});