/* ===============================
   VARIABLES GLOBALES
=================================*/

let productos = [];


/* ===============================
   CARGAR JSON
=================================*/

fetch("productos.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    console.log("✅ Productos cargados");
    router(); // ejecutar router cuando ya cargó el JSON
  })
  .catch(err => console.error("❌ Error cargando JSON", err));


/* ===============================
   NAVEGACIÓN SPA
=================================*/

function navegar(url) {
  history.pushState({}, "", url);
  router();
}

window.addEventListener("popstate", router);


/* ===============================
   ROUTER PRINCIPAL
=================================*/

function router() {

  const path = window.location.pathname;

  // /productos/Iphone
  if (path.startsWith("/productos/")) {
    const subcategoria = decodeURIComponent(
      path.split("/productos/")[1]
    );
    mostrarProductosPorSubcategoria(subcategoria);
    return;
  }

  // /producto/iphone-11
  if (path.startsWith("/producto/")) {
    const slug = path.split("/producto/")[1];
    const producto = productos.find(p => p.slug === slug);

    if (producto) {
      abrirProducto(
        producto.imagen,
        producto.nombre,
        `Producto ${producto.subcategoria}`,
        `$${producto.precio}`,
        `Hola, quiero información sobre ${producto.nombre}`
      );
    }

    return;
  }

  // inicio
  document.getElementById("productos").innerHTML = "";
}


/* ===============================
   MOSTRAR PRODUCTOS
=================================*/

function mostrarProductosPorSubcategoria(subcategoria) {

  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  const filtrados = productos.filter(
    p => p.subcategoria === subcategoria
  );

  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p>No hay productos</p>";
    return;
  }

  filtrados.forEach(p => {

    const div = document.createElement("div");
    div.className = "producto";

    div.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
    `;

    // Click abre URL del producto
    div.addEventListener("click", () => {
      navegar("/producto/" + p.slug);
    });

    contenedor.appendChild(div);
  });
}


/* ===============================
   CLICK EN SUBCATEGORÍAS
=================================*/

document.querySelectorAll(".subcategoria").forEach(sub => {

  sub.addEventListener("click", () => {

    const nombre = sub.dataset.subcategoria;

    navegar("/productos/" + encodeURIComponent(nombre));

    // cerrar menú
    document.getElementById("menu-categorias")
      .classList.remove("activo");

    document.getElementById("menu-overlay")
      .classList.remove("activo");
  });

});
