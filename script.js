
console.log("script.js cargado correctamente ✅");

// ==========================
// ELEMENTOS PRINCIPALES
// ==========================
const menu = document.getElementById("menu-lateral");
const btnMenu = document.getElementById("btn-menu");
const overlay = document.getElementById("overlay");
const contenedorProductos = document.getElementById("productos");

// ==========================
// MENÚ OVERLAY
// ==========================
btnMenu.addEventListener("click", () => {
  menu.classList.add("abierto");
  overlay.classList.add("activo");
  document.body.style.overflow = "hidden";
});

overlay.addEventListener("click", cerrarMenu);

function cerrarMenu() {
  menu.classList.remove("abierto");
  overlay.classList.remove("activo");
  document.body.style.overflow = "";
}

// ==========================
// ROUTER SPA BÁSICO
// ==========================
function navegar(url) {
  history.pushState({}, "", url);
  cargarVista(url);
  cerrarMenu();
}

// cuando el usuario usa atrás / adelante
window.addEventListener("popstate", () => {
  cargarVista(location.pathname);
});

// ==========================
// CARGA DE VISTAS
// ==========================
function cargarVista(ruta) {
  console.log("Navegando a:", ruta);

  if (ruta.startsWith("/productos/")) {
    const categoria = ruta.split("/").pop();
    cargarProductos(categoria);
  } else {
    contenedorProductos.innerHTML = "<h2>Bienvenido</h2>";
  }
}

// ==========================
// PRODUCTOS (placeholder)
// ==========================
function cargarProductos(categoria) {
  contenedorProductos.innerHTML = `
    <h2>${categoria.toUpperCase()}</h2>
    <p>Aquí se cargarán los productos desde JSON</p>
  `;
}

// ==========================
// CARGA INICIAL
// ==========================
cargarVista(location.pathname);

