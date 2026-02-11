const fs = require("fs");
const productos = require("./productos.json");

productos.forEach(p => {

  const slug = p.nombre
    .toLowerCase()
    .replace(/\s+/g, "-");

  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>${p.nombre} | Mi Negocio</title>
    <meta name="description" content="Compra ${p.nombre} al mejor precio en Santiago RD">
  </head>
  <body>
    <h1>${p.nombre}</h1>
    <img src="../${p.imagen}" alt="${p.nombre}">
    <p>Precio: $${p.precio}</p>
  </body>
  </html>
  `;

  fs.mkdirSync(`./dist/producto/${slug}`, { recursive: true });
  fs.writeFileSync(`./dist/producto/${slug}/index.html`, html);
});

console.log("Productos generados 🚀");
