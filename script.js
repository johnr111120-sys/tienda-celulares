
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function router() {
  const path = window.location.pathname;

  // /productos/iphone
  if (path.startsWith("/productos/")) {
    const subcategoria = path.split("/")[2];
    mostrarProductosPorSubcategoria(
      capitalizar(subcategoria)
    );
  }
}

window.addEventListener("popstate", router);

function navegar(url) {
  history.pushState({}, "", url);
  router();
}

const imgModal = document.getElementById("img-modal");
const imgModalSrc = document.getElementById("img-modal-src");

function abrirImgModal(src){
  imgModalSrc.src = src;
  imgModal.style.display = "flex";
  document.body.classList.add("modal-abierto");
}

function cerrarImgModal(){
  imgModal.style.display = "none";
  imgModalSrc.src = "";
  document.body.classList.remove("modal-abierto");
}

imgModal?.addEventListener("click", e => {
  if(e.target === imgModal) cerrarImgModal();
});

const modalProducto = document.getElementById("modal-producto");

function abrirProducto(img, titulo, desc, precio, mensaje){
  document.getElementById("mp-img").src = img;
  document.getElementById("mp-titulo").textContent = titulo;
  document.getElementById("mp-desc").textContent = desc;
  document.getElementById("mp-precio").textContent = precio;

  document.getElementById("mp-whatsapp").href =
    "https://wa.me/18292017321?text=" + encodeURIComponent(mensaje);

  modalProducto.classList.add("activo");
  document.body.classList.add("modal-abierto");
}

function cerrarProducto(){
  modalProducto.classList.remove("activo");
  document.body.classList.remove("modal-abierto");
}

modalProducto?.addEventListener("click", e => {
  if (e.target === modalProducto) cerrarProducto();
});

let productos = [];

fetch("productos.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    console.log("JSON cargado OK", productos);
    router(); // 👈 importante
  })
  .catch(err => console.error("Error JSON", err));

function mostrarProductosPorSubcategoria(subcategoria) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  const filtrados = productos.filter(
    p => p.subcategoria === subcategoria
  );

  if (!filtrados.length) {
    contenedor.innerHTML = "<p>No hay productos</p>";
    return;
  }

  filtrados.forEach(p => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${p.imagen}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
    `;

    div.onclick = () => abrirProducto(
      p.imagen,
      p.nombre,
      `Producto ${p.subcategoria}`,
      `$${p.precio}`,
      `Hola, quiero información sobre ${p.nombre}`
    );

    contenedor.appendChild(div);
  });
}

<script>
document.querySelectorAll(".subcategoria").forEach(item => {
  item.addEventListener("click", () => {
    const sub = item.dataset.subcategoria.toLowerCase();
    navegar(`/productos/${sub}`);

    // cerrar menú
    document.getElementById("menu-categorias").classList.remove("activo");
    document.getElementById("menu-overlay").classList.remove("activo");
    document.body.classList.remove("menu-abierto");
  });
});
</script>
