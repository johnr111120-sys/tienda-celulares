let cantidadAnteriorPedidos = 0;

let productos = JSON.parse(localStorage.getItem("productos")) || [];

function cargarAdmin(){
   const cont = document.getElementById("listaAdmin");
   cont.innerHTML = "";

   productos.forEach(p => {
      cont.innerHTML += `
         <div class="card-admin">
            <img src="${p.imagen}" width="60">

            <input value="${p.nombre}" 
              onchange="editar('${p.id}','nombre',this.value)">

            <input type="number" value="${p.precio}" 
              onchange="editar('${p.id}','precio',this.value)">

            <input type="number" value="${p.stock || 0}" 
              onchange="editar('${p.id}','stock',this.value)">

            <button onclick="eliminar('${p.id}')">Eliminar</button>
         </div>
      `;
   });
}


function editar(id,campo,valor){
   const p = productos.find(x=>x.id==id);
   p[campo] = valor;
   guardar();
}


function eliminar(id){
   productos = productos.filter(p=>p.id!=id);
   guardar();
   cargarAdmin();
}


function nuevoProducto(){
   const nuevo = {
      id: Date.now(),
      nombre: "Nuevo producto",
      precio: 0,
      imagen: "",
      stock: 0
   };

   productos.push(nuevo);
   guardar();
   cargarAdmin();
}


function guardar(){
   localStorage.setItem("productos", JSON.stringify(productos));
}

cargarAdmin();


function cargarPedidos(){
   const cont = document.getElementById("listaPedidos");
   const filtro = document.getElementById("filtroEstado").value;
   const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
   if(pedidos.length > cantidadAnteriorPedidos){
   mostrarNotificacion("🛒 Nuevo pedido recibido");

   const audio = document.getElementById("sonidoPedido");
   if(audio) audio.play();
}

cantidadAnteriorPedidos = pedidos.length;
   actualizarEstadisticas();
   
   cont.innerHTML = "";

   // contador pendientes
   const pendientes = pedidos.filter(p => p.estado === "pendiente").length;
   document.getElementById("contadorPendientes").innerHTML =
      "Pedidos pendientes: " + pendientes;

   if(pedidos.length === 0){
      cont.innerHTML = "<p>No hay pedidos aún</p>";
      return;
   }

  pedidos
.filter(p => filtro === "todos" || p.estado === filtro)
.slice()
.reverse()
.forEach(p => {

      let productosHTML = "";

      if (Array.isArray(p.productos)) {
         p.productos.forEach(prod => {
            const nombre = prod.nombre || "Producto";
            const precio = Number(prod.precio) || 0;

            productosHTML += `
               <div style="margin-left:10px; font-size:14px;">
                  • ${nombre} — $${precio.toLocaleString()}
               </div>
            `;
         });
      }

      const totalSeguro = Number(p.total) || 0;

     let claseEstado = "";

if(p.estado === "pendiente") claseEstado = "estado-pendiente";
if(p.estado === "enviado") claseEstado = "estado-enviado";
if(p.estado === "entregado") claseEstado = "estado-entregado";

cont.innerHTML += `
   <div class="pedido-card ${claseEstado}">
            <strong>Pedido #${p.id}</strong><br>
            Fecha: ${p.fecha}<br>
            Total: $${totalSeguro.toLocaleString()}<br><br>

            <strong>Productos:</strong>
            ${productosHTML || "Sin productos"}

            <br><br>
            Estado:
            <select onchange="cambiarEstado(${p.id}, this.value)">
               <option value="pendiente" ${p.estado==="pendiente"?"selected":""}>Pendiente</option>
               <option value="enviado" ${p.estado==="enviado"?"selected":""}>Enviado</option>
               <option value="entregado" ${p.estado==="entregado"?"selected":""}>Entregado</option>
            </select>
         </div>
      `;
   });
}


function actualizarEstadisticas(){
   const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

   const hoy = new Date().toLocaleDateString();

   let totalPedidos = pedidos.length;
   let pendientes = pedidos.filter(p => p.estado === "pendiente").length;

   let totalHoy = 0;

   pedidos.forEach(p => {
      if(p.fecha && p.fecha.includes(hoy)){
         totalHoy += Number(p.total) || 0;
      }
   });

   document.getElementById("totalPedidos").innerText = totalPedidos;
   document.getElementById("totalPendientes").innerText = pendientes;
   document.getElementById("totalHoy").innerText = totalHoy.toLocaleString();
}


function cambiarEstado(id, estado){
   let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

   const index = pedidos.findIndex(p => p.id == id);
   if(index !== -1){
      pedidos[index].estado = estado;
   }

   localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

console.log("Pedidos cargados");
cargarPedidos();


function mostrarNotificacion(texto){
   const div = document.createElement("div");
   div.innerText = texto;
   div.style.position = "fixed";
   div.style.top = "20px";
   div.style.right = "20px";
   div.style.background = "#000";
   div.style.color = "#fff";
   div.style.padding = "12px 20px";
   div.style.borderRadius = "6px";
   div.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
   div.style.zIndex = "9999";

   document.body.appendChild(div);

   setTimeout(()=>{
      div.remove();
   },3000);
}

// Auto refresh cada 5 segundos
setInterval(() => {
   cargarPedidos();
}, 5000);
