const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

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

// Endpoint POST /api/productos
app.post("/api/productos", (req, res) => {
    const filePath = path.join(__dirname, "data", "productos.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error leyendo productos.json:", err);
            return res.status(500).json({ error: "No se pudo leer el archivo de productos" });
        }

        const productos = JSON.parse(data);
        const nuevoProducto = req.body;

        nuevoProducto.id = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
        productos.push(nuevoProducto);

        fs.writeFile(filePath, JSON.stringify(productos, null, 2), "utf8", (err) => {
            if (err) {
                console.error("Error guardando productos.json:", err);
                return res.status(500).json({ error: "No se pudo guardar el producto" });
            }

            res.status(201).json({
                mensaje: "Producto agregado correctamente",
                producto: nuevoProducto,
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
